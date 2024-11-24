#!/usr/bin/python3

def print_pairs_with_sum(array, target):
    counter=0
    for left in range(len(array)):
        for right in range(left+1, len(array)):
            a = array[left]
            b = array[right]
            counter=counter+1
            print('Evaluating',a,b)
            print('Counter',counter)
            if a + b == target:
                print('Match!')
                print(a, b)