#!/usr/bin/env python3
import socket
import time
import ssl

# --- Configuration ---
host = 'alphavantage.co'
port = 443
request_path = "/query?function=GLOBAL_QUOTE&symbol=NFLX&apikey="

# --- 1. Create and Connect the Raw Socket ---
mysocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
mysocket.connect((host, port))

# --- 2. Wrap the Socket with TLS/SSL ---
context = ssl.create_default_context()
# FIX: Corrected the typo from .wrapsocket to .wrap_socket
wrapped_socket = context.wrap_socket(mysocket, server_hostname=host)

# --- 3. Prepare and Send the Correct HTTP Request ---
# FIX: Corrected the request format to include Host header and proper HTTP version
request = f"GET {request_path} HTTP/1.1\r\nHost: {host}\r\nConnection: close\r\n\r\n"
CMD = request.encode()

wrapped_socket.send(CMD)

# --- 4. Receive and Decode Data ---
response_data = b""
while True:
    data = wrapped_socket.recv(4096)
    if not data:
        break
    response_data += data
    # Removed time.sleep(5) as it only slows down data retrieval

# --- 5. Clean Up and Output ---
wrapped_socket.close() # Closes the wrapped socket
mysocket.close()       # Closes the raw socket (good practice)

print(response_data.decode('utf-8'))