#!/usr/bin/env python3
import socket
import ssl

# --- Configuration ---
host = 'www.alphavantage.co'
port = 443
# Path must start with a forward slash /
request_path = '/query?function=GLOBAL_QUOTE&symbol=NFLX&apikey=' 

# --- Connection and SSL Setup ---
mysocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
mysocket.connect((host, port))

context = ssl.create_default_context()
wrapped_socket = context.wrap_socket(mysocket, server_hostname=host)

# --- FIX: Correctly format the HTTP/1.1 request with the Host header ---
request_string = (
    f"GET {request_path} HTTP/1.1\r\n"
    f"Host: {host}\r\n"  # Mandatory Host header
    f"Connection: close\r\n"
    f"\r\n"               # End of headers
)
cmd = request_string.encode()
wrapped_socket.send(cmd)

# --- Receive Loop ---
response_data = b""
while True:
    data = wrapped_socket.recv(4096) 
    if not data:
        break
    response_data += data

wrapped_socket.close()
mysocket.close()

# Print the full response (should now contain a 200 OK status followed by JSON)
print(response_data.decode('utf-8'))