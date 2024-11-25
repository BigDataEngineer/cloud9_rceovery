#!/usr/bin/python3

def find_common_elements_arrays(array1,array2):
    for k in array1:
        for y in array2:
            if k==y:
                print(k)
