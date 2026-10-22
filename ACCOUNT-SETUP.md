# Nobody’s Simple — free Firebase Spark update

This edition replaces the earlier Cloud Functions package. Stay on Firebase **Spark**; do not upgrade to Blaze, add billing, install Cloud Functions, enable Identity Platform or use Cloud Shell. Standard Google/email authentication and Firestore are used within their free quotas. When free quotas are exhausted, requests can fail until quota resets; Spark does not automatically start paid usage.

## Which folder goes where?

| Item in the ZIP | What to do |
| --- | --- |
| `UPLOAD-TO-GITHUB` | Open this folder. Upload everything **inside it** to your repository root. |
| `READ-ME-FIRST.txt` | Instructions to read on your computer; no upload needed. |
| `FEATURE-NOTES.txt` | Feature boundaries and test details; no upload needed. |

Do not upload the outer `UPLOAD-TO-GITHUB` folder or the ZIP itself. The loose files go beside your existing `index.html`. The supplied `media` folder must remain a folder so the character paths become `media/avatars/reading.png`, etc. GitHub adds those new files alongside existing media; do not delete your existing media folder.

## A. Download and extract

1. Download **NobodysSimple-Free-Account-Update.zip** from the chat.
2. Find it in Downloads. Right-click → **Extract All → Extract**.
3. Open the extracted folder. Open **UPLOAD-TO-GITHUB**.
4. Leave that window open.

## B. Put the files on a separate GitHub branch

1. Open https://github.com/NobodysSimple/nobodyssimple.
2. Click the branch selector labelled **main**.
3. Type **account-hub-free** and click **Create branch: account-hub-free from main**.
4. Check that the selector now says **account-hub-free**.
5. On the main file list—the page with `index.html`, `site.mjs` and `styles.css`—click **Add file → Upload files**. Do not open `media` or another subfolder first.
6. Return to the computer window that is **inside UPLOAD-TO-GITHUB**. Press **Ctrl+A** to select its files and folders, then drag the selection into GitHub’s upload area. Folder dragging preserves nested paths. The file chooser can omit folders, so drag the selection rather than selecting only loose files through the chooser.
7. GitHub should show `index.html`, `accounts.mjs`, `account-free.mjs`, `account.css` and paths like `media/avatars/reading.png`. If every path begins `UPLOAD-TO-GITHUB/`, remove that upload selection and drag the folder’s contents instead. Nothing has been committed until the next step.
8. Enter commit message **Add free account hub**. Choose **Commit directly to account-hub-free**, then **Commit changes**.
9. Leave the branch unmerged until you publish the new Firebase rules.

**You do not need to edit index.html by hand.** Its supplied replacement already loads the account code and new stylesheet. Do not replace your whole repository with an empty folder; upload these files alongside the existing files. Your articles/content.json are not included or replaced.

## C. Publish the free Firestore rules

1. On GitHub, make sure **account-hub-free** is selected and open **firestore.rules**.
2. Use the file’s **Copy raw file** button. Alternatively, open **Raw**, click the page text, press **Ctrl+A**, then **Ctrl+C**. Copy only the rules text, not a GitHub page.
3. Open https://console.firebase.google.com/ and choose **nobodys-simple**.
4. Open **Firestore Database → Rules**.
5. In the rules editor, press **Ctrl+A**, then **Ctrl+V** to replace the old rules.
6. Click **Publish**. Wait for Firebase to confirm success.

Keep your existing Email/Password and Google providers and authorised domains; you already set them up. No database tables, SQL, indexes, functions or other services need manual creation for the account features. Documents are created by the app when needed.

These rules restrict profiles, reserve nicknames atomically and enforce the 14-day interval on Firebase’s clock. Editing browser JavaScript cannot bypass those checks. Publish the rules and merge the website update close together; the old account script can briefly stop saving under the stricter new rules. Existing cloud records are not erased.

## D. Put the website update live

1. Return to GitHub. Open **Pull requests → New pull request**.
2. Set **base: main** and **compare: account-hub-free**.
3. Click **Create pull request**, give it the title **Free account hub**, and click **Create pull request** again if prompted.
4. Wait for **Account checks** to pass, review the files, then click **Merge pull request → Confirm merge**.
5. Open **Actions** and wait for the latest GitHub Pages deployment to finish with a green check.
6. Open https://nobodyssimple.com and press **Ctrl+Shift+R**. If it still looks old, check in an InPrivate/Incognito window.
7. Sign in and click **Account → Profile & identity**. Choose your sprite and nickname, then save. The sprite should appear next to Account at the top.
8. Open **Appearance & accessibility** for light/dark mode and interface-language choices. **My Maps** is now inside Account. Old map links redirect there.

## E. Optional: give yourself comment moderation access

This uses the Firebase console you already have; it does not use a paid backend.

1. Sign into the updated website, open **Account → Profile & identity**, and copy **Private account ID**.
2. In Firebase, open **Firestore Database → Data → Start collection**.
3. Collection ID: **siteAdmins**. Click **Next**.
4. Document ID: paste **your private account ID**. Do not use Auto-ID and do not enter your email.
5. Add field **role**, type **string**, value **moderator**. Click **Save**.
6. Sign out and back into the website. **Account → Staff moderation** appears.

Only create that document for trusted moderators. Users cannot create or modify these documents through the website. All new comments start pending; nobody else can make a comment public until a moderator approves it. Approved comments are public; saved tool work is private.

## F. Test saving with harmless data

1. Create a test map or favourite on device A. Open **Account → Saved work**.
2. Tick the categories to sync. Select any specific old guest records to import, then choose **Import selected local work**.
3. On device B, sign into the same account, open **Saved work**, select those categories and choose **Use selected account copies**.
4. Reopen the map/tool to see the updated record. Test an edit and a deletion.
5. Sign out and sign into another test account; the first account’s data must be absent.
6. Normal browser sessions persist unless you sign out, clear site data or the browser discards it. Each new device needs its own sign-in and explicit sync choice.

The app resolves conflicts for a whole saved category. Export first if you want both versions. Tools already open may need to be reopened to display changes from another device.

## Included and omitted

See FEATURE-NOTES.txt. This edition includes sprites/cropped pictures, profile editing, private/public profile choices, protected nicknames, appearance/accessibility choices, supported drafts and learning, maps/favourites, opt-in cloud sync, exports, password reset, verification, linked sign-in methods, private-work lock, account deletion, website-session access cutoff, and moderated comments/reports/blocking.

It does not include in-app authenticator enrolment, server-scheduled reminders, automatic retention jobs or automatic reply/mention alerts. Calendar reminders are available through an exported calendar file. Languages cover core account/navigation labels, not every lesson or tool. No Cloud Functions or billing setup is required.

Account deletion cleans up cloud data from this browser before deleting Firebase sign-in. Keep the page open. If interrupted, sign in again and repeat **Privacy & data → Permanently delete my account**. A minimal deletion marker remains to deny old tokens access; this is not a user profile or saved reflection. Offline devices may retain old local copies until they reconnect. Website-session cutoff ends access to this site’s private data; it does not revoke Google sessions or Firebase refresh tokens at the provider level.

## Sources

https://firebase.google.com/docs/projects/billing/firebase-pricing-plans
https://firebase.google.com/docs/firestore/security/rules-conditions
https://firebase.google.com/docs/auth/web/manage-users
