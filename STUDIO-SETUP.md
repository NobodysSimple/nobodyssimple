# Nobody’s Simple — your website and publishing studio

This update uses your existing GitHub Pages hosting and domain. No paid CMS or monthly hosting subscription is needed. Domain renewal remains separate.

## 1. Upload this update once

1. Download and extract the ZIP. Open the extracted folder.
2. Open https://github.com/NobodysSimple/nobodyssimple and select the **Code** tab. Make sure the branch is **main**.
3. For a backup first, use **Code → Download ZIP** in GitHub.
4. Choose **Add file → Upload files**.
5. Drag the files from the extracted folder into GitHub. Upload the CONTENTS of the folder, not the ZIP and not an extra enclosing folder. `index.html`, `admin.html`, `content.json`, and the `.mjs` files must sit at the top level alongside `CNAME`.
6. Choose **Commit changes**. Use a message such as “Add library, owner studio and interactive tools”.
7. Open **Settings → Pages**. For this plain HTML site, set **Source: Deploy from a branch**, **Branch: main**, and **Folder: / (root)** if those settings are not already selected. Save.
8. Keep your custom domain `nobodyssimple.com` and Enforce HTTPS enabled. Do not change Cloudflare DNS.
9. Open **Actions** and look for the **pages build and deployment** run. The “CI / build” workflow that prints Hello world is not the Pages deployment.
10. When the Pages run succeeds, refresh https://nobodyssimple.com. If necessary, close and reopen the tab or do a hard refresh.

The ZIP deliberately does not replace your existing GitHub Actions workflows. `.nojekyll` is included; if your computer hides that file, this site also contains no underscore-prefixed content folders that need it. You do not need to change the repository name.

IMPORTANT: This is the initial empty content index for the new studio. After you start publishing, keep your live `content.json` and `media` folder when making later design updates. Do not re-upload this original empty `content.json` over your published content.

## 2. Connect the owner studio

Only do this after the update is live.

1. In GitHub, click your avatar → **Settings → Developer settings → Personal access tokens → Fine-grained tokens**.
2. Choose **Generate new token**. Give it a name such as “Nobody’s Simple publishing studio”. Set an expiry date you are comfortable renewing.
3. Choose **Resource owner: NobodysSimple**.
4. Under repository access, choose **Only select repositories → nobodyssimple**.
5. Under **Repository permissions**, set **Contents → Read and write**. GitHub includes required metadata read access. No organization administration, workflow write, or access to other repositories is required.
6. Generate and copy the token. Keep it privately in a password manager. Do not paste it into ChatGPT, your repository, a blog post, or any website other than your own HTTPS owner studio.
7. Open https://nobodyssimple.com/admin.html, paste it into the **GitHub token** field, and click **Connect to GitHub**.

The token stays only in this tab’s memory. It is sent only to GitHub’s API, never included in posts, local draft backups or the website files. Refreshing, closing the tab or clicking Disconnect clears it. If it expires or is revoked, create a replacement with the same narrow permissions.

The owner studio checks that the signed-in account is NobodysSimple. GitHub enforces the actual write permissions. The login page itself is publicly viewable because GitHub Pages serves public static files; visitors cannot publish without valid GitHub credentials. This is not a private server or a password-protected storage area.

## 3. Publish your content

### Blog post

Select **+ Blog post**. Add the title, introduction, thumbnail, thumbnail description, writing and comma-separated themes. Click **Preview**, then **Publish to website**. It appears in the blog and its theme filters. Blog posts are separate from curriculum resources.

### Educational writing

Select **+ Educational writing**. Fill out the template, add images if useful, and select all applicable modules and lessons. You can assign the same resource to multiple places. Selecting a lesson also associates its module. Add themes and publish. It appears in the learning library, topic filters, selected modules and selected lessons.

### YouTube video

Upload the video to your YouTube channel first, then select **+ YouTube video** in the studio and paste its YouTube URL. Add a title, thumbnail, notes, themes and curriculum locations. Publish. Visitors press Play and the video plays inside the website. The video must be available to viewers and allow embedding. GitHub does not host the raw video file.

### Writing and images

