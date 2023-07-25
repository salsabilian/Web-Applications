const Templater = require('./templater');

test('Undefined', () => {
  const t = new Templater(undefined);
  expect(t.apply({})).toBe(undefined);
});

test('Single Tag', () => {
  const t = new Templater('Hello {{tag}}');
  expect(t.apply({tag: 'World'})).toBe('Hello World');
});

test('Multi Tag', () => {
  const t = new Templater('Mary {{had}} a {{little}} {{lamb}}');
  expect(t.apply({had: 'had', little: 'little', lamb: 'lamb'}))
      .toBe('Mary had a little lamb');
});

test('Missing Tag', () => {
  const t = new Templater('Mary {{had}} a {{little}} {{lamb}}');
  expect(t.apply({had: 'had', lamb: 'lamb'}))
      .toBe('Mary had a lamb');
});

test('Missing Tag Strict', () => {
  const t = new Templater('Mary {{had}} a {{little}} {{lamb}}');
  expect(() => t.apply({had: 'had', lamb: 'lamb'}, true))
      .toThrowError();
});

test('Whitespace in key', () =>{
  const t = new Templater('Mary {{       had       }} a {{little}} {{lamb}}');
  expect(t.apply({had: 'had', little: 'little', lamb: 'lamb'}))
      .toBe('Mary a little lamb');
});

test('No spaces', () =>{
  const t = new Templater('Mary{{had}}a{{little}}{{lamb}}');
  expect(t.apply({had: 'had', little: 'little', lamb: 'lamb'}))
      .toBe('Maryhadalittlelamb');
});

test('Same key multiple times', () =>{
  const t = new Templater('Mary {{had}} a {{had}} {{lamb}}');
  expect(t.apply({had: 'had', lamb: 'lamb'}))
      .toBe('Mary had a had lamb');
});

test('Characters in middle that are not spaces', () =>{
  const t = new Templater('Mary/{{had}}!a?{{little}};{{lamb}}');
  expect(t.apply({had: 'had', little: 'little', lamb: 'lamb'}))
      .toBe('Mary/had!a?little;lamb');
});
