const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });  // ✅ HEADLESS = No screen needed
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
    
    try {
      await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 60000 
      });
      
      await page.waitForTimeout(5000);  // Wait for JS tables
      
      const numbers = await page.evaluate(() => {
        const nums = [];
        document.querySelectorAll('table td, table th').forEach(cell => {
          const text = cell.innerText.trim();
          const num = parseFloat(text.replace(/[^\d.-]/g, ''));
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
