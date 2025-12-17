# DataComb - Quick Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Option 1: One-Command Deploy

```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Deploy to production
vercel --prod
```

Follow the prompts and your site will be live in minutes!

### Option 2: GitHub + Vercel Dashboard

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "DataComb - Code Hive Hackathon 2024"
   git branch -M main
   git remote add origin https://github.com/aditya-cherukuru/datacomb.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Click "Deploy" (Vercel auto-detects Vite settings)
   - Done! 🎉

## ✅ Pre-Deployment Checklist

- [x] Production build tested (`npm run build` ✓)
- [x] No TypeScript errors
- [x] No build errors
- [x] vercel.json configured
- [ ] Hive Keychain extension installed (for testing)
- [ ] Test account ready

## 🧪 Test After Deployment

1. **Login Test**
   - Visit your deployed URL
   - Click "Login"
   - Connect Hive Keychain
   - Verify profile loads

2. **Browse Tasks**
   - Navigate to "Browse Tasks"
   - Verify tasks load from Hive blockchain
   - Check images display correctly

3. **Create Task** (if you have sufficient reputation)
   - Go to Dashboard → Create Task
   - Fill out form
   - Submit to blockchain
   - Verify task appears

4. **Mobile Test**
   - Open site on mobile device
   - Check responsive layout
   - Test navigation

## 📝 Post-Deployment

1. **Update Documentation**
   - Add deployment URL to README.md
   - Add deployment URL to HACKATHON.md

2. **Submit to Hackathon**
   - Share GitHub repo: https://github.com/aditya-cherukuru/datacomb
   - Share live demo URL
   - Post on Hive with #datacomb33 tag
   - Share in Code Hive Discord

## 🎯 Hackathon Submission Checklist

- [ ] GitHub repository public and accessible
- [ ] Live demo deployed and working
- [ ] Hive Keychain login functional
- [ ] Can read from Hive blockchain
- [ ] Can broadcast to Hive blockchain
- [ ] README.md comprehensive
- [ ] Code well-documented
- [ ] VSC integration visible

## 🆘 Troubleshooting

**Build fails on Vercel**:
- Check build logs in Vercel dashboard
- Ensure all dependencies in package.json
- Verify Node.js version compatibility

**"Hive Keychain not found" on deployed site**:
- This is normal! Users need to install the extension
- Test with Keychain installed

**Tasks not loading**:
- Check browser console for errors
- Verify Hive API nodes are accessible
- Try refreshing the page

## 🎉 Success!

Once deployed, your DataComb application will be live and ready for the hackathon!

**Example URL**: `https://datacomb.vercel.app` (or your custom domain)

---

Need help? Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
