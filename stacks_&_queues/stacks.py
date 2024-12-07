#!/usr/bin/python3
import sys

"""
LIFO data structure
Think of like stack of plates 
Operations, push/pop
push is adding new element
pop removing last element pushed

implement as a list
"""

inp=None
stack = []
while inp!='Done':
    inp=input('Input element to push/Done to finish:')

    try:
        inp=int(inp)
    except:
        print('Please enter only a int.')
        sys.exit(1)
        
    stack.append(inp)
    print(stack)
    