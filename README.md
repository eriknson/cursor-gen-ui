# Cursor Gen UI

Ask questions, generate UI components tailored for the response. Powered by Cursor Agent CLI.

## Quick Start

```bash
# Install Cursor CLI
curl https://cursor.com/install -fsS | bash
cursor-agent login

# Clone and run
git clone git@github.com:eriknson/cursor-gen-ui.git
cd cursor-gen-ui
npm install
npm run dev
```

Open http://localhost:3000 and start asking questions.

## Customization

**Change model:** Add `?model=MODEL_NAME` to the URL (default: cheetah)

Examples:
- `http://localhost:3000/?model=gpt-5` - Use GPT-5
- `http://localhost:3000/?model=sonnet-4` - Use Claude Sonnet 4
- `http://localhost:3000/?model=opus-4.1` - Use Claude Opus 4.1
- `http://localhost:3000/?model=sonnet-4.5` - Use Claude Sonnet 4.5

Supported models: `cheetah`, `gpt-5`, `sonnet-4`, `sonnet-4.5`, `sonnet-4-thinking`, `opus-4.1`, `grok`

## Configuration

Optional `.env.local` for advanced usage:
```bash
CURSOR_MODEL=cheetah  # Override default model (cheetah, gpt-5, sonnet-4.5, etc.)
CURSOR_API_KEY=xxx    # Only needed for CI/CD or to override login credentials
```

## Troubleshooting

**Command not found:** Restart terminal after installing Cursor CLI

**Not authenticated:** Run `cursor-agent login`

## License

MIT
