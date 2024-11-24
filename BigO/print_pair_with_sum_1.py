#!/usr/bin/python3

def print_pair_with_sum_1(array, target):
    for a in array:
        for b in array:
            if a+b==target:
                print(a,b)