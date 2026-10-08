// 互換性チェック: 過去にリリースしたアイコン名・variant が消えていないかを検査する。
//   node scripts/check-compat.mjs           … 検査(CI用)
//   node scripts/check-compat.mjs --update  … 現在の内容を icons.snapshot.json に記録(リリース時)
import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, readJson } from './lib.mjs';

const current = readJson('icons.json').icons;
const SNAP = join(ROOT, 'icons.snapshot.json');

if (process.argv.includes('--update')) {
  const snapshot = {};
  const prev = existsSync(SNAP) ? readJson('icons.snapshot.json').icons : {};
  for (const [name, m] of Object.entries(current)) snapshot[name] = [...new Set([...(prev[name] ?? []), ...m.variants])];
  // 過去の名前は消さない(aliasとして残っているかを検査し続けるため)
  for (const [name, v] of Object.entries(prev)) snapshot[name] ??= v;
  writeFileSync(SNAP, JSON.stringify({ icons: snapshot }, null, 2) + '\n');
  console.log(`compat: snapshot 更新 (${Object.keys(snapshot).length} 件)`);
  process.exit(0);
}

const released = readJson('icons.snapshot.json').icons;
const aliasToName = new Map(Object.entries(current).flatMap(([n, m]) => (m.aliases ?? []).map((a) => [a, n])));
const problems = [];
for (const [name, variants] of Object.entries(released)) {
  const target = current[name] ? name : aliasToName.get(name);
  if (!target) {
    problems.push(`${name}: 削除されています。リネームする場合は新しい名前の aliases に "${name}" を残してください(削除は major のみ)`);
    continue;
  }
  for (const v of variants) {
    if (!current[target].variants.includes(v)) problems.push(`${name}: variant "${v}" が消えています`);
  }
}
if (problems.length) {
  console.error('compat: 後方互換性を壊す変更があります\n' + problems.map((p) => `  - ${p}`).join('\n'));
  process.exit(1);
}
console.log(`compat: OK (${Object.keys(released).length} 件を検査)`);
