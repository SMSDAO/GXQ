# Deployment Notes

## Vercel Configuration Considerations

### Known Limitations

#### 1. API Routes Configuration

The current `vercel.json` deploys only the Next.js frontend:

```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install"
}
```

**Limitation**: This configuration deploys the frontend only. The Express backend under `/backend` is **not** run by Vercel with this config, so `/api/...` routes served by `backend/server.js` will 404 on Vercel.

**Recommended Approaches for Production**:
- **Option A (Vercel native)**: Create individual API route files in the Next.js `/pages/api` (or `/app/api`) directory. Each file becomes a standalone serverless function; no `routes` config needed.
- **Option B (Separate deployment)**: Keep the Express server and deploy the backend to Railway, Render, or Heroku. Update `NEXT_PUBLIC_API_URL` to point to the backend host.

#### 2. Environment Variables

#### 2. Environment Variables

Environment variables should be set in the **Vercel dashboard** (Settings → Environment Variables) or via the Vercel CLI:

```bash
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel env add NEXT_PUBLIC_API_URL
```

The current `vercel.json` does **not** contain an `env` section — all secrets must be configured through the dashboard or CLI before deployment.

**Do not** add `PORT` — Vercel's serverless functions manage ports automatically.

#### 3. Package Structure

The project mixes frontend (Next.js) and backend (Express) dependencies in a single `package.json`:

```json
"dependencies": {
  "next": "^15.4.1",        // Frontend
  "react": "^19.1.0",       // Frontend
  "express": "^4.18.0",     // Backend
  "mongoose": "^8.0.0"      // Backend
}
```

**Concern**: This can lead to:
- Larger bundle sizes
- Deployment complexity
- Potential conflicts between frontend and backend dependencies

**Recommended Approach**:
- Split into two separate projects with their own `package.json` files
- Or clearly document which dependencies are for which part of the stack
- For Vercel, ensure backend dependencies are only loaded in API routes

## Deployment Instructions

### Option 1: Deploy to Vercel (With Modifications)

1. **Configure Vercel Secrets** (if using `@` syntax):
   ```bash
   vercel secrets add mongo_uri "your-mongodb-connection-string"
   ```

2. **Update vercel.json** to remove PORT and fix MONGO_URI:
   ```json
   {
     "env": {
       "NODE_ENV": "production",
       "MONGO_URI": "@mongo_uri"
     }
   }
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy Express Server to Alternative Platform

1. **Deploy backend** to Railway/Render/Heroku
2. **Deploy frontend** to Vercel as a static site
3. **Configure CORS** to allow frontend to call backend APIs

### Option 3: Local/VPS Deployment

Use the PowerShell deployment scripts provided:

```bash
# One-click deployment
pwsh one-click-deploy.ps1 -Environment PROD -AutoStart

# Or manual deployment
pwsh deploy-runner.ps1 -Environment PROD
```

## Testing Before Deployment

Always test the build locally before deploying:

```bash
npm run build
npm start
```

Check that:
- Frontend pages load correctly
- API endpoints respond as expected
- Database connections work
- Environment variables are properly configured
