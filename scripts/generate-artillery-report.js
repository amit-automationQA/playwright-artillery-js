import fs from 'fs';
import path from 'path';

const [, , inputPathArg, outputPathArg] = process.argv;

if (!inputPathArg || !outputPathArg) {
  console.error('Usage: node scripts/generate-artillery-report.js <input-json> <output-html>');
  process.exit(1);
}

const inputPath = path.resolve(process.cwd(), inputPathArg);
const outputPath = path.resolve(process.cwd(), outputPathArg);

if (!fs.existsSync(inputPath)) {
  console.error(`Input JSON not found: ${inputPath}`);
  process.exit(1);
}

const json = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const aggregate = json.aggregate || {};
const counters = aggregate.counters || {};
const summaries = aggregate.summaries || {};

const formatMs = (value) => {
  if (typeof value === 'number') {
    return `${Math.round(value)} ms`;
  }
  return 'n/a';
};

const getMetric = (metricName, fallback = 'n/a') => {
  const metric = summaries[metricName];
  if (!metric) return fallback;
  return formatMs(metric.mean ?? metric.p95 ?? metric.p99 ?? metric.p50 ?? metric.median ?? metric.min ?? metric.max);
};

const getCounter = (key, fallback = '0') => {
  const value = counters[key];
  return value ?? fallback;
};

const rows = [
  ['VUsers created', getCounter('vusers.created')],
  ['VUsers completed', getCounter('vusers.completed')],
  ['VUsers failed', getCounter('vusers.failed')],
  ['HTTP requests', getCounter('browser.http_requests')],
  ['HTTP 200', getCounter('browser.page.codes.200')],
  ['HTTP 302', getCounter('browser.page.codes.302')],
  ['HTTP 304', getCounter('browser.page.codes.304')],
  ['Auth login TTFB', getMetric('browser.page.TTFB.https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')],
  ['Dashboard FCP', getMetric('browser.page.FCP.https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index')],
  ['Dashboard LCP', getMetric('browser.page.LCP.https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index')],
  ['PIM FCP', getMetric('browser.page.FCP.https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList')],
  ['PIM LCP', getMetric('browser.page.LCP.https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList')],
  ['Session length', getMetric('vusers.session_length')],
];

const summaryRows = rows
  .map(([label, value]) => `<tr><th>${label}</th><td>${value}</td></tr>`)
  .join('\n');

const reportHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Artillery Load Report</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f5f7fb;
        --card: #ffffff;
        --border: #dfe3ea;
        --text: #1f2937;
        --muted: #6b7280;
        --primary: #2563eb;
        --success: #15803d;
        --danger: #dc2626;
      }
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: var(--bg);
        color: var(--text);
      }
      .container {
        max-width: 1100px;
        margin: 32px auto;
        padding: 24px;
      }
      .card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(15, 23, 42, 0.04);
        padding: 24px;
      }
      h1 {
        margin: 0 0 8px;
        font-size: 2rem;
      }
      .subhead {
        margin: 0 0 24px;
        color: var(--muted);
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 12px;
      }
      th, td {
        border: 1px solid var(--border);
        padding: 12px 14px;
        text-align: left;
      }
      th {
        background: #f8fafc;
        width: 60%;
      }
      .badge {
        display: inline-block;
        padding: 6px 10px;
        border-radius: 999px;
        font-size: 0.875rem;
        font-weight: 700;
      }
      .success {
        background: #dcfce7;
        color: var(--success);
      }
      .danger {
        background: #fee2e2;
        color: var(--danger);
      }
      .meta {
        color: var(--muted);
        margin-top: 16px;
        font-size: 0.95rem;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <h1>Artillery Load Report</h1>
        <p class="subhead">Generated from ${path.basename(inputPath)}</p>
        <div>
          <span class="badge ${Number(getCounter('vusers.failed')) === 0 ? 'success' : 'danger'}">
            ${Number(getCounter('vusers.failed')) === 0 ? 'PASS' : 'FAIL'}
          </span>
        </div>
        <table>
          <tbody>
            ${summaryRows}
          </tbody>
        </table>
        <p class="meta">Run timestamp: ${new Date().toISOString()}</p>
      </div>
    </div>
  </body>
</html>`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, reportHtml, 'utf8');
console.log(`Artillery HTML report generated at ${outputPath}`);
