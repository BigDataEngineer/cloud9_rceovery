class Factorial:
    def __init__(self, value):
        self.value = value

    def factorial(self):
        if self.value == 0:
            return 1
        else:
            x=self.value-1
            return self.value * self.factorial()
"""
class Factorial:
    def __init__(self, value):
        self.value=value
        
    def factorial(self):
        if self.value==0:
            return 1
        else:
            return self.value*self.factorial(self.value-1)

"""
"""
def factorial(n):
    if n==0:
        return 1
    else:
        return n*factorial(n-1)
"""

