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
├── public/content/questions/   # Question JSON files
├── src/                        # React app source
├── scripts/                    # Utility scripts
│   ├── question-template.json  # Template for new questions
│   └── validate-question.js   # Validation script
└── docs/                       # Documentation
    ├── QUESTION_CREATION_GUIDE.md
    └── VALIDATION_SCRIPT.md
```

## Adding Questions

**Before creating new questions, see the guides:**
- 📖 **Quick Reference**: `README_QUESTION_CREATION.md`
- 📚 **Full Guide**: `docs/QUESTION_CREATION_GUIDE.md`
- ✅ **Validation**: `docs/VALIDATION_SCRIPT.md`

Quick checklist:
1. Use `scripts/question-template.json` as a starting point
2. Validate with `npm run validate-question` (optional)
3. Test in Admin Review page (`?admin=true`)
4. Add to appropriate JSON file in `public/content/questions/`

## Notes

- Everything is client-side (no backend).
- You can add more fields to problem objects: `tags`, `source`, `time_limit`, etc.
- Consider versioning your problem bank and using branches for review sets.

---

© 2025 ACT Math Review
