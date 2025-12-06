#!/usr/bin/env python3
import socket
import ssl

MY_API_KEY='3CV39ZJZ3VTUHTLE'
host='www.alphavantage.co'
port=443

mysocket=socket.socket()
mysocket.connect((host, port))

context=ssl.create_default_context()
wrapped_socket=context.wrap_socket(mysocket, server_hostname=host)
path='/query?function=GLOBAL_QUOTE&symbol=NFLX&apikey='

# cmd=f'GET https:{path}{MY_API_KEY} HTTP/1.1\r\nHost: {host}\r\n'
cmd=(
    f'GET {path}&apikey={MY_API_KEY} HTTP/1.1\r\n'
    f'Host: {host}\r\n'
    f'Connection: close\r\n'
    f'\r\n' # The critical blank line separating headers from body
)
wrapped_socket.send(cmd.encode())
data=wrapped_socket.recv(1000000)
print(data.decode())

# while True:
#     if len(data) < 1:
#         break
#     else:
#         print(f'{data.decode()}')



'''
https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=NFLX&apikey=MY_API_KEY'

import socket?
create socket object

ssl define crette to wrap the socket object, before connection ? yes for ssl/tls handshake? or after connection?

wrap?
context.wrap_

define cmd

'''

'''
class Solution:
    def get_quote(self):
        mysocket=socket.socket()
        mysocket.connect((host, port))

        context=ssl.create_default_context()
        wrapped_socket=context.wrap_socket(mysocket)
        path='/query?function=GLOBAL_QUOTE&symbol=NFLX&apikey='

        cmd=f'GET https:{path}{MY_API_KEY}'
        wrapped_socket.send(cmd.encode())
        data=wrapped_socket.recv(512)

        while True:
            if len(data) < 1:
                break
            else:
                print(f'{data.decode()}')
'''

            





