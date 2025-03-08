# a class for calculation including addition, subtraction, multiplication and division
class Calculator:
    def add(self, a, b):
        """Add two numbers"""
        return a + b
    
    def subtract(self, a, b):
        """Subtract two numbers"""
        return a - b
    
    def multiply(self, a, b):
        """Multiply two numbers"""
        return a * b
    
    def divide(self, a, b):
        """Divide two numbers"""
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b
    
# a class for advanced calculation including square root, power and factorial
class AdvancedCalculator(Calculator):
    def square_root(self, a):
        """Calculate the square root of a number"""
        if a < 0:
            raise ValueError("Cannot calculate square root of a negative number")
        return a ** 0.5
    
    def power(self, a, b):
        """Calculate the power of a number"""
        return a ** b
    
    def factorial(self, a):
        """Calculate the factorial of a number"""
        if a < 0:
            raise ValueError("Cannot calculate factorial of a negative number")
        if a == 0 or a == 1:
            return 1
        return a * self.factorial(a - 1)