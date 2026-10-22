# Nobody's Simple accounts: manual setup

This package adds a first version of Google sign-in, email/password accounts, password reset and verification, plus optional syncing of the existing saved-work items.

It does not yet add unique usernames, public comments, moderation, account export/deletion, or cloud sync for every possible future tool. It keeps guest data local unless a signed-in user explicitly turns on sync.

## Part 1 — Put the files on the accounts-and-sync branch

1. Download and unzip nobodyssimple-firebase-manual-setup.zip.
2. Open the Nobody's Simple repository on GitHub.
3. Use the branch menu above the file list to choose accounts-and-sync.
4. Choose Add file → Upload files. Upload accounts.mjs and firestore.rules. Commit the upload to accounts-and-sync.
5. Open index.html on that branch and click the pencil icon to edit it.
6. Near the bottom, find the existing line:
   <script type="module" src="site.mjs"></script>
7. Add this line immediately above it:
   <script type="module" src="accounts.mjs"></script>
8. Scroll down and commit the change to accounts-and-sync.

The account button will appear in the top bar. Closing the account window lets a visitor continue as a guest.

## Part 2 — Turn on sign-in in Firebase

1. Open the Firebase Console and choose the nobodys-simple project.
2. Open Authentication and choose Get started if shown.
3. Under Sign-in method, enable Email/Password and Google. For Google, choose a support email and save.
4. In Authentication Settings, find Authorized domains. Add nobodyssimple.com and www.nobodyssimple.com if they are not already listed.
5. Open Firestore Database. If you have not created a database yet, choose Create database. Use production mode and choose the location nearest the people who will mainly use the site.

## Part 3 — Publish the private-data rules

1. In Firebase, open Firestore Database → Rules.
2. Open the firestore.rules file from this package in a text editor.
3. Select all the text in that file and copy it.
4. Replace the text in the Firebase Rules editor with the copied rules.
5. Click Publish.

These rules let a signed-in person read and write only their own saved-work records. Everything else in the database stays blocked.

## Part 4 — Test before making the branch live

1. On the branch, check that accounts.mjs and firestore.rules appear in the repository and that index.html includes the new script line.
2. Do not merge the branch into the live website until Firebase Authentication and Firestore are ready.
3. Once the branch is ready, test Google sign-in, email account creation, password reset, and the two sync choices.
4. When testing sync, use test data first. The import choice uploads saved maps, tool data, reflections, and questionnaire results from that browser to the account. The other choice replaces the current browser's saved items with the account's saved items.
5. Each browser/device asks separately before it begins syncing.

## Notes

- The Firebase web configuration in accounts.mjs is public by design. Never add a service-account JSON file, private key, or OAuth client secret to the website.
- The JavaScript uses Firebase's official browser CDN modules. It does not need npm, a terminal, or a build step.
- If sign-in says the domain is unauthorized, check that the address shown in your browser is included under Firebase Authentication's authorized domains.
- If saved-work sync reports a permission error, check that the rules in Part 3 were published in the correct Firebase project.
