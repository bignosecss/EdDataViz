import logging

# 配置日志
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")

def format_student_data(df):
    """
    封装数据处理逻辑：将原始数据格式化为前端需要的格式。
    """
    formatted_data = []
    for _, row in df.iterrows():
        try:
            # 格式化日期
            date_str = str(row["日期"])
            formatted_date = f"{date_str[:4]}年{date_str[4:6]}月{date_str[6:8]}日"

            # 格式化全对率为百分比
            correct_rate = round(row["全对率"] * 100, 1)
            formatted_correct_rate = f"{correct_rate}%"

            # 格式化综合正确率为百分比
            overall_rate = round(row["综合正确率"] * 100, 1)
            formatted_overall_rate = f"{overall_rate}%"

            # 添加到格式化后的数据列表
            formatted_data.append({
                "日期": formatted_date,
                "全对率": formatted_correct_rate,
                "综合正确率": formatted_overall_rate
            })
        except Exception as e:
            logging.error(f"Error formatting row: {row}, error: {str(e)}", exc_info=True)
            continue

    return formatted_data