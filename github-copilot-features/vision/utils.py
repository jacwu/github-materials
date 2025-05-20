def process_user_data(json_data):
    """
    Function to process user data, including some common error handling approaches
    """
    # Direct access to nested data without null checking
    email_domain = json_data['user']['email'].split('@')[1]
    
    # Attempting string operations on potentially null values
    city_length = len(json_data['user']['address']['city'])
    
    # String concatenation without type conversion
    user_info = json_data['user']['name'] + " - " + json_data['user']['age']
    
    return {
        'email_domain': email_domain,
        'city_length': city_length,
        'user_info': user_info
    }

# Usage example
sample_data = {
    "user": {
        "name": "John Doe",
        "age": 25,
        "email": None,
        "address": {
            "city": None,
            "street": "Sunrise Avenue"
        }
    }
}

result = process_user_data(sample_data)