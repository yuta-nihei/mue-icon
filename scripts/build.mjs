import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { ROOT, ROOT_ATTRS, VARIANTS, loadIcons, readJson, toCamel, toPascal } from './lib.mjs';
import { lint } from './lint.mjs';

const errors = lint();
if (errors.length) {
  console.error(errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

const icons = loadIcons();
const write = (rel, content) => {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
};
const copy = (from, to) => {
  mkdirSync(dirname(join(ROOT, to)), { recursive: true });
  copyFileSync(join(ROOT, from), join(ROOT, to));
};
const HEADER = '// 自動生成ファイル。直接編集しないでください(scripts/build.mjs)\n';
const json = (v) => JSON.stringify(v);

for (const pkg of ['core', 'react', 'vue', 'sprite']) rmSync(join(ROOT, 'packages', pkg, 'dist'), { recursive: true, force: true });

// 1) 名前(aliases を含む)ごとの export 一覧
const exportsList = icons.flatMap((i) => [
  { id: toCamel(i.name), target: i },
  ...i.aliases.map((a) => ({ id: toCamel(a), target: i })),
]);

// ---- core ----
write(
  'packages/core/dist/index.js',
  HEADER +
    icons
      .map((i) => `export const ${toCamel(i.name)} = ${json({ name: i.name, variants: i.variants })};`)
      .join('\n') +
    '\n' +
    icons.flatMap((i) => i.aliases.map((a) => `export const ${toCamel(a)} = ${toCamel(i.name)};`)).join('\n') +
    '\n',
);
write(
  'packages/core/dist/index.d.ts',
  `import type { Icon } from './runtime.js';\nexport type { Icon, Variant, RenderOptions } from './runtime.js';\n` +
    exportsList.map((e) => `export const ${e.id}: Icon;`).join('\n') +
    '\n',
);
const meta = Object.fromEntries(
  icons.map((i) => [i.name, { category: i.category, tags: i.tags, since: i.since, variants: i.variants && Object.keys(i.variants), aliases: i.aliases }]),
);
write('packages/core/dist/icons.json', JSON.stringify({ icons: meta }, null, 2) + '\n');
write(
  'packages/core/dist/all.js',
  HEADER +
    `import { ${icons.map((i) => toCamel(i.name)).join(', ')} } from './index.js';\n` +
    `export const icons = [${icons.map((i) => toCamel(i.name)).join(', ')}];\n` +
    `export const meta = ${json(meta)};\n`,
);
write(
  'packages/core/dist/all.d.ts',
  `import type { Icon } from './runtime.js';\nexport const icons: Icon[];\nexport const meta: Record<string, { category: string; tags: { ja: string[]; en: string[] }; since: string; variants: string[]; aliases: string[] }>;\n`.replace(
    /export const/g,
    'export declare const',
  ),
);
copy('packages/core/src/runtime.js', 'packages/core/dist/runtime.js');
copy('packages/core/src/runtime.d.ts', 'packages/core/dist/runtime.d.ts');

// ---- react / vue ----
// alias は同じコンポーネントを別名で再エクスポートして重複定義を避ける
const comps = icons.map((i) => `export const ${toPascal(toCamel(i.name))}Icon = createIcon(${json(i.name)}, ${json(i.variants)});`);
const compAliases = icons.flatMap((i) =>
  i.aliases.map((a) => `export const ${toPascal(toCamel(a))}Icon = ${toPascal(toCamel(i.name))}Icon;`),
);
for (const fw of ['react', 'vue']) {
  copy(`packages/${fw}/src/createIcon.js`, `packages/${fw}/dist/createIcon.js`);
  write(
    `packages/${fw}/dist/icons.js`,
    HEADER + `import { createIcon } from './createIcon.js';\n` + [...comps, ...compAliases].join('\n') + '\n',
  );
  write(`packages/${fw}/dist/index.js`, HEADER + `export * from './icons.js';\nexport { createIcon } from './createIcon.js';\n`);
}
const names = [...icons.map((i) => toPascal(toCamel(i.name))), ...icons.flatMap((i) => i.aliases.map((a) => toPascal(toCamel(a))))];
write(
  'packages/react/dist/index.d.ts',
  `import type { ForwardRefExoticComponent, RefAttributes, SVGAttributes } from 'react';\n` +
    `export interface IconProps extends SVGAttributes<SVGSVGElement> {\n  size?: number | string;\n  variant?: 'line' | 'duotone';\n  title?: string;\n}\n` +
    `export type Icon = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;\n` +
    `export declare function createIcon(name: string, variants: { line: string; duotone?: string }): Icon;\n` +
    names.map((n) => `export const ${n}Icon: Icon;`).join('\n') +
    '\n',
);
write(
  'packages/vue/dist/index.d.ts',
  `import type { DefineComponent } from 'vue';\n` +
    `export type Icon = DefineComponent<{ size?: number | string; variant?: 'line' | 'duotone'; title?: string }>;\n` +
    `export declare function createIcon(name: string, variants: { line: string; duotone?: string }): Icon;\n` +
    names.map((n) => `export const ${n}Icon: Icon;`).join('\n') +
    '\n',
);

// ---- sprite ----
const rootAttrs = Object.entries(ROOT_ATTRS)
  .filter(([k]) => k !== 'xmlns')
  .map(([k, v]) => `${k}="${v}"`)
  .join(' ');
const symbols = icons.flatMap((i) =>
  Object.entries(i.variants).map(([v, body]) => `<symbol id="mue-${i.name}-${v}" ${rootAttrs}>${body}</symbol>`),
);
const spriteInner = symbols.join('\n');
write('packages/sprite/dist/sprite.svg', `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${spriteInner}\n</svg>\n`);

// ---- WordPress ----
const hiddenSprite = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">\n${spriteInner}\n</svg>\n`;
write('packages/wordpress/mue-icons/assets/sprite.svg', hiddenSprite);
write(
  'packages/wordpress/mue-icons/assets/icons.json',
  JSON.stringify(
    {
      icons: Object.fromEntries(icons.map((i) => [i.name, Object.keys(i.variants)])),
      aliases: Object.fromEntries(icons.flatMap((i) => i.aliases.map((a) => [a, i.name]))),
    },
    null,
    2,
  ) + '\n',
);

// ---- プレビューサイト ----
const tpl = readFileSync(join(ROOT, 'site-src/index.html'), 'utf8');
const siteData = icons.map((i) => ({ name: i.name, category: i.category, tags: i.tags, variants: Object.keys(i.variants) }));
write(
  'site/index.html',
  tpl.replace('<!--SPRITE-->', hiddenSprite).replace('/*ICONS_JSON*/[]', json(siteData)).replace('__VERSION__', readJson('packages/core/package.json').version),
);

console.log(`build: ${icons.length} icons × ${VARIANTS.length} variants → core / react / vue / sprite / wordpress / site`);
