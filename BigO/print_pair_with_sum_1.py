#!/usr/bin/python3

def print_pair_with_sum_1(array, target):
    counter=0
    for a in array:
        for b in array:
            counter=counter+1
           # print('evaluating', a, b)
            print('counter', counter)
            if a+b==target:
                print('Match!!')
                print(a,b)