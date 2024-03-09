#!/usr/bin/env python3

#2 client initiates a connection

import socket
HOST = "127.0.01"
PORT = 65432
#mysocket = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
#mysocket.connect((HOST, PORT))


#mysocket.sendall(b"Hello, World")
#data = mysocket.recv(1024)
with socket.socket(socket.AF_INET,socket.SOCK_STREAM) as s:
    s.connect((HOST,PORT))
    
# 3 Data is exchanged
    s.sendall(b"Hello, World")
    data = s.recv(1024)
    
print(f"Received {data}")