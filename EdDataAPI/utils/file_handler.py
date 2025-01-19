import pandas as pd
import shutil
import os
import logging

def convert_excel_to_csv(excel_file_path: str) -> str:
    # 步骤 3.1：读取 Excel 文件
    df = pd.read_excel(excel_file_path)

    # 步骤 3.2：将数据保存为 CSV 文件
    csv_file_path = excel_file_path.replace(".xlsx", ".csv")
    df.to_csv(csv_file_path, index=False, encoding="utf-8")

    return csv_file_path

def save_csv_to_students_data(csv_file_path: str):
    # 步骤 4.1：定义目标路径
    destination_path = os.path.join("students-data", os.path.basename(csv_file_path))

    # 步骤 4.2：将 CSV 文件移动到 students-data 目录
    shutil.move(csv_file_path, destination_path)

import os

def cleanup_temp_file(file_path: str):
    if os.path.exists(file_path):
        os.remove(file_path)
        logging.debug(f"Temporary file cleaned up: {file_path}")
    else:
        logging.debug(f"Temporary file does not exist: {file_path}")
