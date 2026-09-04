#!/usr/bin/env node
/**
 * Recalculates coverage across all test-cases/<module>/<page>.md files:
 *  - Rewrites each "Section coverage" line under every "### Section:" heading.
 *  - Rewrites each page's "## Page Summary" table.
 *  - Rewrites the master test-coverage.md rollup across all modules and its
 *    synchronized copy in test-requirements/test-coverage.md.
 *
 * Skills must only add/flip rows in test-cases/**\/*.md — this script does all arithmetic.
 * Status values: Automated, Not Automated, Blocked, Skipped.
 *   - Automated -> counts as automated.
 *   - Not Automated / Blocked -> counts as not automated.
 *   - Skipped -> excluded entirely from the denominator.
 *
 * Usage: node scripts/update-coverage.js
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TEST_CASES_DIR = path.join(ROOT, 'test-cases');
const MASTER_FILE = path.join(ROOT, 'test-coverage.md');
const REQUIREMENTS_COVERAGE_FILE = path.join(
  ROOT,
  'test-requirements',
  'test-coverage.md'
);

const STATUS = {
  AUTOMATED: 'Automated',
  NOT_AUTOMATED: 'Not Automated',
  BLOCKED: 'Blocked',
  SKIPPED: 'Skipped',
};

function pct(automated, total) {
  if (total === 0) return '0%';
  return `${((automated / total) * 100).toFixed(1).replace(/\.0$/, '')}%`;
}

function parseTableRows(block) {
  // Parses a markdown table body (excluding header/separator) with columns: ID | Test Case | Status | Spec Ref
  const lines = block.split('\n').filter((l) => l.trim().startsWith('|'));
  const rows = [];
  for (const line of lines) {
    const cells = line.split('|').map((c) => c.trim()).filter((c, i, arr) => !(i === 0 || i === arr.length - 1) || c !== '');
    // Remove leading/trailing empty cells from split on '|'
    const trimmed = line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
    if (trimmed.length < 3) continue;
    if (trimmed[0].match(/^-+$/)) continue; // separator row
    if (trimmed[0].toLowerCase() === 'id') continue; // header row
    rows.push({ id: trimmed[0], status: trimmed[2] });
  }
  return rows;
}

function countStatuses(rows) {
  let automated = 0;
  let notAutomated = 0;
  let total = 0;
  for (const row of rows) {
    if (row.status === STATUS.SKIPPED) continue;
    total += 1;
    if (row.status === STATUS.AUTOMATED) automated += 1;
    else notAutomated += 1;
  }
  return { total, automated, notAutomated };
}

function processPageFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Split into sections by "### Section:" headings, tracking page-wide totals.
  const sectionRegex = /### Section: .+\n[\s\S]*?(?=\n###|\n## |$)/g;
  let pageTotal = 0;
  let pageAutomated = 0;
  let pageNotAutomated = 0;

  content = content.replace(sectionRegex, (sectionBlock) => {
    const rows = parseTableRows(sectionBlock);
    const { total, automated, notAutomated } = countStatuses(rows);
    pageTotal += total;
    pageAutomated += automated;
    pageNotAutomated += notAutomated;

    const coverageLine = `**Section coverage:** ${automated}/${total} (${pct(automated, total)})`;
    if (/\*\*Section coverage:\*\*.*/.test(sectionBlock)) {
      return sectionBlock.replace(/\*\*Section coverage:\*\*.*/, coverageLine);
    }
    return `${sectionBlock.trimEnd()}\n\n${coverageLine}\n`;
  });

  // Rewrite the Page Summary table
  const summaryTableRegex = /(## Page Summary\s*\n\|[^\n]*\|\s*\n\|[-\s|]*\|\s*\n\|[^\n]*\|)/;
  const newSummaryRow = `| Total | Automated | Not Automated | Coverage % |\n|-------|-----------|----------------|------------|\n| ${pageTotal} | ${pageAutomated} | ${pageNotAutomated} | ${pct(pageAutomated, pageTotal)} |`;

  if (summaryTableRegex.test(content)) {
    content = content.replace(summaryTableRegex, `## Page Summary\n${newSummaryRow}`);
  } else if (/## Page Summary/.test(content)) {
    content = content.replace(/## Page Summary[\s\S]*$/, `## Page Summary\n${newSummaryRow}\n`);
  } else {
    content = `${content.trimEnd()}\n\n## Page Summary\n${newSummaryRow}\n`;
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  return { total: pageTotal, automated: pageAutomated, notAutomated: pageNotAutomated };
}

function main() {
  if (!fs.existsSync(TEST_CASES_DIR)) {
    console.error(`No test-cases directory found at ${TEST_CASES_DIR}`);
    process.exit(1);
  }

  const modules = fs
    .readdirSync(TEST_CASES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const moduleTotals = [];
  let overallTotal = 0;
  let overallAutomated = 0;
  let overallNotAutomated = 0;

  for (const moduleName of modules) {
    const moduleDir = path.join(TEST_CASES_DIR, moduleName);
    const pageFiles = fs
      .readdirSync(moduleDir)
      .filter((f) => f.endsWith('.md'))
      .sort();

    let modTotal = 0;
    let modAutomated = 0;
    let modNotAutomated = 0;

    for (const pageFile of pageFiles) {
      const result = processPageFile(path.join(moduleDir, pageFile));
      modTotal += result.total;
      modAutomated += result.automated;
      modNotAutomated += result.notAutomated;
    }

    moduleTotals.push({
      name: moduleName,
      total: modTotal,
      automated: modAutomated,
      notAutomated: modNotAutomated,
    });

    overallTotal += modTotal;
    overallAutomated += modAutomated;
    overallNotAutomated += modNotAutomated;
  }

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const rows = moduleTotals
    .map(
      (m) =>
        `| ${capitalize(m.name)} | ${m.total} | ${m.automated} | ${m.notAutomated} | ${pct(m.automated, m.total)} |`
    )
    .join('\n');

  const overallRow = `| **Overall** | ${overallTotal} | ${overallAutomated} | ${overallNotAutomated} | ${pct(overallAutomated, overallTotal)} |`;

  const masterContent = `# Test Coverage — Master Rollup

> Auto-generated by \`scripts/update-coverage.js\`. Do not hand-edit — run the script instead.
> Last updated: ${new Date().toISOString()}

| Module | Total | Automated | Not Automated | Coverage % |
|--------|-------|-----------|----------------|------------|
${rows}
${overallRow}
`;

  fs.writeFileSync(MASTER_FILE, masterContent, 'utf-8');
  fs.writeFileSync(REQUIREMENTS_COVERAGE_FILE, masterContent, 'utf-8');

  console.log('Coverage updated:');
  for (const m of moduleTotals) {
    console.log(`  ${m.name}: ${m.automated}/${m.total} (${pct(m.automated, m.total)})`);
  }
  console.log(`  OVERALL: ${overallAutomated}/${overallTotal} (${pct(overallAutomated, overallTotal)})`);
}

main();
