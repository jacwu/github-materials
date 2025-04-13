from shape import Shape

class Rectangle(Shape):
    def __init__(self, width, height):
        super().__init__()
        self.name = "Rectangle"
        self.width = width
        self.height = height
