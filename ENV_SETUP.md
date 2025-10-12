# Environment Setup Guide

## Required Setup

### 1. Install Cursor Agent CLI

The Cursor Agent CLI must be installed and accessible in your PATH:

```bash
curl https://cursor.com/install -fsS | bash
```

After installation, restart your terminal.

### 2. Login to Cursor

Authenticate with your Cursor account:

```bash
cursor-agent login
```

This will open a browser window for authentication.

### 3. Verify Installation

Check that the CLI is working:

```bash
cursor-agent status
```

You should see confirmation that you're logged in.

## Optional Configuration

### Environment Variables

Create a `.env.local` file in the project root if you need to specify custom settings:

```bash
# Optional: Specify your Cursor API key (if not using login)
CURSOR_API_KEY=your_api_key_here

# Optional: Default model to use (defaults to sonnet-4)
# Options: gpt-5, sonnet-4, sonnet-4-thinking, opus-4.1, grok
CURSOR_MODEL=sonnet-4

# Node environment
NODE_ENV=development
```

### Model Selection

You can change the default AI model in `lib/agent-wrapper.ts`:

```typescript
const result = await cursor.generate({
  prompt: userMessage,
  systemPrompt: SYSTEM_PROMPT,
  model: "gpt-5", // Change this to your preferred model
  force: true,
});
```

Available models:
- `gpt-5` - OpenAI GPT-5 (latest)
- `sonnet-4` - Claude 4 Sonnet (default, balanced)
- `sonnet-4-thinking` - Claude 4 Sonnet with extended reasoning
- `opus-4.1` - Claude 4.1 Opus (most capable)
- `grok` - Grok model

## Troubleshooting

**"cursor-agent: command not found"**
- Restart your terminal after installing the CLI
- Check that `~/.cursor/bin` is in your PATH
- Try running: `export PATH="$HOME/.cursor/bin:$PATH"`

**"Not authenticated"**
- Run `cursor-agent login` to authenticate
- Check your internet connection
- Make sure you have an active Cursor subscription

**"Rate limit exceeded"**
- You may have hit usage limits on your plan
- Wait a few minutes and try again
- Consider upgrading your Cursor plan

**API Key Issues**
- If using `CURSOR_API_KEY`, make sure it's properly set
- Check that the key is valid and not expired
- Try logging in again with `cursor-agent login`

## Testing the Setup

After setup, you can test the Cursor Agent CLI directly:

```bash
cursor-agent --print --output-format json "What is 2+2?"
```

You should see a JSON response with the answer.

If this works, your environment is properly configured for the GenUI app!

