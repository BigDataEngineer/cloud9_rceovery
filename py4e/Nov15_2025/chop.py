#!/usr/bin/env python3


#Exercise 1: Write a function called chop that takes a list and modifies it, removing the first and last elements, and returns None. Then write a function called middle that takes a list and returns a new list that contains all but the first and last elements.
def trim(t):
    # del t[0]
    # del t[-1]
    # return None
# To create a new list and assign value of the argument to it and modify it. Will the func still trim the original list?
    # t1=t
    # del t1[0]
    # del t1[-1] 
    # return None

#If you intended to create and modify a copy so the original remains unchanged,
    t1=t.copy()
    del t1[0]
    del t1[-1]
    return t1

def middle(t):
    t1=t[1:-1]
    return t1

list1=[]

while True:
    inp=input('Enter any number: Done when finished')
    if inp=='Done':
        break
    inp=int(inp)
    list1.append(inp)
    print(list1)

print(trim(list1))
print(list1)

# print('func middle', middle(list1))