#!/usr/bin/python3

f_handle=open('mbox-short.txt')
for line in f_handle:
    if not line.startswith('From'):
        continue
    line=line.rstrip()
    global words=line.split()
    print(words)
    
print(words)
print(words[2])