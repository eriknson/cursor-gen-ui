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
    
    # Find cursor-agent installation directory
    CURSOR_DIR=""
    
    # Check ~/.local/bin (default install location - usually a symlink)
    if [ -L "$HOME/.local/bin/cursor-agent" ]; then
        echo "✅ Found cursor-agent symlink in ~/.local/bin"
        CURSOR_DIR="$(dirname "$(readlink "$HOME/.local/bin/cursor-agent")")"
        echo "Resolves to: $CURSOR_DIR"
    elif [ -f "$HOME/.local/bin/cursor-agent" ]; then
        echo "✅ Found cursor-agent in ~/.local/bin"
        CURSOR_DIR="$HOME/.local/bin"
    # Check ~/.cursor/bin
    elif [ -f "$HOME/.cursor/bin/cursor-agent" ]; then
        echo "✅ Found cursor-agent in ~/.cursor/bin"
        CURSOR_DIR="$HOME/.cursor/bin"
    # Check /usr/local/bin
    elif [ -f "/usr/local/bin/cursor-agent" ]; then
        echo "✅ Found cursor-agent in /usr/local/bin"
        CURSOR_DIR="/usr/local/bin"
    fi
    
    if [ -n "$CURSOR_DIR" ] && [ -d "$CURSOR_DIR" ]; then
        echo "📦 Copying entire cursor-agent directory to ./bin/"
        
        # Copy all required files
        cp "$CURSOR_DIR/cursor-agent" ./bin/ 2>/dev/null || true
        cp "$CURSOR_DIR/node" ./bin/ 2>/dev/null || true
        cp "$CURSOR_DIR/index.js" ./bin/ 2>/dev/null || true
        cp "$CURSOR_DIR"/*.node ./bin/ 2>/dev/null || true
        cp "$CURSOR_DIR/package.json" ./bin/ 2>/dev/null || true
        cp "$CURSOR_DIR/rg" ./bin/ 2>/dev/null || true
        cp "$CURSOR_DIR/spawn-helper" ./bin/ 2>/dev/null || true
        
        chmod +x ./bin/cursor-agent ./bin/node 2>/dev/null || true
        chmod +x ./bin/rg ./bin/spawn-helper 2>/dev/null || true
        
        echo "✅ cursor-agent installation copied to project bin"
        ls -lh ./bin/ | head -15
    else
        echo "⚠️ Could not find cursor-agent installation directory"
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

