/**
 * Validation script for ACT Math questions
 * Checks for common formatting errors before adding questions to JSON files
 * 
 * Usage: node scripts/validate-question.js <question-json-string>
 * Or: node scripts/validate-question.js (then paste JSON when prompted)
 */

export function validateQuestion(question) {
  const errors = [];
  const warnings = [];

  // Helper to check for missing spaces
  function checkSpacing(text, fieldName) {
    if (!text) return;
    
    // Check for lowercase followed by uppercase (missing space)
    if (/[a-z][A-Z]/.test(text)) {
      const matches = text.match(/([a-z])([A-Z])/g);
      errors.push(`${fieldName}: Missing space - found "${matches?.[0]}" (should have space between words)`);
    }
  }

  // Check stem
  if (question.stem) {
    checkSpacing(question.stem, "stem");
  }

  // Check choices
  if (question.choices && Array.isArray(question.choices)) {
    question.choices.forEach((choice, index) => {
      if (choice.text) {
        checkSpacing(choice.text, `choices[${index}].text`);
      }
      
      if (choice.rationale) {
        checkSpacing(choice.rationale, `choices[${index}].rationale`);
        
        // Common patterns that indicate missing spaces
        const commonErrors = [
          { pattern: /Addednumerators?/i, fix: "Added numerators" },
          { pattern: /Subtractednumerators?/i, fix: "Subtracted numerators" },
          { pattern: /Onlyadded/i, fix: "Only added" },
          { pattern: /forgottomultiply/i, fix: "forgot to multiply" },
          { pattern: /doesn'tdivide/i, fix: "doesn't divide" },
          { pattern: /doesn'twork/i, fix: "doesn't work" },
          { pattern: /Assumeddiscounts?cancelout/i, fix: "Assumed discount(s) cancel out" },
        ];
        
        commonErrors.forEach(({ pattern }) => {
          if (pattern.test(choice.rationale)) {
            errors.push(`choices[${index}].rationale: Found common error pattern - check spacing around "${pattern.source}"`);
          }
        });
      }
    });
  }

  // Check solutionSteps
  if (question.solutionSteps && Array.isArray(question.solutionSteps)) {
    question.solutionSteps.forEach((step, index) => {
      checkSpacing(step, `solutionSteps[${index}]`);
    });
  }

  // Required fields
  const requiredFields = ['id', 'topic', 'subtopic', 'diff', 'stem', 'choices', 'answerIndex'];
  requiredFields.forEach(field => {
    if (!question[field] && question[field] !== 0) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate answerIndex
  if (question.answerIndex !== undefined && question.choices) {
    if (question.answerIndex < 0 || question.answerIndex >= question.choices.length) {
      errors.push(`answerIndex (${question.answerIndex}) is out of range (should be 0-${question.choices.length - 1})`);
    }
  }

  // Validate diff
  if (question.diff !== undefined && (question.diff < 1 || question.diff > 5)) {
    errors.push(`diff should be between 1 and 5, got ${question.diff}`);
  }

  return { errors, warnings };
}

// Simple CLI when run directly
if (import.meta.url.includes('validate-question.js')) {
  const input = process.argv[2] || process.stdin.read()?.toString();
  
  if (!input) {
    console.log('Usage: node scripts/validate-question.js \'{"id":"TEST",...}\'');
    console.log('Or pipe JSON: echo \'{"id":"TEST",...}\' | node scripts/validate-question.js');
    process.exit(1);
  }

  try {
    const question = JSON.parse(input);
    const result = validateQuestion(question);
    
    console.log('\n=== Validation Results ===\n');
    
    if (result.errors.length === 0 && result.warnings.length === 0) {
      console.log('✅ Question is valid!\n');
    } else {
      if (result.errors.length > 0) {
        console.log('❌ ERRORS:\n');
        result.errors.forEach(err => console.log(`  - ${err}`));
        console.log('');
      }
      if (result.warnings.length > 0) {
        console.log('⚠️  WARNINGS:\n');
        result.warnings.forEach(warn => console.log(`  - ${warn}`));
        console.log('');
      }
    }
  } catch (e) {
    console.error('Error parsing JSON:', e.message);
    process.exit(1);
  }
}
