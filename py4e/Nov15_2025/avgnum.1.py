#!/usr/bin/env python3
# Write a program which takes inputs from users and calculates it avg.

list1=[]
# while True:
#     n=input("Enter any numeric value/Enter done when finished:")
#     if n=="done":
#         break
#     n_float=float(n)
#     list1.append(n_float)

# avg=(sum(list1)/len(list1))
# print(f"avg.{avg:.3f}")

# write it without usig sum or len
sum=0
len=0
while True:
    n=input('Enter any number/Done when finished: ')
    if n=='Done':
        break
    n=float(n)
    sum=sum+n
    len=len+1

avg=(sum/len)
print(f'avg. {avg:.2f}')




