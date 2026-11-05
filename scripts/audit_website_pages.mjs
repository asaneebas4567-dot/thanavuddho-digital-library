import fs from 'fs';

const testRoutes = [
  '/',
  '/books',
  '/books/book_อย่ามโน',
  '/books/book_tam_jai_hai_prom_buak',
  '/books/b_xith',
  '/reader/book_อย่ามโน',
  '/reader/book_tam_jai_hai_prom_buak',
  '/reader/pubhtml5_76550937',
  '/articles',
  '/articles/dhamma_037',
  '/videos',
  '/videos?id=vid-01',
  '/audios',
  '/quiz',
  '/categories',
  '/categories/cat_001',
  '/search?q=ธรรมะ',
  '/chatbot',
  '/dashboard',
  '/loans',
  '/login',
  '/pdf-books',
  '/admin',
  '/admin/import-pdf',
  '/admin/quests',
  '/admin/videos',
  '/api/admin/videos',
  '/api/youtube/views',
  '/api/books/reads'
];

async function audit() {
  console.log('=== STARTING COMPREHENSIVE ROUTE AUDIT ===\n');
  const results = [];

  for (const route of testRoutes) {
    const encodedRoute = encodeURI(route);
    const url = `http://localhost:3000${encodedRoute}`;
    const startTime = Date.now();
    try {
      const res = await fetch(url);
      const elapsed = Date.now() - startTime;
      const text = await res.text();
      
      const hasError = text.includes('Runtime Error') || 
                       text.includes('Unhandled Runtime Error') || 
                       text.includes('Internal Server Error') ||
                       text.includes('ChunkLoadError') ||
                       res.status >= 400;

      results.push({
        route,
        status: res.status,
        elapsed: `${elapsed}ms`,
        ok: res.ok && !hasError,
        hasErrorSnippet: hasError ? text.substring(0, 300).replace(/\s+/g, ' ') : null,
        contentLength: text.length
      });

      const icon = (res.ok && !hasError) ? '✅' : '❌';
      console.log(`${icon} [${res.status}] ${route} (${elapsed}ms, ${text.length} bytes)`);
      if (hasError) {
        console.log(`   ⚠️ Error detected: HTTP ${res.status}`);
      }
    } catch (err) {
      console.log(`❌ [FAILED] ${route} -> ${err.message}`);
      results.push({
        route,
        status: 0,
        ok: false,
        error: err.message
      });
    }
  }

  const failed = results.filter(r => !r.ok);
  console.log(`\n=== AUDIT SUMMARY: Total: ${results.length}, Passed: ${results.length - failed.length}, Failed/Warning: ${failed.length} ===`);
  if (failed.length > 0) {
    console.log('\nIssues found:');
    failed.forEach(f => console.log(`- ${f.route}: Status ${f.status} ${f.hasErrorSnippet || f.error || ''}`));
  }

  fs.writeFileSync('scripts/audit_results.json', JSON.stringify(results, null, 2), 'utf8');
}

audit().catch(console.error);

