#!/usr/bin/python3

def is_prime(n):
    if n<2:
        return False
    for k in range(2,n):
        if n%k==0:
            return False
    return True