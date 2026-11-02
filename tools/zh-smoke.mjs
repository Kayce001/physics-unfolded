import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const chapters = 'kinematics newton circular energy momentum oscillations rotation fluids electrostatics gauss potential capacitors circuits magnetism induction'.split(' ');
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.setViewport({ width: 1440, height: 1000 });
const errors = [], results = [];
page.on('pageerror', e => errors.push(e.message));
fs.mkdirSync('qa-artifacts', { recursive: true });
try {
  await page.goto('http://127.0.0.1:8137/', { waitUntil: 'networkidle2' });
  if (await page.$eval('html', e => e.lang) !== 'zh-CN') throw Error('Homepage language');
  await page.screenshot({ path: 'qa-artifacts/home-desktop.png', fullPage: true });
  for (const c of chapters) {
    await page.goto(`http://127.0.0.1:8137/${c}/`, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => window.__atlas && document.querySelector('.q'), { timeout: 30000 });
    const n = await page.$$eval('#dots button', es => es.length);
    let questions = 0;
    for (let i=0; i<n; i++) {
      await page.evaluate(i => { location.hash = '#' + i; }, i);
      await page.waitForFunction(i => document.getElementById('pagenum').textContent.startsWith(`${i+1} /`), { timeout: 10000 }, i);
      const data = await page.evaluate(() => ({ text: document.getElementById('sheet').textContent, questions: document.querySelectorAll('.q').length }));
      if (!/[\u4e00-\u9fff]/.test(data.text)) throw Error(`${c}/${i}: no Chinese text`);
      if (!data.questions) throw Error(`${c}/${i}: missing practice`);
      questions += data.questions;
      if (i === 0) {
        await page.evaluate(() => document.querySelector('#sheet .q button').click());
        await page.waitForFunction(() => !document.querySelector('#sheet .why').hidden);
      }
    }
    results.push({ chapter: c, pages: n, questions });
    console.log(`${c}: ${n} pages, ${questions} questions`);
  }
  await page.goto('http://127.0.0.1:8137/equations/', { waitUntil: 'networkidle2' });
  if (await page.$eval('html', e => e.lang) !== 'zh-CN') throw Error('Equation language');
  if (!await page.$eval('body', e => /[\u4e00-\u9fff]/.test(e.textContent))) throw Error('Equation sheet is not Chinese');
  await page.type('#q', '力矩');
  if (!await page.$$eval('.group:not(.ref) li:not(.hidden)', es => es.length)) throw Error('Chinese equation search');
  await page.$eval('#q', e => { e.value = ''; e.dispatchEvent(new Event('input')); });
  await page.screenshot({ path: 'qa-artifacts/equations-desktop.png', fullPage: true });
  for (const width of [1440, 390]) {
    await page.setViewport({ width, height: width === 390 ? 844 : 1000, isMobile: width === 390, hasTouch: width === 390 });
    if (width === 390) {
      await page.goto('http://127.0.0.1:8137/', { waitUntil: 'networkidle2' });
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2)) throw Error('Mobile homepage overflow');
      await page.screenshot({ path: 'qa-artifacts/home-mobile.png', fullPage: true });
    }
    await page.goto('http://127.0.0.1:8137/kinematics/#1', { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => window.__atlas && document.querySelector('.q'));
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2)) throw Error(`Horizontal overflow at ${width}`);
    await page.screenshot({ path: `qa-artifacts/kinematics-${width}.png`, fullPage: false });
    await page.evaluate(() => window.__atlas.select('ball'));
    await page.waitForFunction(() => !document.getElementById('plate').hidden);
    if (!await page.$eval('#plate', e => e.textContent.includes('图示拆解'))) throw Error('Chinese breakdown');
    await page.$eval('#plate .close', e => e.click());
    if (!await page.$eval('#plate', e => e.hidden)) throw Error('Close breakdown');
  }
  if (errors.length) throw Error(errors.join('\n'));
  fs.writeFileSync('qa-artifacts/results.json', JSON.stringify({ results, errors, totalPages: results.reduce((a,r)=>a+r.pages,0), totalQuestions: results.reduce((a,r)=>a+r.questions,0) }, null, 2));
  console.log('PASS Chinese pages, navigation, practice, equations, responsive widths; no JavaScript errors');
} finally { await browser.close(); }
