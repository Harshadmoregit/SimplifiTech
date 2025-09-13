# SimplifiTech

**Warning:** This static site uses only client-side authentication and is not secure for sensitive or private data. If hosted on GitHub Pages or any static host, all content is technically public and can be accessed or bypassed by disabling JavaScript or inspecting the site files. Do not use for confidential information.

---

Modern apps. Smarter AI. Cloud ready.

A static, markdown-driven blog for GitHub Pages with automated post generation, demo client-side auth, and admin prompt editing.

## Features
- Three main categories: Application Modernization, Artificial Intelligence, Cloud Migration
- Responsive HTML/JS/Bootstrap site (no build step required)
- Demo sign-up/login (client-side, localStorage, not production secure)
- About page, left navigation, top banner, right user panel
- Automated weekly post generation (via GitHub Actions)
- Posts stored as markdown in `_posts/` (Jekyll compatible)
- Admin page to edit prompts and trigger post generation
- Social share links, Open Graph meta, canonical URLs

## File/Folder Layout
```
site/                # Static HTML/JS/CSS for the site
_layouts/            # Jekyll layouts (main, post)
_includes/           # Jekyll includes (header, nav, footer)
_posts/              # Markdown blog posts (auto-generated)
assets/              # CSS, JS, images
scripts/generate-post.js # Node.js script for post generation
prompts.yml          # Editable prompt templates
site-settings.json   # Site name, tagline, timezone, etc.
.github/workflows/   # GitHub Actions workflows
examples/            # Sample generated posts
Users.json           # Demo user database
```

## Setup Instructions
1. **Clone the repo**
2. **Edit `site-settings.json`** for your site name, tagline, timezone, etc.
3. **Edit `prompts.yml`** to customize post prompts for each category.
4. **Add users to `Users.json`** (for demo login)
5. **Run locally:**
   - Open `site/index.html` in your browser (no build needed)
   - Or use a static server: `npx serve site/`
6. **Generate posts locally:**
   - `node scripts/generate-post.js --category="Application Modernization" --prompt="..." --title="..."`
   - See `examples/` for sample output

## GitHub Actions
- **Automated post creation:** `.github/workflows/scheduled-post-creation.yml`
  - Runs on schedule (Fri/Sat/Sun UTC) and on manual dispatch
  - Uses `OPENAI_API_KEY` secret if present (optional)
  - Commits new post to `_posts/`
- **Deploy to GitHub Pages:** `.github/workflows/deploy-pages.yml`
  - Publishes site to GitHub Pages (see workflow for details)

## Secrets
- `OPENAI_API_KEY` (optional): For richer post generation via OpenAI
- `GH_PAGES_DEPLOY_TOKEN` (optional): For deployment if needed

## Timezone/Cron
- All GitHub Actions schedules use UTC. Adjust cron as needed in workflow files.

## Security Note
- **Demo auth uses localStorage and is NOT production secure.**
- For production, replace with OAuth or a real backend.

## TODOs
- [ ] Set your site name/tagline in `site-settings.json`
- [ ] Add your OpenAI API key to repo secrets (optional)
- [ ] Edit prompts in `prompts.yml`
- [ ] Add users to `Users.json`

---

MIT License
