const { chromium } = require('playwright');

const seeds = Array.from({ length: 41 - 32 + 1 }, (_, i) => 32 + i);
const urls = seeds.map(seed => `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`);

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    let grandTotal = 0;

    for (const url of urls) {
        await page.goto(url);
        console.log(`Processing ${url}...`);

        const sum = await page.$$eval('table', tables => {
            let pageTotal = 0;
            tables.forEach(table => {
                table.querySelectorAll('td').forEach(cell => {
                    const num = parseFloat(cell.textContent.replace(/[^0-9.\-]+/g, ''));
                    if (!isNaN(num)) pageTotal += num;
                });
            });
            return pageTotal;
        });

        console.log(`Sum at ${url}: ${sum}`);
        grandTotal += sum;
    }

    console.log(`Grand Total: ${grandTotal}`);

    await browser.close();
})();
