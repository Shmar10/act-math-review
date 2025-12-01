# Quick Reference: Creating Questions

## Before Creating a New Question

1. **Use the template**: Copy from `scripts/question-template.json`
2. **Validate before adding**: Run `npm run validate-question` with your question JSON
3. **Test in app**: View in Admin Review page (`?admin=true`)
4. **Follow the guide**: See `docs/QUESTION_CREATION_GUIDE.md` for detailed rules

## Most Common Mistakes

### ❌ Missing Spaces
```json
"rationale": "Onlyadded3 + 5"  // WRONG
"rationale": "Only added 3 + 5"  // CORRECT
```

### ❌ Unescaped Dollar Signs  
```json
"stem": "Costs $40"  // WRONG
"stem": "Costs \\$40"  // CORRECT (for money)
```

### ❌ Missing Spaces Around Math
```json
"rationale": "Answer is$x=5$"  // WRONG
"rationale": "Answer is $x = 5$"  // CORRECT
```

## Quick Validation

```bash
npm run validate-question '{"id":"TEST","topic":"Algebra","stem":"...","choices":[...]}'
```

## Full Documentation

- **Detailed Guide**: `docs/QUESTION_CREATION_GUIDE.md`
- **Validation Script**: `docs/VALIDATION_SCRIPT.md`
- **Template**: `scripts/question-template.json`

