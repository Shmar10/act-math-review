import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const questionsDir = 'public/content/questions';
const files = readdirSync(questionsDir);

const realIssues = [];

files.forEach(file => {
  if (!file.endsWith('.json')) return;
  
  try {
    const content = readFileSync(join(questionsDir, file), 'utf8');
    const questions = JSON.parse(content);
    
    questions.forEach((q, qIndex) => {
      // Check stem
      if (q.stem) {
        // Check for missing spaces between words (lowercase followed by uppercase, but not in math)
        const stemParts = q.stem.split(/(\$[^$]+\$|\$\$[\s\S]+?\$\$)/g);
        stemParts.forEach((part, partIdx) => {
          if (!part.startsWith('$')) {
            // Not math, check for missing spaces
            if (/[a-z][A-Z]/.test(part)) {
              const matches = part.match(/([a-z])([A-Z])/g);
              realIssues.push({
                file,
                questionId: q.id,
                field: 'stem',
                issue: `Missing space: "${matches?.[0]}"`,
                text: part.substring(0, 100)
              });
            }
          }
        });
      }
      
      // Check choices
      q.choices?.forEach((choice, cIndex) => {
        if (choice.text) {
          const textParts = choice.text.split(/(\$[^$]+\$|\$\$[\s\S]+?\$\$)/g);
          textParts.forEach(part => {
            if (!part.startsWith('$') && /[a-z][A-Z]/.test(part)) {
              const matches = part.match(/([a-z])([A-Z])/g);
              realIssues.push({
                file,
                questionId: q.id,
                field: `choices[${cIndex}].text`,
                issue: `Missing space: "${matches?.[0]}"`,
                text: part.substring(0, 100)
              });
            }
          });
        }
        
        if (choice.rationale) {
          // Common patterns that indicate missing spaces
          const problematicPatterns = [
            /Addednumerators?/i,
            /Subtractednumerators?/i,
            /Onlyadded/i,
            /forgottomultiply/i,
            /Forgottosquare/i,
            /doesn'tdivide/i,
            /doesn'twork/i,
            /Assumeddiscounts?cancelout/i,
            /[a-z][a-z][a-z][a-z][a-z][a-z][a-z][a-z][a-z]\(/g, // Long word before paren
          ];
          
          problematicPatterns.forEach(pattern => {
            if (pattern.test(choice.rationale)) {
              const match = choice.rationale.match(pattern);
              realIssues.push({
                file,
                questionId: q.id,
                field: `choices[${cIndex}].rationale`,
                issue: `Possible missing space pattern: "${match?.[0]}"`,
                text: choice.rationale
              });
            }
          });
        }
      });
    });
  } catch (e) {
    console.error(`Error processing ${file}:`, e.message);
  }
});

// Write report
const report = {
  totalIssues: realIssues.length,
  issuesByFile: {},
  allIssues: realIssues
};

realIssues.forEach(issue => {
  if (!report.issuesByFile[issue.file]) {
    report.issuesByFile[issue.file] = [];
  }
  report.issuesByFile[issue.file].push(issue);
});

console.log(`\n=== FORMATTING ISSUES REPORT ===\n`);
console.log(`Total issues found: ${realIssues.length}\n`);

Object.keys(report.issuesByFile).sort().forEach(file => {
  console.log(`\n📄 ${file}:`);
  report.issuesByFile[file].forEach((issue, idx) => {
    console.log(`  ${idx + 1}. ${issue.questionId} - ${issue.field}`);
    console.log(`     Issue: ${issue.issue}`);
    console.log(`     Sample: ${issue.text.substring(0, 80)}...`);
  });
});

writeFileSync('formatting-issues-report.json', JSON.stringify(report, null, 2));
console.log('\n\n✅ Full report saved to: formatting-issues-report.json\n');

