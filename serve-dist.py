#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 8080
DIRECTORY = "dist"

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

print(f"W.O.L.F. Den Production Build Server")
print(f"====================================")
print(f"Server running at: http://localhost:{PORT}/")
print(f"Also try: http://127.0.0.1:{PORT}/")
print(f"")
print("This is the FULL application with all features:")
print("✓ Call Timer with persona-specific timing")
print("✓ Three.js fireworks celebrations")
print("✓ Talking points selection")
print("✓ Live industry intelligence")
print("✓ Complete gamification system")
print("")
print("Press Ctrl+C to stop")

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    httpd.serve_forever()