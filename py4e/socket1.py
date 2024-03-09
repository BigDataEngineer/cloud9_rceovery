import socket

mysocket = socket.socket()
mysocket.connect(('data.pr4e.org', 80))
cmd = 'GET http://data.pr4e.org/romeo.txt HTTP/1.0\r\n\r\n'.encode()
mysocket.send(cmd)

while True:
    data = mysocket.recv(512)
#    if len(data) < 1:
#        break
#    print(data.decode())
    
#mysocket.close()