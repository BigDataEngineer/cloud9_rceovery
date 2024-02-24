#!/usr/bin/env python3
f_handle=open('file.txt')
#file_content=f_handle.read()
n=1
for line in f_handle:
    print(n)
    print(line)
    print(n)
    n=n+1
