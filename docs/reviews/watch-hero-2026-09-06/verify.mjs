import {chromium} from '/Users/sondre/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import crypto from 'node:crypto';

const output = 'docs/reviews/watch-hero-2026-09-06';
const asset = 'public/product/watch-hero-transparent.png';
const {data, info} = await sharp(asset).raw().toBuffer({resolveWithObject: true});
const alphaAt = (x, y) => data[(y * info.width + x) * info.channels + 3];
assert.equal(info.channels, 4);
assert.equal(alphaAt(0, 0), 0);
assert.equal(alphaAt(400, 700), 255);
const transparentPixels = data.filter((value, i) => i % 4 === 3 && value === 0).length;
await sharp(asset).flatten({background: '#101b25'}).resize({height: 800}).png().toFile(`${output}/alpha-on-dark.png`);
const browser = await chromium.launch({channel: 'chrome', headless: true});
const results = [];
const errors = [];
try {
  for (const [locale, width, height] of [['en',1440,1000], ['en',1100,1000], ['en',820,1180], ['en',390,844], ['en',320,800], ['ar',390,844]]) {
    const page = await browser.newPage({viewport:{width, height}, reducedMotion:'reduce'});
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://localhost:3210/${locale === 'en' ? '' : locale}`, {waitUntil: 'networkidle'});
    const decline = page.getByRole('button', {name: 'Decline', exact: true});
    if (await decline.isVisible()) await decline.click();
    // Fit the whole hero before capturing so Chromium paints rotated image layers
    // below the mobile fold, without reusing layers from a different viewport.
    const heroHeight = await page.locator('.editorial-hero').evaluate(hero => Math.ceil(hero.getBoundingClientRect().height));
    await page.setViewportSize({width, height:Math.max(height, heroHeight)});
    await page.locator('.hero-product img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.hero-home-phone').count(), 0);
    assert.equal(await page.locator('.hero-product img').count(), 2);
    assert.equal(await page.locator('.hero-watch .development-label').isVisible(), true);
    const metrics = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      watch: (() => {const r = document.querySelector('.hero-watch img').getBoundingClientRect(); return {left:r.left,right:r.right,width:r.width,height:r.height};})(),
      brokenImages: [...document.querySelectorAll('.hero-product img')].filter(image => !image.complete || !image.naturalWidth).map(image => image.src)
    }));
    assert.ok(metrics.scrollWidth <= width + 1, JSON.stringify(metrics));
    assert.ok(metrics.watch.left >= 0 && metrics.watch.right <= width + 1, JSON.stringify(metrics));
    assert.equal(metrics.brokenImages.length, 0);
    await page.locator('.editorial-hero').screenshot({path: `${output}/${locale}-${width}.png`});
    results.push({locale, viewportHeight:height, captureHeight:Math.max(height, heroHeight), ...metrics, pass:true});
    await page.close();
  }
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
  fs.writeFileSync(`${output}/verification.json`, JSON.stringify({date:new Date().toISOString(), asset:{width:info.width,height:info.height,channels:info.channels,transparentPixels,totalPixels:info.width*info.height,sha256:crypto.createHash('sha256').update(fs.readFileSync(asset)).digest('hex')}, results, errors}, null, 2) + '\n');
}
console.log(JSON.stringify({checks:results.length, errors, pass:true}));
