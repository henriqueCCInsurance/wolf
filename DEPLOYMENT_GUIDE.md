# Deployment Guide for W.O.L.F. Den

## Manual Deployment to Netlify

### Option 1: Drag and Drop (Simplest)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Sign in to your account
   - In the "Sites" tab, look for the deployment drop zone
   - Drag the entire `dist/` folder from your project into the drop zone
   - Wait for deployment to complete (usually 1-2 minutes)

### Option 2: Using Netlify CLI (Already configured)

Since the project already has Netlify CLI commands configured, you can use:

1. **Deploy a preview:**
   ```bash
   npm run netlify:deploy
   ```
   This creates a preview URL to test before going live.

2. **Deploy to production:**
   ```bash
   npm run netlify:deploy:prod
   ```
   This updates your live production site.

**Note:** You'll need to authenticate with Netlify the first time:
- The CLI will open a browser window
- Log in to your Netlify account
- Authorize the CLI
- Select your site from the list

### Option 3: Continuous Deployment (Recommended for teams)

1. **Connect GitHub repository:**
   - Go to Netlify dashboard
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Deploy site

2. **Automatic deploys:**
   - Every push to `main` branch will trigger a new deployment
   - Pull requests get preview deployments

## Environment Variables

Remember to set these in Netlify dashboard under Site settings > Environment variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## What Gets Deployed

The `dist/` folder contains:
- `index.html` - Main entry point
- `assets/` - All JavaScript, CSS, and static files
  - Filenames include hashes for cache busting
  - Automatically optimized and minified

## Troubleshooting

### Build fails on Netlify
- Check Node version in `netlify.toml` matches your local version
- Ensure all dependencies are in `package.json` (not just devDependencies)
- Check build logs for specific errors

### Environment variables not working
- Variables must start with `VITE_` to be exposed to the app
- Redeploy after adding/changing variables
- Check they're set in the correct context (production vs preview)

### 404 errors on routes
- The `netlify.toml` file already has SPA redirect rules
- If issues persist, check the `_redirects` file is properly configured