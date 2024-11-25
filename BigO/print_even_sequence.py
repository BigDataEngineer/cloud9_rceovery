#!/usr/bin/python3

def print_even_sequence(array):
    for a in array:
        if a%2 == 0:
            print('Sequence for emember {0}'.format(a))
            for k in range(1,a):
                print(k)
        
    