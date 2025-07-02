#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 8081
DIRECTORY = "dist"

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

os.chdir(os.path.dirname(os.path.abspath(__file__)))

print(f"W.O.L.F. Den Backup Server")
print(f"==========================")
print(f"Server running at: http://localhost:{PORT}/")
print(f"Also try: http://127.0.0.1:{PORT}/")
print(f"Press Ctrl+C to stop")

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    httpd.serve_forever()