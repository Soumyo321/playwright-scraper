const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,  // See browser open locally for debugging
    slowMo: 1000      // Slow down actions to watch
  });
  let grandTotal = 0;

  const urls = [
    'https://sanand0.github.io/tdsdata/js_table/?seed=62',
    'https://sanand0.github.io/tdsdata/js_table/?seed=63',
    'https://sanand0.github.io/tdsdata/js_table/?seed=64',
    'https://sanand0.github.io/tdsdata/js_table/?seed=65',
    'https://sanand0.github.io/tdsdata/js_table/?seed=66',
    'https://sanand0.github.io/tdsdata/js_table/?seed=67',
    'https://sanand0.github.io/tdsdata/js_table/?seed=68',
    'https://sanand0.github.io/tdsdata/js_table/?seed=69',
    'https://sanand0.github.io/tdsdata/js_table/?seed=70',
    'https://sanand0.github.io/tdsdata/js_table/?seed=71'
  ];

  for (const url of urls) {
    console.log(`Visiting: ${url}`);
    const page = await browser.newPage();
    
    // Try multiple loading strategies
    try {
      await page.goto(url, { 
        waitUntil: 'domcontentloaded',  // Load faster
        timeout: 60000                   // 60 seconds patience
      });
      
      // Wait extra for JS tables to render
      await page.waitForTimeout(5000);
      
      // Find all table cells with numbers
      const numbers = await page.evaluate(() => {
        const nums = [];
        document.querySelectorAll('table td, table th').forEach(cell => {
          const text = cell.innerText.trim();
          const num = parseFloat(text.replace(/[^\d.-]/g, ''));  // Extract numbers
          if (!isNaN(num)) nums.push(num);
        });
        return nums;
      });

      const pageSum = numbers.reduce((a, b) => a + b, 0);
      grandTotal += pageSum;
      console.log(`✅ ${url}: Found ${numbers.length} numbers, sum = ${pageSum.toFixed(2)}`);
      
    } catch (error) {
      console.log(`❌ ${url} failed: ${error.message}`);
    }
    
    await page.close();
  }

  console.log(`🎉 GRAND TOTAL SUM OF ALL TABLES: ${grandTotal.toFixed(2)}`);
  await browser.close();
})();
