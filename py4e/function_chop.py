#!/usr/bin/python3
#Write a function called chop that takes a list and modifies it, removing the first and last elements, and returns None. Then write a function called middle that takes a list and returns a new list that contains all but the first and last elements.

def chop(inp_list):
    del inp_list[0]
    del inp_list[-1]
    return None
    
def middle(inp_list):
    ret_list=inp_list[1:-1]
    return ret_list    

usr_list=list()

while True:
    element=input("Enter an integer/Done when done!: ")
    if element=='Done':
        break
    usr_list.append(element)
    
new_list=middle(usr_list)
print(new_list)

 
 