#!/usr/bin/env python3

'''
https://www.geeksforgeeks.org/python/multithreading-python-set-1/

'''
import threading
import time

def square(num):
    print(f'Square: {num*num}')
    time.sleep(300)

def cube(num):
    print(f'Cube: {num*num*num}')
    time.sleep(300)

t1=threading.Thread(target=square, args=(4,))
t2=threading.Thread(target=cube, args=(4,))

t1.start()
t2.start()

t1.join()
t2.join()
