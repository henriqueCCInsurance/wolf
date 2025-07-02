#!/usr/bin/env python3
"""
Simple HTTP server to demo The W.O.L.F. Den application
"""
import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

PORT = 8080
DEMO_FILE = "test-app.html"

class DemoHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=Path(__file__).parent, **kwargs)
    
    def do_GET(self):
        if self.path == "/" or self.path == "/index.html":
            self.path = f"/{DEMO_FILE}"
        return super().do_GET()

def start_server():
    """Start the demo server and open browser"""
    try:
        with socketserver.TCPServer(("", PORT), DemoHandler) as httpd:
            server_url = f"http://localhost:{PORT}"
            
            print("=" * 60)
            print("🐺 THE W.O.L.F. DEN - DEMO SERVER STARTING")
            print("=" * 60)
            print(f"Server running at: {server_url}")
            print(f"Demo file: {DEMO_FILE}")
            print()
            print("📋 TESTING INSTRUCTIONS:")
            print("1. The browser should open automatically")
            print("2. Fill out the Hunt Planner form completely")
            print("3. Click 'Lock Target' to see persona intelligence")
            print("4. Click 'Battle Card' to generate printable reference")
            print("5. Test the print functionality")
            print()
            print("Press Ctrl+C to stop the server")
            print("=" * 60)
            
            # Open browser automatically
            webbrowser.open(server_url)
            
            # Start serving
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n🛑 Demo server stopped. Thank you for testing The W.O.L.F. Den!")
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Port {PORT} is already in use. Please:")
            print(f"   1. Close any other servers running on port {PORT}")
            print(f"   2. Or open http://localhost:{PORT} in your browser manually")
            return f"http://localhost:{PORT}"
        else:
            raise e

if __name__ == "__main__":
    # Check if demo file exists
    if not os.path.exists(DEMO_FILE):
        print(f"❌ Demo file '{DEMO_FILE}' not found!")
        sys.exit(1)
    
    start_server()