# Quick Start Guide

Get up and running with Cursor Agent GenUI in 3 minutes!

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js v18+ installed
- ✅ npm or pnpm installed

## Installation Steps

### 1. Install Cursor Agent CLI (2 minutes)

```bash
# Install the CLI
curl https://cursor.com/install -fsS | bash

# Restart your terminal, then login
cursor-agent login
```

This will open a browser for authentication. Complete the login process.

### 2. Install Project Dependencies (1 minute)

```bash
# Install npm packages
npm install

# Or if you use pnpm
pnpm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Query

Try one of these example queries:

1. **"Show me the top 5 programming languages"** - See a chart
2. **"Compare React and Vue"** - Get a comparison table
3. **"Generate a Python function to sort a list"** - View formatted code
4. **"Explain how JWT authentication works"** - Read a detailed explanation

## What's Happening?

When you send a message:

1. 🧠 **Cursor Agent** analyzes your query using advanced AI models
2. 🔍 **Intelligent Tools** fetch or generate the required data
3. 🎨 **Component Renderer** selects the best UI component
4. ✨ **Beautiful UI** displays the result with smooth animations

## Component Types

The system automatically chooses from:

- 📊 **Charts** - For numeric data
- 📋 **Tables** - For structured data
- 🃏 **Cards** - For collections
- 💻 **Code** - For snippets
- 🖼️ **Images** - For visual content
- 📝 **Text** - For explanations

## Troubleshooting

**Issue: "cursor-agent: command not found"**
```bash
# Restart your terminal or manually add to PATH
export PATH="$HOME/.cursor/bin:$PATH"
```

**Issue: "Not authenticated"**
```bash
cursor-agent login
```

**Issue: Slow first response**
- First query initializes the agent (normal)
- Subsequent queries are faster

## Next Steps

- 📖 Read the full [README.md](README.md) for detailed documentation
- 🔧 Check [ENV_SETUP.md](ENV_SETUP.md) for advanced configuration
- 🎨 Explore the `components/` folder to see available UI components
- 🧪 Modify `lib/agent-wrapper.ts` to customize AI behavior

## Tips for Best Results

✅ **DO:**
- Be specific in your queries
- Ask for data that can be structured
- Request visualizations explicitly

❌ **DON'T:**
- Ask extremely long or complex multi-part questions
- Expect real-time data without specifying dates
- Request features that require external APIs without context

## Need Help?

Check these resources:
- [Cursor CLI Documentation](https://cursor.com/cli)
- [Next.js Documentation](https://nextjs.org/docs)
- Project README for architecture details

---

**Ready to build?** Start asking questions and watch the magic happen! ✨

