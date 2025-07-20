const { chromium } = require('playwright');

const seeds = Array.from({ length: 10 }, (_, i) => 32 + i);

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    let grandTotal = 0;

    for (const seed of seeds) {
        const url = `https://internal-web-qa.datadash.in/sum-tables/seed-${seed}`;
        await page.goto(url);

        const numbers = await page.$$eval('table', tables => {
            return tables.flatMap(table =>
                Array.from(table.querySelectorAll('td'))
                    .map(td => parseFloat(td.textContent.trim()))
                    .filter(num => !isNaN(num))
            );
        });

        const seedSum = numbers.reduce((a, b) => a + b, 0);
        console.log(`Seed ${seed}: ${seedSum}`);
        grandTotal += seedSum;
    }

    console.log(`Grand Total: ${grandTotal}`);
    await browser.close();
})();
