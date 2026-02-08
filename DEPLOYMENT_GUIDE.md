# 🚀 Deployment Guide - SayIt

## Vercel Deployment Setup

Your app is deployed at: **https://usesayit.vercel.app/**

### ⚠️ Required Environment Variables

To make the app work, you need to set these environment variables on Vercel:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard

2. **Select your "head-click-magic" project**

3. **Go to Settings → Environment Variables**

4. **Add these variables:**

```
VITE_GEMINI_API_KEY = your_actual_gemini_api_key_here
VITE_SUPABASE_PROJECT_ID = yhxdejobqwhfzeviqnht
VITE_SUPABASE_PUBLISHABLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloeGRlam9icXdoZnpldmlxbmh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NDE4ODIsImV4cCI6MjA4NTIxNzg4Mn0.V0I8htMOrIZ-nqu2HHPnhp-4XDKSCDl_4Rqk8IAgq-U
VITE_SUPABASE_URL = https://yhxdejobqwhfzeviqnht.supabase.co
```

### 🔑 How to Get Your Gemini API Key

1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key" 
3. Copy the key
4. Paste it in Vercel environment variables as `VITE_GEMINI_API_KEY`

### ✅ After Setting Variables

1. Go back to Vercel dashboard
2. **Redeploy** the project (click "Redeploy")
3. Wait 1-2 minutes for deployment to complete
4. Visit https://usesayit.vercel.app/ - it should now show the app!

### 🔄 Local Development

For local testing, use `.env.local`:

```dotenv
VITE_GEMINI_API_KEY=your_key_here
VITE_SUPABASE_PROJECT_ID=yhxdejobqwhfzeviqnht
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloeGRlam9icXdoZnpldmlxbmh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NDE4ODIsImV4cCI6MjA4NTIxNzg4Mn0.V0I8htMOrIZ-nqu2HHPnhp-4XDKSCDl_4Rqk8IAgq-U
VITE_SUPABASE_URL=https://yhxdejobqwhfzeviqnht.supabase.co
```

Then run:
```bash
npm run dev
```

### 🐛 Troubleshooting

**Issue: Page shows blank/nothing**
- ✅ Solution: Set the `VITE_GEMINI_API_KEY` on Vercel and redeploy

**Issue: AI suggestions not working**
- ✅ Make sure Gemini API key is valid and has budget

**Issue: Head tracking not working**
- ✅ Allow camera/microphone permissions in browser
- ✅ Use HTTPS (Vercel provides this)

---

**Questions?** Check the main [SAYIT_README.md](./SAYIT_README.md) for feature details.
