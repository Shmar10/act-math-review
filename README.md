# ACT Math Review

A lightweight static web app scaffold for practicing ACT Math problems.  
Designed to be hosted on **GitHub Pages**.

## Quick Start

1. Unzip this project into your GitHub Desktop repository folder.
2. Commit and push.
3. Enable GitHub Pages: Settings → Pages → Branch: `main` (root).
4. Visit your site URL.

## Structure

```
.
├── index.html
├── style.css
├── script.js
├── data/
│   └── problems.json
└── assets/
    ├── images/
    └── icons/
```

- Add/modify problems in `data/problems.json`.
- Extend UI and logic in `script.js`.
- Customize styling in `style.css`.

## Notes

- Everything is client-side (no backend).
- You can add more fields to problem objects: `tags`, `source`, `time_limit`, etc.
- Consider versioning your problem bank and using branches for review sets.

---

© 2025 ACT Math Review
