const puppeteer = require('puppeteer');

// The browser instance created for each test
let browser;

// Create the browser before each test
beforeEach(async (done) => {
  browser = await puppeteer.launch({
    // headless: false 
  });

  done();
});

// Close the browser after each test
afterEach(async (done) => {
  await browser.close(); 
  done();
});

test('Display', async () => {
  let page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  const title = await page.title();
  const hello = await page.$("#display");
  const msg = await (await hello.getProperty('textContent')).jsonValue();
  expect(msg).toBe('November 2020');
});

test('today', async () => {
  const today = new Date();
  let page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  const title = await page.title();
  const hello = await page.$("#today");
  const msg = await (await hello.getProperty('textContent')).jsonValue();
  expect(msg).toBe(''+today.getDate());
});

test('empty last dates', async () => {
  const today = new Date();
  let page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  const title = await page.title();
  let hello = await page.$("#d37");
  let msg = await (await hello.getProperty('textContent')).jsonValue();
  expect(msg).toBe('');
  hello = await page.$("#d38");
  msg = await (await hello.getProperty('textContent')).jsonValue();
  expect(msg).toBe('');
  hello = await page.$("#d39");
  msg = await (await hello.getProperty('textContent')).jsonValue();
  expect(msg).toBe('');
  hello = await page.$("#d40");
  msg = await (await hello.getProperty('textContent')).jsonValue();
  expect(msg).toBe('');
  hello = await page.$("#d41");
  msg = await (await hello.getProperty('textContent')).jsonValue();
  expect(msg).toBe('');
});

test('empty first dates', async () => {
  let page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  const title = await page.title();
  await page.click('#next');
  let hello = await page.$("#d0");
  let msg = await (await hello.getProperty('textContent')).jsonValue();
  expect(msg).toBe('');
  hello = await page.$("#d1");
  msg = await (await hello.getProperty('textContent')).jsonValue();
  expect(msg).toBe('');
});

test('today in new month', async () => {
  const today = new Date();
  let page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  const title = await page.title();
  await page.click('#next');
  const hello = await page.$("#today");
  expect(hello).toBe(null);
});

test('today going back to month', async () => {
  const today = new Date();
  let page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  const title = await page.title();
  await page.click('#next');
  await page.click('#prev');
  const hello = await page.$("#today");
  const msg = await (await hello.getProperty('textContent')).jsonValue();
  expect(msg).toBe(''+today.getDate());
});

test('today in two months backs', async () => {
  const today = new Date();
  let page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  const title = await page.title();
  await page.click('#next');
  await page.click('#prev');
  await page.click('#prev');
  const hello = await page.$("#today");
  expect(hello).toBe(null);
});
