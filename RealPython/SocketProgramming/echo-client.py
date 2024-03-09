#!/usr/bin/env python3

#2 client initiates a connection

import socket
import time

HOST = "127.0.01"
PORT = 65432
#mysocket = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
#mysocket.connect((HOST, PORT))


#mysocket.sendall(b"Hello, World")
#data = mysocket.recv(1024)
with socket.socket(socket.AF_INET,socket.SOCK_STREAM) as s:
    s.connect((HOST,PORT))
    time.sleep(10)
    
# 3 Data is exchanged
#    input_data=input("Enter data to be sent to server: ")
#    s.sendall(input_data.encode())
    s.sendall(b"Hello, World")
    data = s.recv(1024)
    
print(f"Received {data}")