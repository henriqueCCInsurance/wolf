#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 8888
os.chdir('dist')

print(f"🚀 W.O.L.F. Den Running at: http://localhost:{PORT}/")
print(f"🔑 Login: admin@campbellco.com / password123")
print(f"🔑 Sales: john.smith@campbellco.com / password123")
print(f"🛑 Press Ctrl+C to stop")

with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as httpd:
    httpd.serve_forever()