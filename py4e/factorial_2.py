#!/usr/bin/python3

def factorial(n,level=1):
    print('Function call #', level, 'Value of n', n)
    if n==0:
        result=1
        print('returning', result,'From function call #',level, 'to function call #', level-1 )
        return result
    else:
        result=n*factorial(n-1, level+1)
        print('returning', result )
        return result