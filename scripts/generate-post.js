#!/usr/bin/env node
/**
 * generate-post.js
 *
 * Usage:
 *   node scripts/generate-post.js --category="Application Modernization" --prompt="..." --title="..." [--use-openai]
 *
 * If --use-openai and OPENAI_API_KEY is set, uses OpenAI API. Otherwise, uses deterministic template.
 *
 * Output: Writes markdown file to _posts/YYYY-MM-DD-slug.md
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const args = process.argv.slice(2);
const arg = (name) => {
  const found = args.find(a => a.startsWith(`--${name}=`));
  return found ? found.split('=')[1] : null;
};

const category = arg('category');
const prompt = arg('prompt');
const title = arg('title') || `${category} Insights`;
const useOpenAI = args.includes('--use-openai');
const today = new Date().toISOString().slice(0,10);
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const filename = `${today}-${slug}.md`;
const outPath = path.join(__dirname, '..', '_posts', filename);
const author = 'SimplifiTech Team';

function yamlFrontMatter(meta) {
  return '---\n' + Object.entries(meta).map(([k,v]) => `${k}: ${v}`).join('\n') + '\n---\n';
}

function deterministicContent(prompt, title, category) {
  return `## TL;DR\n${prompt} (summary)\n\n## Background\n${prompt} (background)\n\n## 3 Practical Tips\n1. Tip one for ${category}.\n2. Tip two for ${category}.\n3. Tip three for ${category}.\n\n## Conclusion\n${prompt} (conclusion)\n\n## Suggested Next Steps\n- Next step 1\n- Next step 2\n- Next step 3\n`;
}

function callOpenAI(prompt, cb) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return cb(new Error('OPENAI_API_KEY not set'));
  const data = JSON.stringify({
    model: 'text-davinci-003',
    prompt,
    max_tokens: 800,
    temperature: 0.7
  });
  const req = https.request({
    hostname: 'api.openai.com',
    path: '/v1/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  }, res => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(body);
        cb(null, json.choices[0].text.trim());
      } catch (e) {
        cb(e);
      }
    });
  });
  req.on('error', cb);
  req.write(data);
  req.end();
}

function main() {
  if (!category || !prompt) {
    console.error('Usage: --category=... --prompt=... [--title=...] [--use-openai]');
    process.exit(1);
  }
  const meta = {
    title: `"${title}"`,
    date: today,
    category,
    tags: `[${category.toLowerCase().replace(/ /g, ', ')}]`,
    author,
    excerpt: `"${prompt.slice(0, 100)}..."`
  };
  if (useOpenAI && process.env.OPENAI_API_KEY) {
    callOpenAI(prompt, (err, content) => {
      if (err) {
        console.error('OpenAI error:', err);
        process.exit(1);
      }
      fs.writeFileSync(outPath, yamlFrontMatter(meta) + '\n' + content + '\n');
      console.log('Post created with OpenAI:', outPath);
    });
  } else {
    const content = deterministicContent(prompt, title, category);
    fs.writeFileSync(outPath, yamlFrontMatter(meta) + '\n' + content + '\n');
    console.log('Post created:', outPath);
  }
}

main();
