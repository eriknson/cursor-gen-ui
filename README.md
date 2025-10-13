# Cursor Gen UI

Generate UI components tailored to your questions. Built with Cursor Agent CLI.

## Local Development

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

### Railway Deployment (Recommended)

Railway provides a full Linux environment where cursor-agent works perfectly.

#### Quick Deploy

1. **Push to GitHub** (if not already)
2. **Go to [railway.app](https://railway.app)** and sign up/login
3. **New Project** → Deploy from GitHub repo → Select `cursor-gen-ui`
4. **Add Environment Variables**:
   - `CURSOR_API_KEY` (required - from `cursor-agent login`)
   - `CURSOR_MODEL=cheetah` (optional)
   - `NEXT_PUBLIC_ALLOWED_MODELS=auto,cheetah,gpt-5,sonnet-4.5` (optional)
5. **Deploy** - Railway auto-detects Next.js and builds

Or via CLI:
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

**Why Railway?**
- ✅ Full Linux environment (cursor-agent works normally)
- ✅ No Lambda restrictions
- ✅ All system tools available
- ✅ Simpler deployment

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CURSOR_API_KEY` | Yes | - | API key from `cursor-agent login` |
| `CURSOR_MODEL` | No | `auto` | Default model |
| `NEXT_PUBLIC_ALLOWED_MODELS` | No | `auto,cheetah` | Comma-separated allowed models |

## Troubleshooting

- **Command not found**: Restart terminal after installing cursor-agent
- **Not authenticated**: Run `cursor-agent login`
- **Deployment fails**: Check `CURSOR_API_KEY` is set in Railway environment variables
- **Local dev works but deployment doesn't**: Ensure prebuild script ran successfully in build logs

## License

MIT
