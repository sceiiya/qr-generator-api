# 🚀 Netlify Deployment Guide for QR Code API

## 📋 Overview
This guide will help you deploy your QR Code API to Netlify using serverless functions. Since NestJS is a backend framework, we've converted it to work with Netlify's serverless architecture.

## 🎯 Deployment Options

### Option 1: Netlify (Serverless Functions) - **RECOMMENDED**
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Easy deployment
- ✅ Serverless functions

### Option 2: Alternative Platforms (For Full NestJS)
- **Vercel** - Supports NestJS with serverless functions
- **Railway** - Full backend hosting
- **Heroku** - Full backend hosting
- **DigitalOcean App Platform** - Full backend hosting

## 🚀 Netlify Deployment Steps

### Step 1: Prepare Your Repository
```bash
# Make sure all files are committed
git add .
git commit -m "feat: add Netlify serverless functions and deployment config"
git push origin main
```

### Step 2: Connect to Netlify

1. **Go to [Netlify](https://netlify.com)**
2. **Sign up/Login** with GitHub, GitLab, or Bitbucket
3. **Click "New site from Git"**
4. **Choose your repository** (`qrapi`)
5. **Configure build settings:**
   - Build command: `pnpm run build:netlify`
   - Publish directory: `public`
   - Functions directory: `netlify/functions`

### Step 3: Environment Variables (Optional)
If you need any environment variables:
1. Go to **Site settings** → **Environment variables**
2. Add any required variables

### Step 4: Deploy
1. Click **"Deploy site"**
2. Wait for deployment to complete
3. Your API will be available at: `https://your-site-name.netlify.app`

## 🔗 API Endpoints After Deployment

Your deployed API will have these endpoints:

### 1. Main Documentation Page
```
GET https://your-site-name.netlify.app/
```
- Interactive documentation page
- Test buttons for all endpoints

### 2. Generate QR Code (GET - Direct Image)
```
GET https://your-site-name.netlify.app/api/qr-generate?type=json&provider=GCASH&account_number=9873297&account_name=gladmad%20wiver
```
- Returns PNG image directly
- Perfect for `<img>` tags

### 3. Generate QR Code (POST - JSON Response)
```
POST https://your-site-name.netlify.app/api/qr-generate
Content-Type: application/json

{
  "provider": "GCASH",
  "account_number": "9873297",
  "account_name": "gladmad wiver"
}
```
- Returns JSON with base64 QR code

### 4. Generate QR Code URL (POST - URL Response)
```
POST https://your-site-name.netlify.app/api/qr-generate-url
Content-Type: application/json

{
  "provider": "GCASH",
  "account_number": "9873297",
  "account_name": "gladmad wiver"
}
```
- Returns JSON with QR code containing URL

## 🧪 Testing Your Deployment

### Test with cURL:
```bash
# Test GET endpoint (returns image)
curl -o qr.png "https://your-site-name.netlify.app/api/qr-generate?type=json&provider=GCASH&account_number=9873297&account_name=gladmad%20wiver"

# Test POST endpoint (returns JSON)
curl -X POST "https://your-site-name.netlify.app/api/qr-generate" \
  -H "Content-Type: application/json" \
  -d '{"provider":"GCASH","account_number":"9873297","account_name":"gladmad wiver"}'
```

### Test in Browser:
1. Visit `https://your-site-name.netlify.app/`
2. Click the test buttons
3. See generated QR codes

## 📁 Project Structure for Netlify

```
qrapi/
├── netlify.toml                 # Netlify configuration
├── netlify/
│   └── functions/
│       ├── qr-generate.js       # Main QR generation function
│       └── qr-generate-url.js   # URL-based QR generation
├── public/
│   └── index.html              # Documentation page
├── src/                        # Original NestJS code (not used in Netlify)
└── package.json               # Dependencies
```

## 🔧 Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Add your custom domain
3. Configure DNS settings
4. Enable HTTPS (automatic)

## 📊 Monitoring & Analytics

- **Netlify Analytics** - View traffic and performance
- **Function logs** - Monitor serverless function execution
- **Build logs** - Track deployment status

## 🚨 Important Notes

1. **Serverless Functions**: Each request runs in a separate function instance
2. **Cold Starts**: First request might be slower due to cold start
3. **Timeout**: Functions have a 10-second timeout (free tier)
4. **Memory**: 128MB memory limit (free tier)
5. **Requests**: 100GB bandwidth per month (free tier)

## 🔄 Continuous Deployment

Once connected, Netlify will automatically deploy when you push to your main branch:
```bash
git add .
git commit -m "feat: update QR generation"
git push origin main
# Netlify automatically deploys!
```

## 🆘 Troubleshooting

### Common Issues:

1. **Function not found (404)**
   - Check `netlify.toml` redirects
   - Verify function files are in `netlify/functions/`

2. **Build failed**
   - Check build command in Netlify settings
   - Verify `package.json` has correct dependencies

3. **CORS errors**
   - Functions include CORS headers
   - Check browser console for specific errors

4. **QR code not generating**
   - Check function logs in Netlify dashboard
   - Verify all required parameters are provided

## 🎉 Success!

Your QR Code API is now live on Netlify! 🚀

**Next Steps:**
- Test all endpoints
- Share your API URL
- Monitor usage in Netlify dashboard
- Consider upgrading to Pro plan for higher limits
