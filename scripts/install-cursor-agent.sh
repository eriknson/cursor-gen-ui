#!/bin/bash
# Script to install cursor-agent CLI for local development
# Note: Vercel deployment uses runtime download, not build-time installation

echo "📦 Checking cursor-agent CLI for local development..."

# Check if we're in Vercel build environment
if [ "$VERCEL" = "1" ]; then
    echo "✅ Vercel build detected - cursor-agent will be downloaded at runtime"
    echo "Skipping build-time installation"
    exit 0
fi

# Local development installation
if command -v cursor-agent &> /dev/null; then
    echo "✅ cursor-agent already installed"
    cursor-agent --version || echo "(version check skipped)"
else
    echo "⚠️ cursor-agent not found"
    echo "Install it by running: curl -fsS https://cursor.com/install | bash"
    echo "Then restart your terminal"
    echo ""
    echo "For now, continuing build without cursor-agent..."
    echo "The app will work in production via runtime download"
fi

exit 0

