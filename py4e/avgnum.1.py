#!/usr/bin/python3

list1=[]

while True:
    inp=input('Enter any number/done when finished')
    if inp=='done':
        break
    value=float(inp)
    list1.append(inp)
print('list',list1)
avg=float(sum(list1)/len(list1))
print('list',list1)
print('list length',len(list1))
print('list sum',sum(list1))
print('list avg',sum(avg))
