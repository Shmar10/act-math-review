# Question Creation Guide

This guide helps you create properly formatted questions and avoid common LaTeX and formatting errors.

## Quick Checklist

- [ ] All text has proper spaces between words
- [ ] Literal dollar signs use `\$` (escaped)
- [ ] Math expressions are wrapped in `$...$` for inline or `$$...$$` for block
- [ ] No spaces between words like "Onlyadded" or "Addednumerators"
- [ ] Rationales have spaces around punctuation and math expressions
- [ ] Test the question in the app to verify rendering

## Common Mistakes to Avoid

### ❌ Missing Spaces

**Wrong:**
```json
"rationale": "Onlyadded3 + 5, forgottomultiplyby2."
```

**Correct:**
```json
"rationale": "Only added 3 + 5, forgot to multiply by 2."
```

### ❌ Literal Dollar Signs Without Escaping

**Wrong:**
```json
"stem": "A shirt costs $40. What is the sale price?"
"text": "$30"
```

**Correct:**
```json
"stem": "A shirt costs \\$40. What is the sale price?"
"text": "\\$30"
```

### ❌ Missing Spaces Around Math

**Wrong:**
```json
"rationale": "Discount is 10$so price is 30$."
```

**Correct:**
```json
"rationale": "Discount is $10$, so price is $30$."
```

## Formatting Rules

### 1. Text Formatting

- Always include spaces between words
- Use spaces around punctuation: `, ` not `,`
- Use spaces around math expressions in text: `The answer is $x = 5$.` not `The answer is$x=5$.`

### 2. Dollar Signs

- **Literal dollar signs** (money): Use `\\$` → renders as `$`
- **Math delimiters**: Use `$...$` for inline math, `$$...$$` for block math

**Examples:**
```json
{
  "stem": "A shirt costs \\$40. It is on sale for 25% off. What is the sale price?",
  "choices": [
    { "text": "\\$30", "rationale": "Correct: Discount $= 0.25 \\times 40 = 10$, so sale price $= 40 - 10 = 30$." },
    { "text": "\\$25", "rationale": "Calculated 25% but forgot to subtract from original." }
  ]
}
```

### 3. Math Expressions

**Inline Math** (use `$...$`):
- Simple expressions: `$x + 5 = 10$`
- Fractions: `$\\frac{3}{4}$`
- Equations in text: `If $x = 3$, then $x^2 = 9$.`

**Block Math** (use `$$...$$`):
- Complex expressions that should be on their own line
- Multi-line equations

**Examples:**
```json
{
  "stem": "Solve: $$x^2 - 5x + 6 = 0$$",
  "choices": [
    { "text": "$x = 2$ or $x = 3$", "rationale": "Correct: Factors to $(x-2)(x-3) = 0$, so $x = 2$ or $x = 3$." }
  ]
}
```

### 4. Rationales

- Always include proper spacing
- Separate sentences with spaces
- Include spaces before parentheses: `(incorrect).` not `(incorrect).`

**Good Examples:**
```json
"rationale": "Added numerators and denominators separately (incorrect)."
"rationale": "Only added 3 + 5, forgot to multiply by 2."
"rationale": "24 doesn't divide 36 or 48 evenly... wait, 48/24 = 2, but 36/24 = 1.5. So 24 doesn't work."
```

## Complete Example

```json
{
  "id": "ALG-QUA-0001",
  "topic": "Algebra",
  "subtopic": "Solving Quadratics",
  "diff": 1,
  "stem": "Solve by factoring: $$x^2 - 5x + 6 = 0$$",
  "choices": [
    {
      "text": "$x = 2$ or $x = 3$",
      "rationale": "Correct: Factors to $(x-2)(x-3) = 0$, so $x = 2$ or $x = 3$."
    },
    {
      "text": "$x = -2$ or $x = -3$",
      "rationale": "Sign error on both solutions."
    },
    {
      "text": "$x = 5$ or $x = 6$",
      "rationale": "Used coefficients as solutions."
    },
    {
      "text": "$x = 1$ or $x = 6$",
      "rationale": "Incorrect factoring."
    },
    {
      "text": "$x = -1$ or $x = -6$",
      "rationale": "Multiple errors in factoring."
    }
  ],
  "answerIndex": 0,
  "solutionSteps": [
    "Factor: $x^2 - 5x + 6 = (x-2)(x-3) = 0$.",
    "Set each factor to zero: $x - 2 = 0$ or $x - 3 = 0$.",
    "Solutions: $x = 2$ or $x = 3$."
  ]
}
```

## Validation Before Adding

Before adding a new question:

1. **Check spacing**: Read through all text fields and verify spaces between words
2. **Check dollar signs**: Ensure literal `$` are escaped as `\\$`
3. **Check math**: Verify math expressions are properly wrapped in `$...$` or `$$...$$`
4. **Test in app**: Load the question in the admin review page to verify rendering
5. **Check rationales**: Ensure all explanations have proper spacing and punctuation

## Tools

- Use the Admin Review page (`?admin=true`) to preview questions
- Check the browser console for any LaTeX rendering errors
- Use a JSON validator to ensure proper JSON syntax

