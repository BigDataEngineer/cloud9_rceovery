import socket

HOST="127.0.0.1"
PORT=65432

with socket.socket(socket.AF_INET,socket.SOCK_STREAM) as s:
    s.connect((HOST,PORT))
    s.send(b"Hello, Worlyyyyyyyyyyyyyyyyyyyyyyyyyd")
    data=s.recv(1024)
    
#print(f"{data}!r")    
print(f"Received {data!r}")