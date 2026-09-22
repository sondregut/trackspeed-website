import {chromium} from '/Users/sondre/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await page.addInitScript(()=>localStorage.setItem('cookie-consent','declined'));
 await page.goto('http://localhost:3210/',{waitUntil:'domcontentloaded'});
 await page.locator('#how-it-works').scrollIntoViewIfNeeded();
 for (const image of await page.locator('#how-it-works img').all()) { await image.scrollIntoViewIfNeeded(); await image.evaluate(image=>image.decode()); }
 await page.evaluate(()=>document.fonts.ready);
 const metrics=await page.evaluate(()=>{const rect=selector=>{const r=document.querySelector(selector).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom};};return {section:rect('#how-it-works'),tabs:rect('.setup-tabs'),copy:rect('.setup-copy'),art:rect('.setup-art')};});
 await page.locator('#how-it-works').screenshot({path:'docs/reviews/setup-spacing-2026-09-07/before-desktop.png',style:'header {visibility:hidden!important}'});
 fs.writeFileSync('docs/reviews/setup-spacing-2026-09-07/baseline.json',JSON.stringify(metrics,null,2)+'\n');
 console.log(JSON.stringify(metrics));
} finally { await browser.close(); }
