# Frontend Changes Log

All changes tracked for `POS_frontend` only.

---

## [2026-08-21] — AWS Cognito Authentication Integration

### Package Installed
- `aws-amplify` — AWS Amplify v6 SDK for Cognito auth flows

---

### Files Created / Modified

#### `app/amplify-config.ts` — [NEW]
- Configures AWS Amplify with Cognito credentials.
- Cognito configuration is supplied via environment variables:
  - `NEXT_PUBLIC_COGNITO_USER_POOL_ID`
  - `NEXT_PUBLIC_COGNITO_CLIENT_ID`
#### `app/layout.tsx` — [MODIFIED]
- Imported `./amplify-config` so Amplify is initialized globally across all pages.

#### `app/(auth)/admin/login/page.tsx` — [MODIFIED]
- Converted to `'use client'` component.
- Integrated `signIn` from `aws-amplify/auth`.
- Handles **first-login force-change-password** flow using `confirmSignIn` with `CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED` challenge.
- Redirects to `/admin/dashboard` on successful login.
- Shows inline error messages below the form.

#### `app/(auth)/admin/forgot-password/page.tsx` — [MODIFIED]
- Converted to `'use client'` component.
- **Step 1**: Email input — calls `resetPassword({ username: email })` to trigger Cognito OTP email.
- **Step 2**: 6-digit OTP boxes + New Password + Confirm Password fields — calls `confirmResetPassword({ username, confirmationCode, newPassword })`.
- Resend OTP button re-calls `resetPassword`.
- Redirects to `/admin/login` on successful password reset.

#### `app/(auth)/admin/create-new-password/page.tsx` — [MODIFIED]
- Password reset is now handled entirely on the `forgot-password` page (OTP + new password in one step).
- This page now simply redirects to `/admin/forgot-password` to avoid broken direct links.

#### `app/(auth)/admin/signup/page.tsx` — [MODIFIED]
- Converted to `'use client'` component.
- **Step 1**: Registration form calls `signUp` from `aws-amplify/auth` with `email`, `phone_number`, `name` attributes.
- **Step 2**: OTP confirmation calls `confirmSignUp` with the code received by email.
- Redirects to `/admin/login` on successful confirmation.

---

## Auth Flow Summary

```
Admin Login
  └─ signIn(email, password)
       ├─ DONE → /admin/dashboard
       └─ CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED
            └─ confirmSignIn(newPassword) → /admin/dashboard

Forgot Password
  ├─ Step 1: resetPassword(email) → Cognito sends OTP email
  └─ Step 2: confirmResetPassword(email, otpCode, newPassword) → /admin/login

Admin Sign Up
  ├─ Step 1: signUp(email, password, name, phone)
  └─ Step 2: confirmSignUp(email, otpCode) → /admin/login
```
