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
    
    # Check all possible locations for cursor-agent binary
    BINARY_FOUND=false
    
    # Check ~/.local/bin (default install location)
    if [ -f "$HOME/.local/bin/cursor-agent" ]; then
        echo "✅ Found cursor-agent in ~/.local/bin"
        cp "$HOME/.local/bin/cursor-agent" ./bin/cursor-agent
        chmod +x ./bin/cursor-agent
        BINARY_FOUND=true
    # Check ~/.cursor/bin (alternative location)
    elif [ -f "$HOME/.cursor/bin/cursor-agent" ]; then
        echo "✅ Found cursor-agent in ~/.cursor/bin"
        cp "$HOME/.cursor/bin/cursor-agent" ./bin/cursor-agent
        chmod +x ./bin/cursor-agent
        BINARY_FOUND=true
    # Check /usr/local/bin
    elif [ -f "/usr/local/bin/cursor-agent" ]; then
        echo "✅ Found cursor-agent in /usr/local/bin"
        cp "/usr/local/bin/cursor-agent" ./bin/cursor-agent
        chmod +x ./bin/cursor-agent
        BINARY_FOUND=true
    fi
    
    if [ "$BINARY_FOUND" = true ]; then
        echo "✅ cursor-agent copied to project bin"
        ls -lh ./bin/cursor-agent
    else
        echo "⚠️ Could not find cursor-agent binary in any location"
        echo "Checked locations:"
        echo "  - $HOME/.local/bin/cursor-agent"
        echo "  - $HOME/.cursor/bin/cursor-agent"
        echo "  - /usr/local/bin/cursor-agent"
        echo "The app will require CURSOR_API_KEY to be set"
    fi
fi

# Add project bin to PATH for build process
export PATH="$(pwd)/bin:$PATH"

# Verify
if command -v cursor-agent &> /dev/null; then
    echo "✅ cursor-agent is available in PATH"
    cursor-agent --version || echo "Version check skipped"
else
    echo "⚠️ cursor-agent not in PATH, ensure CURSOR_API_KEY is configured"
fi

