#!/usr/bin/env python3
import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Try different ports
PORTS = [3000, 3001, 8000, 8080, 8081]
DIRECTORY = "dist"

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

def start_server():
    os.chdir(Path(__file__).parent)
    
    if not os.path.exists(DIRECTORY):
        print("❌ Error: dist directory not found. Run 'npm run build' first.")
        return
    
    for port in PORTS:
        try:
            with socketserver.TCPServer(("", port), CORSHTTPRequestHandler) as httpd:
                print(f"🚀 W.O.L.F. Den Test Server Started!")
                print(f"📍 URL: http://localhost:{port}/")
                print(f"📍 Alt: http://127.0.0.1:{port}/")
                print(f"")
                print(f"🔑 Login Credentials:")
                print(f"   Admin: admin@campbellco.com / password123")
                print(f"   Sales: john.smith@campbellco.com / password123")
                print(f"")
                print(f"💡 If browser doesn't open automatically, copy the URL above")
                print(f"🛑 Press Ctrl+C to stop")
                print(f"=" * 50)
                
                # Try to open browser automatically
                try:
                    webbrowser.open(f'http://localhost:{port}/')
                except:
                    pass
                
                httpd.serve_forever()
                break
        except OSError:
            continue
    else:
        print("❌ Could not start server on any available port")

if __name__ == "__main__":
    start_server()