- A blank line separates paragraphs.
- Start a heading with `## `.
- Use the inline image upload to add a picture. Enter its description first; the studio inserts an image line at the end of the text. Move that whole line between paragraphs to place it elsewhere.
- Supported images: PNG, JPEG and WebP, up to 5 MB each.
- The editor intentionally displays ordinary text rather than arbitrary HTML. It does not execute scripts or HTML pasted into posts.

A successful publish creates one GitHub commit containing both the content and its images. GitHub Pages then deploys it. This can take several minutes; refresh your website afterward. There are no paid publishing services involved.

## 4. Drafts, editing and unpublishing

- **Save local draft** stores one draft on this browser/device, replacing the previous saved draft. It includes pending images. Browser storage can fill; use **Download backup** for larger drafts.
- **Load local draft** restores it. **Clear local draft** removes the saved copy.
- **Download backup** saves a JSON draft file; use **Restore downloaded draft** to load it later, after connecting.
- Drafts are not automatically synchronized between devices. Anyone with access to the same browser profile can load its saved draft.
- In **Your content**, choose **Edit**, change the piece and publish again.
- **Unpublish** hides the piece from public listings and its article route. The content and images remain in your public repository and its history. Never publish private information expecting unpublish to erase it.
- If someone changes the same piece in another tab, the studio refuses to overwrite it. Download your draft, reload, open the latest piece and copy your intended changes into it.

## 5. The library and curriculum

The map includes the 2026–27 Recursive Autonomy curriculum: SEE, TRACE, RESIST and GOVERN; 12 modules; 48 lessons plus four synthesis checkpoints. All 52 lesson/checkpoint titles are included. Lessons with no published resource say **Planned**; this does not claim a video or article already exists.

Your video URLs, finished blog posts and educational articles have not been invented. Add the actual pieces through the studio. Topic/theme filters are the website’s folder-like organization; there is no need to create GitHub folders for each theme.

Curriculum titles and structure are defined in `data.mjs`. The publishing studio assigns content to this curriculum; it does not edit the curriculum structure itself.

## 6. Interactive tools

- **Emotion compass:** X = unpleasant to pleasant; Y = low to high energy. Drag on the graph, use either slider with a mouse or keyboard, or search/select any wheel label. There are 108 wheel positions / 107 distinct labels. Dismayed is retained under both Sadness and Surprise. Coordinates are editorial starting points, not validated clinical measurements.
- **From emotion to action:** your eight questions, with next/back navigation, a complete review and a downloadable reflection. The selected compass emotion carries into the reflection in the same tab. Answers are kept in memory unless the visitor chooses Save on this device. They are never sent to the site owner or GitHub.
- **Make a little room:** the existing three starting paths now have usable checklists and lead into the reflection tool.

## 7. Install on a phone

On iPhone/iPad, open the site in Safari → Share → Add to Home Screen. On Android, use Chrome’s Install app or Add to Home screen option. The site has a web app manifest, app icons and offline caching for public pages/tools. Videos and publishing still require internet access. The owner studio and authenticated GitHub API requests are excluded from the new offline cache.

## Verification and limits

Tested locally with Node assertions and DOM integration checks: all curriculum entries and emotion labels, separate archives, quarter filtering, click-to-load embedding, reflection navigation and draft controls, safe text/image rendering, and simulated GitHub publishing including images, stale edits and permission errors. Run `node tests/verify.mjs` for the dependency-free core checks.

A live authenticated publish and visual browser/mobile review were not performed: no owner token was used, and the available browser could not reach the local preview. Verify the first real publication with a harmless post. The code has not been pushed or deployed automatically.

If the studio says GitHub denied access, check the token’s repository selection, Contents permission and expiry. If publishing succeeds but the site does not update, check **Actions → pages build and deployment** and **Settings → Pages**. Branch protection can prevent direct main-branch updates; this studio reports the failure rather than bypassing it.

Official references:
- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
- https://docs.github.com/en/rest/authentication/permissions-required-for-fine-grained-personal-access-tokens
- https://docs.github.com/en/rest/guides/using-the-rest-api-to-interact-with-your-git-database
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
