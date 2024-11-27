#!/usr/bin/python3

class PartyAnimal:
    def __init__(self):
        self.x=0
        
    def party(self):
        self.x=self.x+1
        print('So far x is', self.x)
    
    def __del__(self):
        print('Destruct x which is', self.x)