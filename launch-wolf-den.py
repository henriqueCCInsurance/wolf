#!/usr/bin/env python3
"""
W.O.L.F. Den Test Server
========================
Launches the Campbell & Co. sales enablement application with proper React Router support.
"""

import http.server
import socketserver
import os
import webbrowser
import sys
from pathlib import Path
import mimetypes

class WolfDenHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="dist", **kwargs)
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        # Disable caching for development
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def do_GET(self):
        # Handle React Router - serve index.html for any route that doesn't exist as a file
        if self.path.startswith('/assets/'):
            # Serve assets normally
            return super().do_GET()
        
        # Check if the requested file exists
        file_path = Path(self.directory) / self.path.lstrip('/')
        if file_path.is_file():
            return super().do_GET()
        
        # For any other path (React routes), serve index.html
        self.path = '/index.html'
        return super().do_GET()
    
    def log_message(self, format, *args):
        # Suppress request logs unless it's an error
        if not any(code in str(args) for code in ['404', '500', '403']):
            return
        super().log_message(format, *args)

def find_available_port(start_port=3000, max_attempts=10):
    """Find an available port starting from start_port"""
    import socket
    for port in range(start_port, start_port + max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('localhost', port))
                return port
        except OSError:
            continue
    return None

def main():
    # Change to script directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Check if dist directory exists
    if not os.path.exists('dist'):
        print("❌ Error: dist directory not found!")
        print("🔧 Run 'npm run build' first to create the production build.")
        sys.exit(1)
    
    # Check if index.html exists
    if not os.path.exists('dist/index.html'):
        print("❌ Error: dist/index.html not found!")
        print("🔧 Run 'npm run build' first to create the production build.")
        sys.exit(1)
    
    # Find available port
    port = find_available_port()
    if port is None:
        print("❌ Error: No available ports found!")
        sys.exit(1)
    
    try:
        # Start server
        with socketserver.TCPServer(("", port), WolfDenHandler) as httpd:
            print("🚀 W.O.L.F. Den Test Server Started Successfully!")
            print("=" * 60)
            print(f"📍 Application URL: http://localhost:{port}/")
            print(f"📍 Alternative URL: http://127.0.0.1:{port}/")
            print("")
            print("🔑 LOGIN CREDENTIALS:")
            print("   👨‍💼 Admin Access:")
            print("      Email: admin@campbellco.com")
            print("      Password: password123")
            print("")
            print("   👤 Salesperson Access:")
            print("      Email: john.smith@campbellco.com")
            print("      Password: password123")
            print("")
            print("🎯 WHAT TO TEST:")
            print("   1. Beautiful login screen with hero image")
            print("   2. Hunt Planner - Lead research & persona selection")
            print("   3. Call Sequence - Multi-call planning with CSV import")
            print("   4. Call Guide - Enhanced content library (6 categories)")
            print("   5. Live Call - Two-column real-time assistance")
            print("   6. Call Results - Advanced analytics with charts")
            print("")
            print("💡 TIP: Try both admin and salesperson accounts to see different features!")
            print("🛑 Press Ctrl+C to stop the server")
            print("=" * 60)
            
            # Try to open browser automatically
            try:
                webbrowser.open(f'http://localhost:{port}/')
                print("🌐 Opening browser automatically...")
            except Exception as e:
                print(f"⚠️  Could not open browser automatically: {e}")
                print(f"📋 Please copy and paste this URL into your browser:")
                print(f"   http://localhost:{port}/")
            
            print("")
            print("✅ Server is running and ready for testing!")
            print("")
            
            # Start serving
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()