import {chromium} from '/Users/sondre/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';

const output = 'docs/reviews/start-cards-2026-09-06';
const browser = await chromium.launch({channel: 'chrome', headless: true});
const results = [];
const errors = [];
try {
  for (const [locale, width] of [['en',1440], ['en',820], ['en',390], ['en',320], ['ar',390], ['de',1440]]) {
    const page = await browser.newPage({viewport:{width, height:1000}, reducedMotion:'reduce'});
    await page.addInitScript(() => localStorage.setItem('cookie-consent', 'declined'));
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://localhost:3210/${locale === 'en' ? '' : locale}`, {waitUntil:'domcontentloaded'});
    for (const picture of await page.locator('#start-types img').all()) {
      await picture.scrollIntoViewIfNeeded();
      await picture.evaluate(image => image.decode());
    }
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(() => ({
      sections: [...document.querySelectorAll('.marketing-home > section')].map(section => section.id || section.className),
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      art: [...document.querySelectorAll('#start-types img')].map(image => ({src:image.getAttribute('src'), naturalWidth:image.naturalWidth})),
      cards: [...document.querySelectorAll('.start-method-card')].map(card => ({width:card.getBoundingClientRect().width, scrollWidth:card.scrollWidth}))
    }));
    assert.equal(metrics.sections[1], 'preview');
    assert.equal(metrics.art.length, 5);
    assert.ok(metrics.art.every(image => image.naturalWidth > 0));
    assert.ok(metrics.scrollWidth <= width + 1);
    assert.ok(metrics.cards.every(card => card.scrollWidth <= card.width + 1));
    // Hide only fixed navigation while capturing this long section, so it does
    // not float across the middle of the clipped element screenshot.
    await page.locator('#start-types').screenshot({path:`${output}/website-${locale}-${width}.png`, style:'header { visibility: hidden !important; }'});
    results.push({locale, ...metrics, pass:true});
    await page.close();
  }
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
  fs.writeFileSync(`${output}/verification.json`, JSON.stringify({date:new Date().toISOString(), results, errors}, null, 2) + '\n');
}
console.log(JSON.stringify({checks:results.length, errors, pass:true}));
