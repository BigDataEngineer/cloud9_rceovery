#!/usr/bin/python3

class PartyAnimal:
    def __init__(self):
        self.x=0
        
    def party(self):
        self.x=self.x+1
        print(self,"so far",self.x)

an=PartyAnimal()
an.party()
PartyAnimal.party(an)
        
            
    