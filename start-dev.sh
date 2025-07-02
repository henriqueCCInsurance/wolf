#!/bin/bash

echo "Starting W.O.L.F. Den Development Server..."
echo "================================"
echo ""

# Kill any existing processes on our ports
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Clear npm cache
npm cache clean --force 2>/dev/null || true

# Start the dev server
echo "Starting server on multiple ports..."
echo "Try these URLs:"
echo "  - http://localhost:5173"
echo "  - http://127.0.0.1:5173"
echo "  - http://0.0.0.0:5173"
echo ""

# Run with host flag to allow network access
npm run dev -- --host 0.0.0.0 --port 5173