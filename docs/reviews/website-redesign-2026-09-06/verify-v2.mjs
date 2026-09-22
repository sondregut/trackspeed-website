import {chromium} from '/Users/sondre/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
(async () => {
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const results=[];const errors=[];
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://localhost:3211/',{waitUntil:'networkidle'});
  if (await page.getByRole('button',{name:'Decline',exact:true}).isVisible()) await page.getByRole('button',{name:'Decline',exact:true}).click();
  await page.locator('.hero-timing-phone').evaluate(img=>img.decode());
  await page.screenshot({path:'docs/reviews/website-redesign-2026-09-06/v2-desktop-hero.png'});
  for(const [selector,name] of [['#how-it-works','setup'],['#review','review'],['#preview','landscape'],['.watch-section','watch'],['#features','history']]) {
   await page.locator(selector).scrollIntoViewIfNeeded();
   await page.locator(selector+' img').evaluateAll(imgs=>Promise.all(imgs.filter(img=>img.getClientRects().length).map(img=>img.decode().catch(()=>{}))));
   await page.locator(selector).screenshot({path:'docs/reviews/website-redesign-2026-09-06/v2-desktop-'+name+'.png'});
  }
  await page.getByRole('tab',{name:'Connected gates',exact:true}).focus();
  await page.keyboard.press('ArrowRight');
  await page.getByRole('tab',{name:'Solo laps',exact:true}).waitFor();
  assert.equal(await page.getByRole('tab',{name:'Solo laps',exact:true}).getAttribute('aria-selected'),'true');
  assert.equal(await page.locator('#mode-panel h3').innerText(),'Just you. One phone.');
  await page.keyboard.press('Home');
  assert.equal(await page.getByRole('tab',{name:'Connected gates',exact:true}).getAttribute('aria-selected'),'true');
  for(const [label,src] of [['Football','football'],['Indoor','indoor'],['Track','blue-track']]) {
   await page.getByRole('button',{name:label,exact:true}).click();
   assert.match(await page.locator('.sprint-preview-art .is-visible').getAttribute('src'),new RegExp(src));
  }
  await page.getByText('Touch release',{exact:true}).click();
  assert.equal(await page.locator('#start-types details').nth(1).getAttribute('open'),'');
  await page.getByRole('link',{name:'Explore every feature',exact:true}).click();
  await page.waitForURL('**/features');
  assert.equal(await page.locator('.feature-guide article').count(),37);
  results.push({check:'desktop controls, scenes, start types and 37-feature guide',pass:true});
  for(const [locale,width,height] of [['en',1440,1000],['en',820,1180],['en',390,844],['en',320,800],['nb',390,844],['de',390,844],['ar',390,844],['ja',390,844],['hi',390,844]]) {
   await page.setViewportSize({width,height});
   await page.goto('http://localhost:3211/'+(locale==='en'?'':locale),{waitUntil:'networkidle'});
   const metrics=await page.evaluate(()=>({viewport:innerWidth,body:document.body.scrollWidth,document:document.documentElement.scrollWidth,h1:document.querySelector('h1')?.innerText,broken:[...document.querySelectorAll('img')].filter(img=>img.getBoundingClientRect().top<innerHeight && (!img.complete||!img.naturalWidth)).map(img=>img.src)}));
   assert.ok(metrics.document<=width+1,JSON.stringify({locale,width,metrics}));
   assert.equal(metrics.broken.length,0);
   if(width===390 && ['en','ar','nb'].includes(locale)) await page.screenshot({path:'docs/reviews/website-redesign-2026-09-06/v2-'+locale+'-mobile.png',fullPage:true});
   if(width===820)await page.screenshot({path:'docs/reviews/website-redesign-2026-09-06/v2-tablet-hero.png'});
   if(width===390 && locale==='en'){
    await page.getByRole('button',{name:'Open menu',exact:true}).click();
    assert.equal(await page.getByRole('dialog').isVisible(),true);
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({state:'hidden'});
    assert.equal(await page.getByRole('button',{name:'Open menu',exact:true}).evaluate(el=>el===document.activeElement),true);
   }
   results.push({locale,width,height,...metrics,pass:true});
  }
  assert.equal(errors.length,0,errors.join('\n'));
 } finally {
  fs.writeFileSync('docs/reviews/website-redesign-2026-09-06/v2-browser-results.json',JSON.stringify({date:new Date().toISOString(),results,errors},null,2)+'\n');
  await browser.close();
 }
 console.log(JSON.stringify({checks:results.length,errors,pass:true}));
})().catch(error=>{console.error(error);process.exitCode=1;});
