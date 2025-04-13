from shape import Shape
import math

class Circle(Shape):
    def __init__(self, radius):
        super().__init__()
        self.name = "Circle"
        self.radius = radius
    