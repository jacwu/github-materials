# This code is generated by GitHub Copilot (VS Code)
import unittest
from calc import Calculator, AdvancedCalculator

class TestCalculator(unittest.TestCase):
    def setUp(self):
        self.calc = Calculator()
        self.adv_calc = AdvancedCalculator()

    # Test Case - GitHub Copilot generated: Test basic calculator addition
    def test_add(self):
        self.assertEqual(self.calc.add(3, 5), 8)
        self.assertEqual(self.calc.add(-1, 1), 0)
        self.assertEqual(self.calc.add(0, 0), 0)

    # Test Case - GitHub Copilot generated: Test basic calculator subtraction
    def test_subtract(self):
        self.assertEqual(self.calc.subtract(5, 3), 2)
        self.assertEqual(self.calc.subtract(1, 1), 0)
        self.assertEqual(self.calc.subtract(0, 5), -5)

    # Test Case - GitHub Copilot generated: Test basic calculator multiplication
    def test_multiply(self):
        self.assertEqual(self.calc.multiply(3, 5), 15)
        self.assertEqual(self.calc.multiply(-2, 3), -6)
        self.assertEqual(self.calc.multiply(0, 5), 0)

    # Test Case - GitHub Copilot generated: Test basic calculator division
    def test_divide(self):
        self.assertEqual(self.calc.divide(6, 2), 3)
        self.assertEqual(self.calc.divide(5, 2), 2.5)
        self.assertEqual(self.calc.divide(-6, 2), -3)
        with self.assertRaises(ValueError):
            self.calc.divide(5, 0)

    # Test Case - GitHub Copilot generated: Test advanced calculator square root
    def test_square_root(self):
        self.assertEqual(self.adv_calc.square_root(0), 0)
        self.assertEqual(self.adv_calc.square_root(4), 2)
        self.assertEqual(self.adv_calc.square_root(2), 2 ** 0.5)
        with self.assertRaises(ValueError):
            self.adv_calc.square_root(-1)

    # Test Case - GitHub Copilot generated: Test advanced calculator power
    def test_power(self):
        self.assertEqual(self.adv_calc.power(2, 3), 8)
        self.assertEqual(self.adv_calc.power(2, 0), 1)
        self.assertEqual(self.adv_calc.power(0, 5), 0)
        self.assertEqual(self.adv_calc.power(2, -1), 0.5)

    # Test Case - GitHub Copilot generated: Test advanced calculator factorial
    def test_factorial(self):
        self.assertEqual(self.adv_calc.factorial(0), 1)
        self.assertEqual(self.adv_calc.factorial(1), 1)
        self.assertEqual(self.adv_calc.factorial(5), 120)
        with self.assertRaises(ValueError):
            self.adv_calc.factorial(-1)

if __name__ == '__main__':
    unittest.main()