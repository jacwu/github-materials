def process_user_data(json_data):
    """
    处理用户数据的函数，包含一些常见的错误处理方式
    """
    # 直接访问嵌套数据而没有进行空值检查
    email_domain = json_data['user']['email'].split('@')[1]
    
    # 尝试对可能为null的值进行字符串操作
    city_length = len(json_data['user']['address']['city'])
    
    # 拼接字符串时没有进行类型转换
    user_info = json_data['user']['name'] + " - " + json_data['user']['age']
    
    return {
        'email_domain': email_domain,
        'city_length': city_length,
        'user_info': user_info
    }

# 使用示例
sample_data = {
    "user": {
        "name": "张三",
        "age": 25,
        "email": None,
        "address": {
            "city": None,
            "street": "朝阳路"
        }
    }
}

result = process_user_data(sample_data)