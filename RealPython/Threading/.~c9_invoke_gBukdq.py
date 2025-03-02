#!/usr/bin/env python3
#echo-server.py

import socket

# 1 - Server sets up a listening socket

HOST = '127.0.0.1'
PORT = 65432

with socket.socket(socket.AF_INET,socket.SOCK_STREAM) AS s:
    s.bind((HOST,PORT))
    s.listen()
    conn, addr = s.accept()
    
# 3 - Data is exchanged
with conn:
    print(f"connected by {addr}"")
    while True:
        data=conn.recv(1024)
        if not data
            break