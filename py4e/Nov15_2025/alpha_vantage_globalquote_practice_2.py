#!/usr/bin/env python3
import socket
import ssl

'''
https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=NFLX&apikey=MY_API_KEY'
'''

mysocket=socket.socket()
mysocket.connect(('www.alphavantage.co',443))
mycontext=ssl.create_default_context()
securesocket=ssl.wrap_socket(mysocket, server_hostname='www.alphavantage.co')
path='/query?function=GLOBAL_QUOTE&symbol=NFLX&apikey='
MY_API_KEY='3CV39ZJZ3VTUHTLE'
host='www.alphavantage.co'
cmd=(
    f'GET {path}&apikey={MY_API_KEY} HTTP/1.1\r\n'
    f'Host: {host}\r\n'
    f'Connection: close\r\n'
    f'\r\n' # The critical blank line separating headers from body
)

mycontext.send(cmd.encode())

while True:
    data=mycontext.recv(512)
    if len(data)<1:
        break
    else:
        print(data.decode())

mycontext.close()
mysocket.close()