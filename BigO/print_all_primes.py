#!/usr/bin/pyhon3


def is_prime(n):
    if n<2:
        return False
    for k in range(2,n):
        if n%k==0:
            return False
    return True

def print_all_primes(array):
    for k in array:
        if is_prime(k):
            print(k)