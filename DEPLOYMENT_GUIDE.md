# 🚀 Firebase Hosting Deployment Guide

## Step-by-Step Deployment Instructions

### 1. **Create a Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `mental-health-chatbot` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. **Get Your Project ID**
1. In Firebase Console, go to Project Settings (gear icon)
2. Copy your **Project ID** (you'll need this)

### 3. **Update Configuration**
Replace `your-project-id` in `.firebaserc` with your actual project ID:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### 4. **Login to Firebase CLI**
Run this command in your terminal:
```bash
firebase login
```
- This will open your browser
- Sign in with your Google account
- Allow Firebase CLI access

### 5. **Deploy Your Website**
Run the deployment script:
```bash
./deploy.sh
```

Or manually:
```bash
firebase deploy
```

### 6. **Access Your Website**
After successful deployment, your website will be available at:
- **Primary URL**: `https://your-project-id.web.app`
- **Secondary URL**: `https://your-project-id.firebaseapp.com`

## 🔧 Manual Deployment Commands

If you prefer to run commands manually:

```bash
# 1. Login to Firebase
firebase login

# 2. Initialize hosting (if not done already)
firebase init hosting

# 3. Deploy
firebase deploy

# 4. View deployment status
firebase hosting:channel:list
```

## 📱 Mobile Testing

After deployment, test your mobile-friendly website:
1. Open the URL on your mobile device
2. Test the hamburger menu
3. Try the chat interface
4. Test mood tracking
5. Check all responsive features

## 🔄 Updating Your Website

To update your website after making changes:
```bash
firebase deploy
```

## 🛠️ Troubleshooting

### Common Issues:

1. **"No project found"**
   - Make sure you've created a Firebase project
   - Update `.firebaserc` with correct project ID

2. **"Permission denied"**
   - Run `firebase login` again
   - Make sure you're logged in with the correct Google account

3. **"Firebase CLI not found"**
   - Run: `npm install -g firebase-tools`

### Getting Help:
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

## 🎉 Success!

Your mental health chatbot is now live and mobile-friendly! Share the URL with users to start helping people with their mental wellness journey.
