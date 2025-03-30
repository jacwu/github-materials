# a function to generate a random psswrod
# requirements:
# - the password must be at least 8 characters long
# - the password must contain at least one uppercase letter
# - the password must contain at least one lowercase letter
# - the password must contain at least one digit
# - the password must contain at least one special character
# - the password must not contain any spaces
def generate_random_password(length=12):
    import random
    import string

    if length < 8:
        raise ValueError("Password length must be at least 8 characters")

    # define the characters to use in the password
    lowercase = string.ascii_lowercase
    uppercase = string.ascii_uppercase
    digits = string.digits
    special = string.punctuation

    # create a pool of characters to choose from
    all_characters = lowercase + uppercase + digits + special

    # generate a random password
    password = ''.join(random.choice(all_characters) for _ in range(length))

    # ensure the password meets the requirements
    if (any(c.islower() for c in password) and
            any(c.isupper() for c in password) and
            any(c.isdigit() for c in password) and
            any(c in special for c in password)):
        return password
    else:
        return generate_random_password(length)