#!/usr/bin/env python3
import socket
'''
http://data.pr4e.org/romeo.txt

cmd

mysocket object

mysocket.connect() initiate a tcp connection
send cmd
GET http://data.pr4e.org/romeo.txt http/1.0\r\n\r\n

.recv

decode
print
close 

alpha vantage free api key

https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=NFLX&apikey=3CV39ZJZ3VTUHTLE

3CV39ZJZ3VTUHTLE

'''
mysocket=socket.socket()
url='http://data.pr4e.org/romeo.txt'
mysocket.connect(('data.pr4e.org',80))
cmd='GET http://data.pr4e.org/romeo.txt\r\n\r\n'.encode()
mysocket.send(cmd)

while True:

# for i in range(1):
    text=mysocket.recv(512).decode()
    if len(text) < 1:
        break
    # text='123'
    else:
        print(f'{text}')

mysocket.close()


