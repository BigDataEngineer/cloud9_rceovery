#!/bin/usr/env python3
import sys

file_name=input("Enter file path: ")

try:
    file_handle=open(file_name) 
except:
    print("Could not find the file. Exiting..")
    sys.exit(1)
    
for line in file_handle:
    if len(line)>0 and line.startswith("From:"):
        
   