#!/usr/bin/env python3
import socket
import time
import ssl
import os
from dotenv import load_dotenv


load_dotenv()
MY_API_KEY = os.environ.get("MY_API_KEY")
url='https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=NFLX&apikey=MY_API_KEY'
port=443

mysocket=socket.socket()
mysocket.connect(('alphavantage.co',443))


context=ssl.create_default_context()
wrapped_socket=context.wrap_socket(mysocket,server_hostname='www.alphavantage.co')

def send_cmd():
    cmd=f'GET https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=NFLX&apikey={MY_API_KEY} HTTP/1.1\r\nHost: www.alphavantage.co\r\nConnection: close\r\n\r\n'.encode()
    wrapped_socket.send(cmd)


cmd=f'GET https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=NFLX&apikey={MY_API_KEY} HTTP/1.1\r\nHost: www.alphavantage.co\r\nConnection: close\r\n\r\n'.encode()
wrapped_socket.send(cmd)

while True:
    data=wrapped_socket.recv(512)
    if len(data) < 1:
        cmd=f'GET https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=NFLX&apikey={MY_API_KEY} HTTP/1.1\r\nHost: www.alphavantage.co\r\nConnection: close\r\n\r\n'.encode()
        wrapped_socket.send(cmd)
        data=wrapped_socket.recv(512)
        # wrapped_socket.send(cmd)
        # print(f'test')
        
        # break
    else:
        # print(f'sleeping')
        print(data.decode(), end='') 
        
        # time.sleep(5)

wrapped_socket.close()
mysocket.close()
