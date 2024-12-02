class Factorial:
    def __init__(self, value):
        self.value=value
        
    def factorial(self):
        self.n = self.value
        if self.n==1:
            return 1
        else:
            self.f_value=self.n*self.factorial()

