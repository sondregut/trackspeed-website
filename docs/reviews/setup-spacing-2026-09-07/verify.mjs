import {chromium} from '/Users/sondre/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const output='docs/reviews/setup-spacing-2026-09-07';
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[],errors=[];
try {
 for (const [locale,width] of [['en',1440],['en',1024],['en',820],['en',390],['en',320],['ar',390],['ar',1440],['de',1440]]) {
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  await page.addInitScript(()=>localStorage.setItem('cookie-consent','declined'));
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://localhost:3210/${locale==='en'?'':locale}`,{waitUntil:'load'});
  await page.locator('#how-it-works').scrollIntoViewIfNeeded();
  await page.evaluate(()=>document.fonts.ready);
  for(const mode of ['gates','solo']) {
   await page.locator(`#mode-tab-${mode}`).click();
   await page.locator(`#mode-tab-${mode}[aria-selected="true"]`).waitFor();
   for(const img of await page.locator('#how-it-works img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}
   const metrics=await page.evaluate(()=>{
    const rect=selector=>{const r=document.querySelector(selector).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom};};
    return {section:rect('#how-it-works'),tabs:rect('.setup-tabs'),copy:rect('.setup-copy'),art:rect('.setup-art'),scrollWidth:document.documentElement.scrollWidth,images:[...document.querySelectorAll('#how-it-works img')].map(img=>({naturalWidth:img.naturalWidth,width:img.getBoundingClientRect().width})),stepCount:document.querySelectorAll('.setup-steps li').length,overflow:[...document.querySelectorAll('#how-it-works *')].filter(e=>e.scrollWidth>e.clientWidth+1&&getComputedStyle(e).display!=='inline'&&e.clientWidth>0).map(e=>e.className)};
   });
   const tabToCopyGap=metrics.copy.y-metrics.tabs.bottom;
   assert.ok(tabToCopyGap<=29,`${locale} ${width}: tab gap ${tabToCopyGap}`);
   assert.ok(metrics.scrollWidth<=width+1,`${locale} ${width}: page overflow`);
   assert.deepEqual(metrics.overflow,[],`${locale} ${width}: section overflow`);
   assert.equal(metrics.stepCount,3);
   assert.equal(metrics.images.length,mode==='gates'?2:1);
   assert.ok(metrics.images.every(i=>i.naturalWidth>0));
   assert.equal(await page.locator('#mode-panel').getAttribute('aria-labelledby'),`mode-tab-${mode}`);
   await page.locator('#how-it-works').screenshot({path:`${output}/${locale}-${width}-${mode}.png`,style:'header {visibility:hidden!important}'});
   results.push({locale,width,mode,...metrics,tabToCopyGap,pass:true});
  }
  await page.locator('#mode-tab-solo').focus();
  await page.keyboard.press('Home');
  await page.locator('#mode-tab-gates[aria-selected="true"]').waitFor();
  assert.equal(await page.locator('#mode-tab-gates').getAttribute('aria-selected'),'true');
  await page.keyboard.press(locale==='ar'?'ArrowLeft':'ArrowRight');
  await page.locator('#mode-tab-solo[aria-selected="true"]').waitFor();
  assert.equal(await page.locator('#mode-tab-solo').getAttribute('aria-selected'),'true');
  await page.close();
 }
 assert.deepEqual(errors,[]);
 const baseline=JSON.parse(fs.readFileSync(`${output}/baseline.json`,'utf8'));
 const after=results.find(r=>r.locale==='en'&&r.width===1440&&r.mode==='gates');
 const comparison={beforeHeight:baseline.section.height,afterHeight:after.section.height,heightReductionPercent:(1-after.section.height/baseline.section.height)*100,beforeTabGap:baseline.copy.y-baseline.tabs.bottom,afterTabGap:after.tabToCopyGap};
 assert.ok(comparison.heightReductionPercent>=25);
 fs.writeFileSync(`${output}/comparison.json`,JSON.stringify(comparison,null,2)+'\n');
 console.log(JSON.stringify({checks:results.length,comparison,errors,pass:true}));
} finally {await browser.close();fs.writeFileSync(`${output}/verification.json`,JSON.stringify({date:new Date().toISOString(),results,errors},null,2)+'\n');}
