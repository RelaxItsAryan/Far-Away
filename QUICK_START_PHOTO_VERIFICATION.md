# Certificate Verification with Photo Upload - Quick Start Guide

## ✅ What's Ready Now

Your certificate verification system is fully implemented with:
- ✅ Photo upload requirement
- ✅ Email notification to admin  
- ✅ Job access restriction for unverified users
- ✅ Beautiful UI with validation

## 🚀 To Get Started

### 1. Set Up EmailJS (If Not Done)
Go to https://www.emailjs.com and:
1. Create account (free)
2. Set up email service (Gmail recommended)
3. Create email template with ID: `template_verification`
4. Get your Public Key and Service ID

### 2. Create `.env.local` in project root
```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_ADMIN_EMAIL=admin@apnarozgaar.com
```

### 3. Start dev server
```bash
npm run dev
```

## 🎯 Test the Flow

### Test as Unverified User:
1. Go to `/jobs` page
2. You'll see: "Certificate Verification Required" banner
3. Jobs are greyed out and disabled
4. Click "Go to Verify Certificate"

### Test Photo Upload:
1. Now on profile `/profile`
2. Scroll to "Certificate Verification" section
3. Click to upload an image
4. See preview with Change/Remove buttons
5. Try without uploading → "Submit" button is disabled
6. Upload photo → button enables

### Test Submission:
1. Upload certificate photo
2. Click "Submit for Verification"
3. See success message: "Our team will verify in few hours"
4. Profile shows "⏳ Verification Pending" badge
5. Email sent to your admin email

## 📊 Current States

### Unverified User:
```
Profile: "Submit for Verification" button (disabled until photo)
Jobs: Greyed out, banner shown, can't click
```

### Pending User:
```
Profile: "⏳ Verification Pending" - waiting for admin
Jobs: Still restricted (can't access)
Email: Sent to admin team with user info + photo notification
```

### Verified User:
```
Profile: "✓ Certificate Verified" badge
Jobs: Full access, can browse and apply
```

## 🔧 How It Works Behind the Scenes

1. User uploads photo (stored in browser memory)
2. Clicks "Submit for Verification"
3. Email sent to admin email with:
   - User name, email, ID
   - Message: "uploaded a photo, please verify"
   - Timestamp
4. Firebase database updated: `certificationStatus: 'pending'`
5. Profile refreshes → shows pending status
6. Jobs page checks status → restricts access

## 📝 Email Content

Admin receives email like:
```
Subject: New Certificate Verification Request - John Doe

Body:
John Doe (john@example.com) has requested certificate 
verification and uploaded a photo. Please review and 
verify within the next few hours.

User ID: firebase-uid-123
Type: Certificate Verification
Time: May 7, 2026, 2:30 PM
```

## 🎨 UI Components

### Profile Verification Section:
- Shows current status (unverified/pending/verified)
- Photo upload widget with preview
- Error messages for invalid files
- Submit button (disabled until photo)
- Success notification after submit

### Jobs Verification Banner:
- Lock icon with orange background
- "Certificate Verification Required" heading
- Clear explanation
- Two buttons:
  - "Go to Verify Certificate" (primary)
  - "Continue Learning" (secondary to interview prep)

## 🐛 Testing Checklist

- [ ] Can upload photo to profile
- [ ] Preview shows uploaded photo
- [ ] Can change/remove photo
- [ ] Submit button disabled without photo
- [ ] Submit button enabled with photo
- [ ] Click submit → success message appears
- [ ] Profile shows "Verification Pending" badge
- [ ] Jobs page shows verification banner
- [ ] Jobs are disabled (greyed out)
- [ ] Can't click on jobs while unverified
- [ ] Can click "Go to Verify" button
- [ ] Email received by admin

## 🎁 Future Features (When Ready)

1. **Admin Dashboard**
   - View pending verifications
   - See uploaded photos
   - Approve/Reject button
   - Send approval email to user

2. **Photo Storage**
   - Option to store in Firebase Storage
   - Link in admin dashboard instead of email

3. **Email Approval Notification**
   - User gets email when verified
   - Profile auto-updates

4. **Multiple Certificate Types**
   - Different verification badges
   - Education, skills, experiences

## 🆘 Troubleshooting

### Email not sending?
- Check `.env.local` has correct public key
- Verify service ID in EmailJS
- Check browser console for errors
- See EMAILJS_SETUP.md for help

### Photo upload not working?
- Check file is an image (jpg, png, etc)
- File size < 5MB
- Check browser console

### Jobs still accessible when unverified?
- Refresh the page
- Check you're logged in
- Check `certificationStatus` field in database

## 📚 Documentation Files

- `EMAILJS_SETUP.md` - Detailed EmailJS setup
- `CERTIFICATE_VERIFICATION_GUIDE.md` - Initial implementation
- `CERTIFICATE_VERIFICATION_WITH_PHOTO.md` - Complete feature guide

## ✨ Features Summary

| Feature | Status | What It Does |
|---------|--------|-------------|
| Photo Upload | ✅ Live | Required before verification |
| Photo Preview | ✅ Live | Shows what will be sent |
| Validation | ✅ Live | Checks file type and size |
| Email to Admin | ✅ Live | Sends verification request |
| Job Restriction | ✅ Live | Unverified can't see jobs |
| Status Tracking | ✅ Live | Shows pending/verified |
| Verification Banner | ✅ Live | Explains why restricted |
| Admin Approval | ⏳ Next | To build |

---

## 🎉 Ready to Test!

Everything is in place. Just:
1. Set up `.env.local` with EmailJS credentials
2. Run `npm run dev`
3. Test the flow above

**Questions?** Check the documentation files or see EMAILJS_SETUP.md for detailed help.
