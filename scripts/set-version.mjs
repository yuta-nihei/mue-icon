// 全パッケージのバージョンを揃える: pnpm version:set 0.2.0
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib.mjs';

const v = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(v ?? '')) {
  console.error('使い方: pnpm version:set <x.y.z>');
  process.exit(1);
}
const files = ['package.json', ...['core', 'react', 'vue', 'sprite'].map((p) => `packages/${p}/package.json`)];
for (const f of files) {
  const p = join(ROOT, f);
  const j = JSON.parse(readFileSync(p, 'utf8'));
  j.version = v;
  writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
}
const php = join(ROOT, 'packages/wordpress/mue-icons/mue-icons.php');
writeFileSync(
  php,
  readFileSync(php, 'utf8').replace(/(Version:\s*)\S+/, `$1${v}`).replace(/(MUE_ICONS_VERSION',\s*')[^']+/, `$1${v}`),
);
console.log(`version: ${v} に更新しました。リリース前に pnpm compat:update を実行してください`);
