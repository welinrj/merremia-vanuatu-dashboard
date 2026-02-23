# Firebase Setup Guide

This guide will help you set up Firebase for the Merremia Vanuatu Dashboard project with Authentication, Firestore Database, Cloud Storage, and Realtime Database.

## Prerequisites

- A Google account
- Access to the Firebase Console (https://console.firebase.google.com/)

## Step 1: Create Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `merremia-vanuatu-dashboard` (or your preferred name)
4. (Optional) Enable Google Analytics if desired
5. Click "Create project"

## Step 2: Register Web App

1. In your Firebase project, click the Web icon (</>) to add a web app
2. Enter app nickname: `VCAP2 Dashboard`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. **Save the configuration values** - you'll need these for the `.env` file

## Step 3: Enable Authentication

1. In the Firebase Console, go to **Authentication** → **Get started**
2. Enable the following sign-in methods:
   - **Email/Password**: Click "Enable" and save
   - **Google**: Click "Enable", configure support email, and save

### Create First Admin User

1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Enter email and password for the admin account
4. After creating, go to **Firestore Database** → **users** collection
5. Create a document with ID matching the user's UID:
   ```json
   {
     "email": "admin@example.com",
     "name": "Admin User",
     "role": "admin",
     "organization": "DEPC",
     "createdAt": <current timestamp>,
     "lastLogin": <current timestamp>
   }
   ```

## Step 4: Set Up Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose "Start in production mode"
3. Select a location (e.g., `asia-southeast1` for Southeast Asia)
4. Click "Enable"

### Deploy Firestore Rules

1. Install Firebase CLI if not already installed:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select: Firestore, Storage, Realtime Database
   - Choose existing project
   - Accept default file names

4. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Step 5: Set Up Cloud Storage

1. Go to **Storage** → **Get started**
2. Choose "Start in production mode"
3. Select the same location as Firestore
4. Click "Done"

### Deploy Storage Rules

```bash
firebase deploy --only storage:rules
```

## Step 6: Set Up Realtime Database

1. Go to **Realtime Database** → **Create Database**
2. Choose a location (same region as other services)
3. Choose "Start in locked mode"
4. Click "Enable"

### Deploy Database Rules

```bash
firebase deploy --only database:rules
```

## Step 7: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in the values from Step 2 (web app configuration):
   ```env
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
   ```

3. **Important**: Add `.env` to `.gitignore` (it should already be there)

## Step 8: Update Firebase Configuration

If you need to find your configuration values again:
1. Go to Firebase Console → Project Settings
2. Scroll to "Your apps" section
3. Find your web app and view configuration

## Step 9: Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Try logging in with the admin account you created
3. Test uploading a dataset
4. Verify data appears in Firestore Console

## User Roles

The application supports three user roles:

- **admin**: Full access to all features including user management
- **editor**: Can upload, edit, and delete datasets
- **viewer**: Read-only access to datasets

### Creating Additional Users

#### Option 1: Firebase Console (Recommended for first users)

1. Go to **Authentication** → **Users** → **Add user**
2. Create the user account
3. Go to **Firestore Database** → **users**
4. Create a document with the user's UID containing:
   ```json
   {
     "email": "user@example.com",
     "name": "User Name",
     "role": "editor",  // or "viewer"
     "organization": "Organization Name",
     "createdAt": <current timestamp>,
     "lastLogin": <current timestamp>
   }
   ```

#### Option 2: Firebase Admin SDK (For programmatic user creation)

You can create a backend service using Firebase Admin SDK to handle user registration with proper role assignment.

## Security Considerations

1. **Never commit `.env` file** to version control
2. **Restrict API keys** in Firebase Console → Project Settings → API restrictions
3. **Review security rules** regularly in Firebase Console
4. **Monitor usage** in Firebase Console → Usage and billing
5. **Set up budget alerts** to avoid unexpected charges

## Troubleshooting

### Authentication Errors

- **"Firebase: Error (auth/popup-blocked)"**: Browser is blocking pop-ups. Allow pop-ups for your domain.
- **"Firebase: Error (auth/unauthorized-domain)"**: Add your domain to authorized domains in Firebase Console → Authentication → Settings → Authorized domains

### Firestore Permission Denied

- Check that security rules are deployed: `firebase deploy --only firestore:rules`
- Verify user has correct role in Firestore `users` collection
- Check browser console for specific error messages

### Storage Upload Fails

- Verify storage rules are deployed: `firebase deploy --only storage:rules`
- Check file size limits in `storage.rules`
- Ensure user has editor or admin role

### Realtime Database Not Syncing

- Check database rules are deployed: `firebase deploy --only database:rules`
- Verify database URL is correct in `.env`
- Check browser console for connection errors

## Firebase Pricing

The Firebase Spark (free) plan includes:
- **Authentication**: Unlimited users
- **Firestore**: 1 GB storage, 50K reads/day, 20K writes/day
- **Storage**: 5 GB storage, 1 GB/day downloads
- **Realtime Database**: 1 GB storage, 10 GB/month downloads

For production use, consider upgrading to the Blaze (pay-as-you-go) plan.

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

## Support

For issues or questions:
1. Check the Firebase Console logs
2. Review the browser console for error messages
3. Check the [Firebase Status Dashboard](https://status.firebase.google.com/)
