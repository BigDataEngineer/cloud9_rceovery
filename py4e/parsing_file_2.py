#!/usr/bin/python3


counter=0
f_handle=open('/home/ec2-user/cloud9_rceovery/py4e/mbox-short.txt')
for line in f_handle:
    counter=counter+1
    
    if not line.startswith('From'):
        continue
    line=line.rstrip()
    words=line.split()
    if len(words)<3:
        continue
    print(counter)
    print(words)
    print(words[2])