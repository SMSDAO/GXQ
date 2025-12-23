# Deployment Notes

## Vercel Configuration Considerations

### Known Limitations

#### 1. API Routes Configuration

The current `vercel.json` routes all API requests to `/backend/server.js`:

```json
"routes": [
  {
    "src": "/api/(.*)",
    "dest": "/backend/server.js"
  }
]
```

**Limitation**: This configuration may not work optimally with Vercel's serverless architecture, which expects each API route to be a separate serverless function. 

**Recommended Approach for Production**:
- Create individual API route files in `/api` directory (e.g., `/api/mxm.js`, `/api/mqm.js`)
- Each file should be a standalone serverless function
- Remove the generic routing and let Vercel handle routes natively

**Alternative**: Keep the current Express server setup and deploy to a different platform that supports traditional Node.js applications (e.g., Railway, Render, Heroku).

#### 2. Environment Variables

The current configuration uses:

```json
"env": {
  "NODE_ENV": "production",
  "MONGO_URI": "@mongo_uri",
  "PORT": "3001"
}
```

**Issues**:
- `@mongo_uri` expects a Vercel secret named `mongo_uri` to be configured in the Vercel dashboard
- If the secret doesn't exist, the deployment will fail
- `PORT` is hardcoded to `3001`, but Vercel's serverless functions manage ports automatically

**Recommended Fix**:
- Remove the `@` syntax if not using Vercel secrets: `"MONGO_URI": process.env.MONGO_URI`
- Or properly configure the secret in Vercel dashboard before deployment
- Remove or make `PORT` optional since Vercel assigns ports dynamically

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
