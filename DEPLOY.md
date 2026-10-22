# Deploying Boss Your Business: GitHub -> Firebase Hosting

The site is static. Every push to `main` goes live automatically.

## One-time setup (about 10 minutes)

1. **Create the Firebase project**: console.firebase.google.com -> Add project. Note the Project ID.
2. **Put the Project ID in two places**:
   - `.firebaserc` (replace `YOUR-FIREBASE-PROJECT-ID`)
   - both files in `.github/workflows/` (the `projectId:` line)
3. **Create the GitHub repo and push** (from inside this folder):
   ```
   git init -b main
   git add .
   git commit -m "Initial site"
   git remote add origin https://github.com/YOUR-USER/YOUR-REPO.git
   git push -u origin main
   ```
4. **Add the deploy secret** (easiest way, from this folder):
   ```
   npm i -g firebase-tools
   firebase login
   firebase init hosting:github
   ```
   Answer: use existing project -> your repo -> *No* to build step -> *No* to overwriting `firebase.json` / existing workflows
   (say No if it asks to overwrite). It creates the `FIREBASE_SERVICE_ACCOUNT` secret in GitHub for you.
   If it generates extra workflow files, delete the duplicates and keep the two included here.
5. **Connect the domain**: Firebase console -> Hosting -> Add custom domain -> `www.sureshbalachandar.in`,
   then add the DNS records it shows you.

## After that

Edit a file -> commit -> push to `main` -> live in about a minute. Pull requests get a temporary preview URL.

## Notes

- `tools/` and the README are not uploaded to the live site (see `ignore` in `firebase.json`).
- HTML is cached 5 minutes, `/assets` 30 days (as the agency README suggests).
  If you replace an image or the CSS/JS, rename the file or expect up to 30 days of stale caching for returning visitors.
- No secrets belong in this repo. The Razorpay Key Secret must never be added.
- The audio and video files are large. GitHub blocks single files over 100 MB, so keep new media well below that.
