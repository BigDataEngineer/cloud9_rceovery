#!/usr/bin/python3

def print_pairs_with_sum(array, target):
    for left in range(len(array)):
        for right in range(left+1, len(array)):
            a = array[left]
            b = array[right]
            if a + b == target:
                print(a, b)