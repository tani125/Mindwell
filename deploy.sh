#!/bin/bash

echo "🚀 Deploying Mental Health Chatbot to Firebase Hosting"
echo "=================================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please log in to Firebase first:"
    echo "Run: firebase login"
    echo "Then run this script again."
    exit 1
fi

# Initialize Firebase project if not already done
if [ ! -f "firebase.json" ]; then
    echo "⚙️  Initializing Firebase project..."
    firebase init hosting --project your-project-id
fi

# Deploy to Firebase Hosting
echo "📦 Deploying to Firebase Hosting..."
firebase deploy

echo "✅ Deployment complete!"
echo "🌐 Your website should be live at: https://your-project-id.web.app"
