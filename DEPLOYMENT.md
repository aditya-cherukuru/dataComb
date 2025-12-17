# DataComb Deployment Guide

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd datacomb
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **datacomb** (or your choice)
   - In which directory is your code? **./  **
   - Override settings? **N**

5. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - DataComb for Code Hive Hackathon"
   git branch -M main
   git remote add origin https://github.com/aditya-cherukuru/datacomb.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings
   - Click "Deploy"

3. **Done!** Your app will be live at `https://datacomb.vercel.app`

## 🛠️ Build Configuration

The project includes a `vercel.json` configuration file that:
- Sets the correct build command
- Configures SPA routing (all routes → index.html)
- Enables asset caching for performance
- Uses Vite framework preset

## 📦 Production Build Locally

To test the production build locally:

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

The build output will be in the `dist/` directory.

## 🔧 Environment Variables

DataComb doesn't require any environment variables! Everything runs client-side using:
- Hive public API nodes
- Hive Keychain browser extension
- No backend or API keys needed

## ✅ Pre-Deployment Checklist

- [x] Build completes without errors (`npm run build`)
- [x] No TypeScript errors (`tsc -b`)
- [x] No linting errors (`npm run lint`)
- [ ] Test the app with Hive Keychain installed
- [ ] Verify all pages load correctly
- [ ] Test task creation and submission
- [ ] Check mobile responsiveness
- [ ] Verify all images load properly

## 🌐 Custom Domain (Optional)

To add a custom domain on Vercel:

1. Go to your project settings on Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Wait for SSL certificate provisioning

## 📊 Performance Optimization

The build is already optimized with:
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Asset optimization
- ✅ Lazy loading

## 🐛 Troubleshooting

### Build Fails

**Issue**: TypeScript errors during build
**Solution**: Run `npm run lint` to identify issues

**Issue**: Missing dependencies
**Solution**: Delete `node_modules` and run `npm install`

### Deployment Issues

**Issue**: 404 on page refresh
**Solution**: Ensure `vercel.json` has the SPA rewrite rule (already included)

**Issue**: Assets not loading
**Solution**: Check that asset paths are relative, not absolute

### Runtime Issues

**Issue**: "Hive Keychain not found"
**Solution**: This is expected - users need to install the browser extension

**Issue**: Tasks not loading
**Solution**: Check browser console for API errors. Hive nodes may be temporarily down.

## 📱 Testing Checklist

### Desktop (Chrome/Brave)
- [ ] Login with Keychain works
- [ ] Can browse tasks
- [ ] Can create tasks
- [ ] Can submit work
- [ ] VSC Bridge displays correctly

### Desktop (Firefox)
- [ ] All features work
- [ ] No console errors

### Mobile
- [ ] Responsive layout works
- [ ] Navigation menu accessible
- [ ] Forms are usable
- [ ] Images load properly

## 🔒 Security Notes

- No API keys or secrets needed
- All authentication via Hive Keychain
- No backend to secure
- All data stored on Hive blockchain
- Client-side only application

## 📈 Post-Deployment

After deployment:

1. **Update Documentation**
   - Add deployment URL to README.md
   - Add deployment URL to HACKATHON.md

2. **Test Live Site**
   - Verify Hive Keychain works on deployed site
   - Test all user flows
   - Check for console errors

3. **Share**
   - Post on Hive with `#datacomb33` tag
   - Share in Code Hive Discord
   - Add to hackathon submission

## 🎉 Success!

Your DataComb application is now live and ready for the hackathon!

**Next Steps:**
1. Test all features on the live site
2. Create demo video/screenshots
3. Submit to Code Hive Hackathon
4. Share with the community

---

Need help? Check the [README.md](./README.md) or [HACKATHON.md](./HACKATHON.md) for more information.
