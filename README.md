# Ledger — Invoicing App

An offline-first invoicing app for creating and managing customer invoices —
manage customers, build itemized invoices, track paid/unpaid/overdue status,
and export any invoice as a PDF. Packaged as an installable Android APK.

All data is stored locally on the device (localStorage) — no server, no account needed.

## Get the APK (no Android Studio needed)

This repo is set up to build the APK automatically using **GitHub Actions** —
GitHub's free build servers do the work for you.

1. Create a new **public or private repo** on GitHub (e.g. `ledger-invoicing`).
2. Upload/push all the files in this folder to that repo.
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. On GitHub, open the **Actions** tab of your repo. A workflow called
   **"Build Android APK"** will run automatically (takes ~3-5 minutes).
4. When it finishes (green check ✓), click into the workflow run, scroll to
   **Artifacts**, and download **`ledger-invoicing-debug-apk`**. Unzip it —
   inside is `app-debug.apk`.
5. Transfer `app-debug.apk` to your Android phone (email it to yourself, use
   Google Drive, or a USB cable) and tap it to install. You'll need to allow
   "install from unknown sources" the first time — Android will prompt you.

You can also trigger a fresh build any time from the **Actions** tab using
the **"Run workflow"** button (workflow_dispatch), without needing a new push.

## Local development (optional)

If you want to preview the app in a browser first:
```bash
cd www
python3 -m http.server 8000
# open http://localhost:8000
```

If you have Android Studio installed locally and want to build/run there instead:
```bash
npm install
npx cap add android
npx cap sync android
npx cap open android
```

## App features

- **Dashboard** — outstanding balance, total paid, total invoiced, recent invoices
- **Customers** — add/edit/delete customers with contact info
- **Invoices** — itemized line items, tax rate, discount, due dates, notes
- **Status tracking** — Draft / Unpaid / Paid / Overdue (auto-detected from due date)
- **PDF export** — download any invoice as a shareable PDF
- **Settings** — your business name, address, logo details, default currency & tax rate
- **Backup** — export all data as a JSON file from Settings

## Notes

- The debug APK from the workflow is signed with a debug key — fine for personal
  use and installing on your own devices, but not for publishing to the Play Store.
  If you want a Play Store–ready release build, that needs a release signing key,
  which I can help you set up separately.
- Currency symbol and tax rate defaults are set in the Settings tab.
