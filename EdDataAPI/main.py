from fastapi import FastAPI, File, Path, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import logging

import pandas as pd
from utils import convert_excel_to_csv, save_csv_to_students_data, cleanup_temp_file, format_student_data

app = FastAPI()
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 确保保存 CSV 文件的目录存在
os.makedirs("students-data", exist_ok=True)
os.makedirs("temp", exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Hello World"}

ALLOWED_EXTENSIONS = {".xlsx"}
@app.post("/api/upload/file")
async def handle_student_file(file: UploadFile = File(...)):
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        return JSONResponse(content={"message": "Invalid file type. Only .xlsx and .xls files are allowed."}, status_code=400)

    try:
        logging.debug(f"Received file: {file.filename}")

        # 将上传的文件保存到临时位置
        file_path = f"temp/{file.filename}"
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        logging.debug(f"File saved to: {file_path}")

        # 将 Excel 文件转换为 CSV 文件
        csv_file_path = convert_excel_to_csv(file_path)
        logging.debug(f"Excel converted to CSV: {csv_file_path}")

        # 将 CSV 文件保存到 students-data 目录
        save_csv_to_students_data(csv_file_path)
        logging.debug(f"CSV saved to students-data")

        # 清理临时文件
        cleanup_temp_file(file_path)
        logging.debug(f"Temporary file cleaned up: {file_path}")

        return JSONResponse(content={"message": "File processed successfully"})
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}", exc_info=True)

        cleanup_temp_file(file_path)
        logging.debug(f"Temporary file cleaned up: {file_path}")

        return JSONResponse(content={"message": f"An error occurred: {str(e)}"}, status_code=500)
    
@app.get("/api/get-student-names")
async def get_student_names():
    try:
        # 确保 students-data 目录存在
        if not os.path.exists("students-data"):
            raise HTTPException(status_code=404, detail="Students data directory not found")
        
        # 获取 students-data 目录下的所有文件名
        student_files = os.listdir("students-data")

        # 过滤掉非文件项（如目录）
        student_names = [
            os.path.splitext(file)[0]  # 去掉文件扩展名，只保留文件名
            for file in student_files
            if os.path.isfile(os.path.join("students-data", file))
        ]

        return JSONResponse(content={"student_names": student_names})
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    
@app.get("/api/get-student-data/{student_name}")
async def get_student_data(student_name: str = Path(..., description="The name of the student")):
    try:
        logging.info(f"Received request for student: {student_name}")

        # 构建文件路径
        file_path = os.path.join("students-data", f"{student_name}.csv")
        logging.debug(f"File path: {file_path}")

        # 检查文件是否存在
        if not os.path.exists(file_path):
            logging.warning(f"File not found for student: {student_name}")
            raise HTTPException(status_code=404, detail=f"Student '{student_name}' not found")
        
        # 读取 CSV 文件
        logging.debug(f"Reading CSV file: {file_path}")
        df = pd.read_csv(file_path)

        # 处理数据
        logging.debug("Formatting student data")
        formatted_data = format_student_data(df)

        # 返回 JSON 响应
        logging.info(f"Successfully processed data for student: {student_name}")
        return JSONResponse(content={student_name: formatted_data})
    except HTTPException as he:
        raise he  # 直接抛出 HTTPException
    except Exception as e:
        logging.error(f"An error occurred while processing student data: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
