#!/bin/bash
# Script to install cursor-agent CLI during Vercel build

echo "📦 Installing cursor-agent CLI..."

# Try to install cursor-agent
if ! command -v cursor-agent &> /dev/null; then
    echo "cursor-agent not found, attempting to install..."
    
    # Download and install cursor-agent
    curl -fsS https://cursor.com/install | bash
    
    # Add to PATH for current session
    export PATH="$HOME/.cursor/bin:$PATH"
    
    # Verify installation
    if command -v cursor-agent &> /dev/null; then
        echo "✅ cursor-agent installed successfully"
        cursor-agent --version || echo "⚠️ cursor-agent installed but version check failed"
    else
        echo "⚠️ cursor-agent installation may have failed, but continuing..."
        echo "The app will use CURSOR_API_KEY from environment variables"
    fi
else
    echo "✅ cursor-agent already installed"
    cursor-agent --version
fi

