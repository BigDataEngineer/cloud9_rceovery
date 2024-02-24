#!/usr/bin/python3
usr_string=input("Enter any string: ")
range=-len(usr_string)
print("range",range)
n=-1
while n >= range:
    print("Character at index ",n,"is",usr_string[n])
    n=n-1
    