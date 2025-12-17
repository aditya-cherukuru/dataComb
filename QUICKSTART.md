# Quick Start Guide - Testing DataComb

## Option 1: Test WITHOUT Hive Keychain (Easiest)

For demo purposes, you can bypass the actual Keychain and use mock authentication:

### Step 1: Update the Login Function

Open `src/lib/hive.ts` and temporarily modify the `loginWithKeychain` function:

```typescript
// TEMPORARY: Mock login for testing (line ~70)
export async function loginWithKeychain(username: string): Promise<{ success: boolean; msg: string }> {
  // Skip Keychain check for demo
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, msg: 'Login successful (Demo Mode)' });
    }, 500);
  });
}
```

### Step 2: Test the App

1. Open `http://localhost:5174` in your browser
2. Click "Login" button
3. Enter ANY username (e.g., "testuser")
4. Click "Login" - it will work immediately!
5. You'll see the username in the header

**Note**: This is just for testing. For hackathon submission, use real Keychain (Option 2).

---

## Option 2: Use Real Hive Keychain (For Submission)

### Step 1: Install Hive Keychain

1. **Chrome/Brave**: [Chrome Web Store](https://chrome.google.com/webstore/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep)
2. **Firefox**: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/hive-keychain/)

### Step 2: Create/Import Hive Account

**Option A: Create New Account**
1. Go to [signup.hive.io](https://signup.hive.io/)
2. Follow the signup process
3. Save your keys securely

**Option B: Use Existing Account**
1. Click Keychain extension
2. Click "Add Account"
3. Enter your username and keys

### Step 3: Test Login

1. Open `http://localhost:5174`
2. Click "Login"
3. Enter your Hive username
4. Keychain popup will appear
5. Click "Approve"
6. You're logged in!

---

## Option 3: Use Hive Testnet (Recommended for Development)

### Setup Testnet Account

1. Go to [testnet.openhive.network](https://testnet.openhive.network/)
2. Create a test account
3. Get free test HIVE tokens

### Update Code for Testnet

In `src/lib/hive.ts`, change the client initialization:

```typescript
// Use testnet instead of mainnet
const client = new Client([
  'https://testnet.openhive.network',
]);
```

---

## Quick Demo Mode (No Setup Required)

Want to show the UI without any blockchain interaction?

### Create a Demo Mode Toggle

Add this to `src/contexts/AuthContext.tsx`:

```typescript
// Add a demo login function
const demoLogin = (username: string) => {
  const demoUser: UserProfile = {
    name: username,
    reputation: 65,
    metadata: { profile: { name: username } },
    balance: '100.000 HIVE',
    hbd_balance: '50.000 HBD',
    post_count: 42,
  };
  setUser(demoUser);
  localStorage.setItem('datacomb_user', JSON.stringify(demoUser));
};
```

Then in the login modal, add a "Demo Mode" button.

---

## Troubleshooting

### "Hive Keychain not found"
- Install the browser extension
- Refresh the page after installation

### Login button does nothing
- Check browser console (F12) for errors
- Make sure dev server is running (`npm run dev`)

### Keychain popup doesn't appear
- Check if extension is enabled
- Try clicking the extension icon manually
- Disable ad blockers

---

## For Hackathon Judges

If you don't have Hive Keychain:

1. **Watch the demo video** - Shows full functionality
2. **Use screenshots** - See all features
3. **Review code** - All Hive integration is in `src/lib/hive.ts`
4. **Test with mock data** - The UI works without blockchain

The app is designed to work with or without Keychain for demonstration purposes!

---

## Next Steps

Once login works:
1. ✅ Navigate to "Dashboard"
2. ✅ Click "Create Task"
3. ✅ Go to "My Work"
4. ✅ Try "VSC Bridge"

**Need more help? Let me know!**
