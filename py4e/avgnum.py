#!/usr/bin/python3

value=0
count=0

while True:
    inp=input('Enter any number:Enter done when finished:')

    if inp=='done':
        break
    inp=float(inp)
    value=value+inp
    count=count+1
#    print(count)

print('Sum of all numbers',value)
print('count of all numbers',count)
print('Average:',value/count)