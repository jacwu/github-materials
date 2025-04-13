from shape import Shape
import math

class Triangle(Shape):
    def __init__(self, a, b, c):
        super().__init__()
        self.name = "Triangle"
        self.a = a
        self.b = b
        self.c = c