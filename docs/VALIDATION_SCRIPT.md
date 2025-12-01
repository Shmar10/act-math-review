# Question Validation Script

The validation script helps catch common formatting errors before adding questions to JSON files.

## Usage

### Method 1: Command Line (JSON String)

```bash
node scripts/validate-question.js '{"id":"TEST-001","topic":"Algebra","stem":"Test question","choices":[...]}'
```

### Method 2: Interactive Mode

```bash
node scripts/validate-question.js
```

Then paste your question JSON and press `Ctrl+D` (Mac/Linux) or `Ctrl+Z` (Windows).

### Method 3: Use in Node Script

```javascript
const { validateQuestion } = require('./scripts/validate-question.js');

const question = {
  "id": "TEST-001",
  "topic": "Algebra",
  // ... rest of question
};

const { errors, warnings } = validateQuestion(question);

if (errors.length > 0) {
  console.error('Validation errors:', errors);
}
if (warnings.length > 0) {
  console.warn('Validation warnings:', warnings);
}
```

## What It Checks

### Errors (Must Fix)
- Missing spaces between words (e.g., "Onlyadded" → "Only added")
- Missing required fields
- Invalid answerIndex
- Invalid difficulty (must be 1-5)
- Common error patterns in rationales

### Warnings (Review)
- Possible missing spaces around numbers
- Unescaped dollar signs that might need attention
- Patterns that look suspicious

## Example Output

```
=== Validation Results ===

❌ ERRORS:
  - choices[1].rationale: Found common error pattern - check spacing around "Onlyadded"
  - choices[2].rationale: Missing space - found "Addednumerators" (should have space between words)

⚠️  WARNINGS:
  - stem: Found literal dollar sign - ensure it's escaped as \$ if it's money, or wrapped in $...$ if it's math
```

## Integration with Workflow

1. Create question using `scripts/question-template.json` as reference
2. Run validation script
3. Fix any errors/warnings
4. Test in admin review page (`?admin=true`)
5. Add to appropriate JSON file

