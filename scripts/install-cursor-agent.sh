#!/bin/bash
# Script to install cursor-agent CLI during Vercel build

echo "📦 Installing cursor-agent CLI..."

# Create bin directory in project root (will be included in deployment)
mkdir -p ./bin

# Check if cursor-agent exists in project bin or PATH
if [ -f "./bin/cursor-agent" ]; then
    echo "✅ cursor-agent found in project bin"
    chmod +x ./bin/cursor-agent
elif command -v cursor-agent &> /dev/null; then
    echo "✅ cursor-agent already in PATH"
    cursor-agent --version
else
    echo "cursor-agent not found, attempting to install..."
    
    # Download and install cursor-agent
    curl -fsS https://cursor.com/install | bash
    
    # Try to copy to project bin (for Vercel deployment)
    if [ -f "$HOME/.cursor/bin/cursor-agent" ]; then
        echo "Copying cursor-agent to project bin..."
        cp "$HOME/.cursor/bin/cursor-agent" ./bin/cursor-agent
        chmod +x ./bin/cursor-agent
        echo "✅ cursor-agent installed to project bin"
    else
        echo "⚠️ cursor-agent installation may have failed"
        echo "Checking alternative locations..."
        
        # Check common locations
        if [ -f "/usr/local/bin/cursor-agent" ]; then
            cp "/usr/local/bin/cursor-agent" ./bin/cursor-agent
            chmod +x ./bin/cursor-agent
            echo "✅ cursor-agent copied from /usr/local/bin"
        else
            echo "⚠️ Could not find cursor-agent binary"
            echo "The app will require CURSOR_API_KEY to be set"
        fi
    fi
fi

# Add project bin to PATH for build process
export PATH="$(pwd)/bin:$PATH"

# Verify
if command -v cursor-agent &> /dev/null; then
    echo "✅ cursor-agent is available"
    cursor-agent --version || echo "Version check skipped"
else
    echo "⚠️ cursor-agent not in PATH, ensure CURSOR_API_KEY is configured"
fi

