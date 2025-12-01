import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const questionsDir = 'public/content/questions';
const files = readdirSync(questionsDir);

const issues = [];

files.forEach(file => {
  if (!file.endsWith('.json')) return;
  
  try {
    const content = readFileSync(join(questionsDir, file), 'utf8');
    const questions = JSON.parse(content);
    
    questions.forEach((q, qIndex) => {
      // Check stem
      if (q.stem) {
        const stemIssues = checkText(q.stem, `stem`);
        if (stemIssues.length > 0) {
          issues.push({ file, questionId: q.id, field: 'stem', issues: stemIssues, text: q.stem });
        }
      }
      
      // Check choices
      q.choices?.forEach((choice, cIndex) => {
        if (choice.text) {
          const textIssues = checkText(choice.text, `choice[${cIndex}].text`);
          if (textIssues.length > 0) {
            issues.push({ file, questionId: q.id, field: `choices[${cIndex}].text`, issues: textIssues, text: choice.text });
          }
        }
        
        if (choice.rationale) {
          const rationaleIssues = checkText(choice.rationale, `choice[${cIndex}].rationale`);
          if (rationaleIssues.length > 0) {
            issues.push({ file, questionId: q.id, field: `choices[${cIndex}].rationale`, issues: rationaleIssues, text: choice.rationale });
          }
        }
      });
      
      // Check solutionSteps
      q.solutionSteps?.forEach((step, sIndex) => {
        const stepIssues = checkText(step, `solutionSteps[${sIndex}]`);
        if (stepIssues.length > 0) {
          issues.push({ file, questionId: q.id, field: `solutionSteps[${sIndex}]`, issues: stepIssues, text: step });
        }
      });
    });
  } catch (e) {
    console.error(`Error processing ${file}:`, e.message);
  }
});

function checkText(text, fieldName) {
  const foundIssues = [];
  
  // Pattern 1: lowercase followed by uppercase (missing space)
  const lowercaseUppercase = /([a-z])([A-Z])/g;
  let match;
  const lowercaseUppercaseMatches = [...text.matchAll(lowercaseUppercase)];
  lowercaseUppercaseMatches.forEach(match => {
    // Skip if it's inside math delimiters
    const beforeMatch = text.substring(0, match.index);
    const dollarCount = (beforeMatch.match(/\$/g) || []).length;
    if (dollarCount % 2 === 0) { // Not inside math
      foundIssues.push({
        type: 'missing_space_camelCase',
        position: match.index,
        found: match[0],
        suggestion: match[1] + ' ' + match[2]
      });
    }
  });
  
  // Pattern 2: word immediately before opening parenthesis (common error)
  const wordBeforeParen = /([a-zA-Z])(\()/g;
  const wordBeforeParenMatches = [...text.matchAll(wordBeforeParen)];
  wordBeforeParenMatches.forEach(match => {
    const beforeMatch = text.substring(0, match.index);
    const dollarCount = (beforeMatch.match(/\$/g) || []).length;
    if (dollarCount % 2 === 0) { // Not inside math
      foundIssues.push({
        type: 'missing_space_before_paren',
        position: match.index,
        found: match[0],
        suggestion: match[1] + ' ' + match[2]
      });
    }
  });
  
  // Pattern 3: number immediately before word or word before number (context-dependent)
  const numberWord = /([0-9])([a-zA-Z])|([a-zA-Z])([0-9])/g;
  const numberWordMatches = [...text.matchAll(numberWord)];
  numberWordMatches.forEach(match => {
    const beforeMatch = text.substring(0, match.index);
    const afterMatch = text.substring(match.index + match[0].length);
    const dollarCountBefore = (beforeMatch.match(/\$/g) || []).length;
    const dollarCountAfter = (afterMatch.match(/\$/g) || []).length;
    
    // Skip if it's part of math notation ($40, x^2, etc.)
    const before = match.index > 0 ? text[match.index - 1] : '';
    const after = match.index + match[0].length < text.length ? text[match.index + match[0].length] : '';
    
    if (dollarCountBefore % 2 === 0 && // Not inside math
        !['$', '\\', '^', '_', '{', '}', '(', ')', '.', ',', '!', '?', ':', ';', '-', '+', '=', '*', '/'].includes(before) &&
        !['$', '\\', '^', '_', '{', '}', '(', ')', '.', ',', '!', '?', ':', ';', '-', '+', '=', '*', '/'].includes(after)) {
      foundIssues.push({
        type: 'missing_space_number_word',
        position: match.index,
        found: match[0],
        suggestion: match[0].length === 2 ? match[0][0] + ' ' + match[0][1] : match[0]
      });
    }
  });
  
  // Pattern 4: Common error patterns
  const commonPatterns = [
    { pattern: /Addednumerators?/gi, suggestion: 'Added numerators' },
    { pattern: /Subtractednumerators?/gi, suggestion: 'Subtracted numerators' },
    { pattern: /Onlyadded/gi, suggestion: 'Only added' },
    { pattern: /forgottomultiply/gi, suggestion: 'forgot to multiply' },
    { pattern: /Forgottosquare/gi, suggestion: 'Forgot to square' },
    { pattern: /doesn'tdivide/gi, suggestion: "doesn't divide" },
    { pattern: /doesn'twork/gi, suggestion: "doesn't work" },
    { pattern: /Assumeddiscounts?cancelout/gi, suggestion: 'Assumed discount(s) cancel out' },
  ];
  
  commonPatterns.forEach(({ pattern, suggestion }) => {
    const matches = [...text.matchAll(pattern)];
    matches.forEach(match => {
      const beforeMatch = text.substring(0, match.index);
      const dollarCount = (beforeMatch.match(/\$/g) || []).length;
      if (dollarCount % 2 === 0) { // Not inside math
        foundIssues.push({
          type: 'common_error_pattern',
          position: match.index,
          found: match[0],
          suggestion: suggestion
        });
      }
    });
  });
  
  return foundIssues;
}

// Output results
if (issues.length === 0) {
  console.log('✅ No formatting issues found!');
} else {
  console.log(`\n⚠️  Found ${issues.length} formatting issue(s):\n`);
  issues.forEach((issue, i) => {
    console.log(`${i + 1}. ${issue.file} - ${issue.questionId}`);
    console.log(`   Field: ${issue.field}`);
    issue.issues.forEach((iss, j) => {
      console.log(`   Issue ${j + 1}: ${iss.type}`);
      console.log(`     Found: "${iss.found}" at position ${iss.position}`);
      console.log(`     Suggested: "${iss.suggestion}"`);
    });
    console.log(`   Full text: ${issue.text.substring(0, 150)}${issue.text.length > 150 ? '...' : ''}`);
    console.log('');
  });
}

