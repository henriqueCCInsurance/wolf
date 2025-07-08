# OAuth Setup Guide for W.O.L.F. Den

This guide explains how to set up Google, GitHub, and Apple OAuth authentication for the W.O.L.F. Den application.

## Prerequisites

- A Supabase project
- Access to Google Cloud Console (for Google OAuth)
- A GitHub account (for GitHub OAuth)
- An Apple Developer account (for Apple Sign In - requires paid membership)

## Setting Up Google OAuth

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`
     - `http://localhost:5173/auth/callback` (for local development)
   - Save your Client ID and Client Secret

### 2. Supabase Configuration

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Find Google and click "Enable"
4. Enter your Google Client ID and Client Secret
5. Save the configuration

## Setting Up GitHub OAuth

### 1. GitHub OAuth App Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: W.O.L.F. Den
   - **Homepage URL**: Your application URL
   - **Authorization callback URL**: `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`
4. Register the application
5. Copy the Client ID and generate a Client Secret

### 2. Supabase Configuration

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Find GitHub and click "Enable"
4. Enter your GitHub Client ID and Client Secret
5. Save the configuration

## Setting Up Apple Sign In

### 1. Apple Developer Account Setup

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Sign in with your Apple ID (must have paid Developer membership)
3. Navigate to Certificates, Identifiers & Profiles

### 2. Create an App ID

1. Click on "Identifiers" in the sidebar
2. Click the "+" button to create a new identifier
3. Select "App IDs" and click Continue
4. Select "App" as the type and click Continue
5. Fill in the details:
   - **Description**: W.O.L.F. Den
   - **Bundle ID**: com.campbellco.wolfden (or your preference)
6. Under Capabilities, enable "Sign in with Apple"
7. Click Continue and then Register

### 3. Create a Services ID

1. In Identifiers, click "+" again
2. Select "Services IDs" and click Continue
3. Fill in the details:
   - **Description**: W.O.L.F. Den Web Service
   - **Identifier**: com.campbellco.wolfden.web
4. Click Continue and Register
5. Click on your new Services ID from the list
6. Enable "Sign in with Apple"
7. Click Configure next to "Sign in with Apple"
8. Set up domains and return URLs:
   - **Primary App ID**: Select your App ID from step 2
   - **Domains**: Add your Supabase project domain (e.g., `YOUR_PROJECT.supabase.co`)
   - **Return URLs**: Add `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
9. Click Next, then Done, then Continue, then Save

### 4. Create a Private Key

1. Go to "Keys" in the sidebar
2. Click the "+" button
3. Give your key a name (e.g., "W.O.L.F. Den Auth Key")
4. Enable "Sign in with Apple"
5. Click Configure next to "Sign in with Apple"
6. Select your Primary App ID
7. Click Save, then Continue, then Register
8. Download the private key file (.p8) - **Save this securely!**
9. Note your Key ID (shown on the key details page)

### 5. Gather Required Information

You'll need:
- **Team ID**: Found in your Apple Developer account membership details
- **Service ID**: The identifier from step 3 (e.g., `com.campbellco.wolfden.web`)
- **Key ID**: From step 4
- **Private Key**: The .p8 file contents from step 4

### 6. Supabase Configuration

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Find Apple and click "Enable"
4. Enter your configuration:
   - **Service ID**: Your Services ID identifier
   - **Team ID**: Your Apple Developer Team ID
   - **Key ID**: Your private key ID
   - **Private Key**: Paste the entire contents of your .p8 file
5. Save the configuration

## Supabase Auth Configuration

### Site URL and Redirect URLs

1. In Supabase Dashboard, go to Authentication > URL Configuration
2. Set **Site URL** to your production URL (e.g., `https://wolf-den.netlify.app`)
3. Add to **Redirect URLs**:
   - `http://localhost:5173` (for local development)
   - `http://localhost:5173/auth/callback`
   - Your production URL
   - Your production URL + `/auth/callback`

### Database Trigger for User Profiles

The application expects a user profile to be created automatically when a user signs up. This is handled by a database trigger:

```sql
-- This trigger should already be set up in your Supabase project
-- It creates a user profile in the public.users table when auth.users gets a new entry
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, avatar)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    COALESCE(new.raw_user_meta_data->>'role', 'salesperson'),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Testing OAuth

### Local Development

1. Ensure your `.env` file has the correct Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Navigate to the login page and click on Google, GitHub, or Apple sign-in

### Troubleshooting

#### "Redirect URL mismatch" error
- Ensure the redirect URL in your OAuth provider matches exactly with Supabase's callback URL
- Check that your Site URL is configured correctly in Supabase

#### User profile not created
- Check that the database trigger is properly set up
- Verify the user metadata is being passed correctly from the OAuth provider

#### OAuth redirect not working
- Ensure your application is handling the `/auth/callback` route
- Check browser console for any JavaScript errors
- Verify that the Supabase client is properly initialized

## Security Considerations

1. **Never expose your Client Secrets** in frontend code
2. **Use environment variables** for all sensitive configuration
3. **Restrict OAuth scopes** to only what's necessary
4. **Validate user roles** on both frontend and backend
5. **Set up Row Level Security (RLS)** in Supabase for data protection

## Production Deployment

When deploying to production:

1. Update OAuth redirect URLs in Google, GitHub, and Apple to include your production domain
2. Update Supabase URL Configuration with production URLs
3. Ensure environment variables are properly set in your hosting platform
4. Test OAuth flow thoroughly in production environment