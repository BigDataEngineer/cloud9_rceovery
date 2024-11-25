#!/usr/bin/python3

def create_table(array):
    min_value = min(array)
    max_value = max(array)
    
    # crate list of size (max-min+1)
    table = [0] * (max-min+1)
    return table