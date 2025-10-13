# Cursor Gen UI

Generate UI components tailored to your questions. Built with Cursor Agent CLI.

## Setup

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

Open http://localhost:3000

## Model Selection

Switch models by adding `?model=MODEL_NAME` to the URL:
- `?model=cheetah` - Fast, default
- `?model=auto` - Intelligent routing
- `?model=gpt-5` - GPT-5
- `?model=sonnet-4.5` - Claude Sonnet 4.5

Other available: `sonnet-4`, `opus-4.1`, `grok`

## Configuration

### Local Development

Enable all models locally:

```bash
cp env.local.example .env.local
```

This sets `NEXT_PUBLIC_ALLOWED_MODELS` to include all models. The file is gitignored.

### Vercel Deployment

Set in your Vercel dashboard:
- `CURSOR_API_KEY` - Required
- `CURSOR_MODEL` - Optional (defaults to `cheetah`)

Don't set `NEXT_PUBLIC_ALLOWED_MODELS` in production - it defaults to `auto,cheetah` to keep costs down. Override per-request with URL params if needed.

#### Deploy Steps

1. Push code to GitHub/GitLab/Bitbucket
2. Import to Vercel
3. Add `CURSOR_API_KEY` environment variable
4. Deploy

Or via CLI:
```bash
npm i -g vercel
vercel login
vercel
vercel env add CURSOR_API_KEY
vercel --prod
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CURSOR_API_KEY` | Yes | - | API key from `cursor-agent login` |
| `CURSOR_MODEL` | No | `auto` | Default model |
| `NEXT_PUBLIC_ALLOWED_MODELS` | No | `auto,cheetah` | Comma-separated allowed models |

## Troubleshooting

- **Command not found**: Restart terminal
- **Not authenticated**: Run `cursor-agent login`
- **Deployment fails**: Check `CURSOR_API_KEY` is set in Vercel

## License

MIT
