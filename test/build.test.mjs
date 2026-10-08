import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, readJson, toCamel, toPascal } from '../scripts/lib.mjs';
import { lint } from '../scripts/lint.mjs';

const names = Object.keys(readJson('icons.json').icons);
const dist = (p) => join(ROOT, 'packages', p);

test('lint に違反がない', () => assert.deepEqual(lint(), []));

test('core: 全アイコンと alias が named export される', async () => {
  const core = await import(join(dist('core'), 'dist/index.js'));
  for (const n of names) {
    assert.equal(core[toCamel(n)].name, n);
    assert.ok(core[toCamel(n)].variants.line.length > 0);
  }
  assert.equal(core.stamp, core.hanko);
});

test('core: renderSvg が規定の属性を出力する', async () => {
  const { hanko } = await import(join(dist('core'), 'dist/index.js'));
  const { renderSvg } = await import(join(dist('core'), 'dist/runtime.js'));
  const svg = renderSvg(hanko, { variant: 'duotone', size: 32, title: '印鑑 & <押印>' });
  assert.match(svg, /viewBox="0 0 24 24"/);
  assert.match(svg, /stroke-width="1.5"/);
  assert.match(svg, /width="32" height="32"/);
  assert.match(svg, /aria-label="印鑑 &amp; &lt;押印&gt;"/);
  assert.match(svg, /--icon-secondary/);
  assert.match(renderSvg(hanko), /aria-hidden="true"/);
});

test('sprite: 全 variant の symbol がある', () => {
  const sprite = readFileSync(join(dist('sprite'), 'dist/sprite.svg'), 'utf8');
  const { icons } = readJson('icons.json');
  for (const [n, m] of Object.entries(icons))
    for (const v of m.variants) assert.ok(sprite.includes(`id="mue-${n}-${v}"`), `${n}-${v}`);
});

test('wordpress: プラグインに sprite と icons.json が同梱される', () => {
  const dir = join(dist('wordpress'), 'mue-icons');
  assert.ok(existsSync(join(dir, 'assets/sprite.svg')));
  const data = JSON.parse(readFileSync(join(dir, 'assets/icons.json'), 'utf8'));
  assert.deepEqual(Object.keys(data.icons).sort(), [...names].sort());
  assert.equal(data.aliases.stamp, 'hanko');
});

test('react: SSR で svg を描画できる', async () => {
  const React = (await import('react')).default;
  const { renderToStaticMarkup } = await import('react-dom/server');
  const m = await import(join(dist('react'), 'dist/index.js'));
  for (const n of names) assert.ok(m[`${toPascal(toCamel(n))}Icon`], n);
  const html = renderToStaticMarkup(React.createElement(m.HankoIcon, { size: 40, variant: 'duotone', title: '印鑑', className: 'x' }));
  assert.match(html, /<svg[^>]*width="40"[^>]*height="40"/);
  assert.match(html, /stroke-width="1.5"/);
  assert.match(html, /<title>印鑑<\/title>/);
  assert.match(html, /--icon-secondary/);
  assert.equal(m.StampIcon, m.HankoIcon);
});

test('vue: SSR で svg を描画できる', async () => {
  const { createSSRApp, h } = await import('vue');
  const { renderToString } = await import('@vue/server-renderer');
  const m = await import(join(dist('vue'), 'dist/index.js'));
  for (const n of names) assert.ok(m[`${toPascal(toCamel(n))}Icon`], n);
  const html = await renderToString(createSSRApp({ render: () => h(m.ToriiIcon, { size: 48, title: '鳥居' }) }));
  assert.match(html, /<svg[^>]*width="48"/);
  assert.match(html, /stroke-width="1.5"/);
  assert.match(html, /<title>鳥居<\/title>/);
});

test('site: プレビューにスプライトとデータが埋め込まれる', () => {
  const html = readFileSync(join(ROOT, 'site/index.html'), 'utf8');
  assert.ok(html.includes('id="mue-hanko-line"'));
  assert.ok(html.includes('"name":"hanko"'));
  assert.ok(!html.includes('__VERSION__'));
});
