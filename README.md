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
- `http://localhost:3000/?model=cheetah` - Use Cheetah (default)
- `http://localhost:3000/?model=auto` - Use Auto (intelligent routing)
- `http://localhost:3000/?model=gpt-5` - Use GPT-5

**Available models:** `auto`, `cheetah`, `gpt-5`, `sonnet-4`, `sonnet-4.5`, `opus-4.1`, `grok`

**Note:** By default, only `auto` and `cheetah` are enabled to control API costs. See Configuration section to enable additional models.

## Configuration

### Local Development (All Models)

Create `.env.local` for local development with all models enabled:

```bash
# Copy the example file
cp env.local.example .env.local

# Or create manually:
cat > .env.local << 'EOF'
CURSOR_MODEL=cheetah
NEXT_PUBLIC_ALLOWED_MODELS=auto,cheetah,gpt-5,sonnet-4,sonnet-4.5,opus-4.1,grok
EOF
```

**Note:** `.env.local` is gitignored and won't be deployed to Vercel.

### Vercel Deployment (Cost-Protected)

**Don't set `NEXT_PUBLIC_ALLOWED_MODELS` in Vercel** - it will default to `auto,cheetah` (cost-effective models only).

Optional Vercel environment variables:
```bash
CURSOR_API_KEY=xxx         # Required: Your API key
CURSOR_MODEL=cheetah       # Optional: Default model (defaults to cheetah)
# NEXT_PUBLIC_ALLOWED_MODELS - Don't set this! Let it default to auto,cheetah
```

### Environment Variables Reference

| Variable | Local (All Models) | Vercel (Protected) |
|----------|-------------------|-------------------|
| `CURSOR_API_KEY` | From CLI or set here | ✅ Set in Vercel dashboard |
| `CURSOR_MODEL` | `cheetah` | `cheetah` (or omit) |
| `NEXT_PUBLIC_ALLOWED_MODELS` | `auto,cheetah,gpt-5,...` (all) | ❌ Don't set (defaults to `auto,cheetah`) |

## Deploy to Vercel

### Prerequisites

1. **Get your Cursor API Key:**
   ```bash
   # First, login to Cursor
   cursor-agent login
   
   # Your API key is stored locally after authentication
   # You can find it in your Cursor settings or use it from the CLI
   ```

2. **Prepare for deployment:**
   - Ensure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Deployment Steps

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
5. Add Environment Variables:
   - Click "Environment Variables"
   - Add `CURSOR_API_KEY` with your Cursor API key
   - Optionally add `CURSOR_MODEL` (e.g., `cheetah`, `gpt-5`, `sonnet-4.5`)
6. Click "Deploy"

#### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Set environment variables
vercel env add CURSOR_API_KEY
# Paste your Cursor API key when prompted

# Optionally set default model
vercel env add CURSOR_MODEL
# Enter your preferred model (e.g., cheetah)

# Deploy to production
vercel --prod
```

### Environment Variables Reference

| Variable | Required | Description | Default | Example |
|----------|----------|-------------|---------|---------|
| `CURSOR_API_KEY` | ✅ Yes | Your Cursor API key for authentication | - | `sk_xxx...` |
| `CURSOR_MODEL` | ❌ No | Default model to use | `auto` | `auto`, `cheetah`, `gpt-5` |
| `NEXT_PUBLIC_ALLOWED_MODELS` | ❌ No | Comma-separated list of allowed models | `auto,cheetah` | `auto,cheetah,gpt-5` |
| `NEXT_PUBLIC_BASE_URL` | ❌ No | Base URL for metadata (auto-detected on Vercel) | - | `https://your-app.vercel.app` |

### Post-Deployment

After deployment:
- Your app will be live at `https://your-project.vercel.app`
- Users can still override the model via URL: `?model=gpt-5`
- The API route at `/api/stream` will use the configured `CURSOR_API_KEY`

### Deployment Notes

**Cursor CLI Installation:**
- The app automatically attempts to install `cursor-agent` CLI during the build process
- A prebuild script (`scripts/install-cursor-agent.sh`) handles the installation
- The app requires `CURSOR_API_KEY` environment variable for authentication in serverless environments
- If cursor-agent installation fails (due to platform restrictions), the app will still work using the API key

**💰 Cost Control:**
- Default model: `cheetah` (fast and cost-effective)
- Only `auto` and `cheetah` models enabled by default
- Expensive models (GPT-5, Sonnet, Opus) are disabled by default to protect your API costs
- Enable additional models locally via `.env.local` or on Vercel by setting `NEXT_PUBLIC_ALLOWED_MODELS`

## Troubleshooting

**Command not found:** Restart terminal after installing Cursor CLI

**Not authenticated:** Run `cursor-agent login`

**Deployment fails:** Ensure `CURSOR_API_KEY` is set in your Vercel environment variables

**API errors in production:** Verify your `CURSOR_API_KEY` is valid and has proper permissions

## License

MIT
