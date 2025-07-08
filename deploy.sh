#!/bin/bash

# W.O.L.F. Den Deployment Script

echo "🐺 W.O.L.F. Den Deployment Script"
echo "================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📁 The 'dist/' folder is ready for deployment."
    echo ""
    echo "To deploy to Netlify:"
    echo "1. Go to https://app.netlify.com"
    echo "2. Drag the 'dist/' folder to the deployment area"
    echo ""
    echo "The dist folder is located at:"
    echo "📍 $(pwd)/dist"
    echo ""
    
    # Optional: Open the dist folder in Finder
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Opening dist folder in Finder..."
        open dist/
    fi
else
    echo ""
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi