# mue-icons

日本向けアイコンライブラリ(印鑑・帳票・地図記号・医療・金融)。MIT ライセンス。
React / Vue / SVGスプライト / WordPress に対応し、全アイコンを同じ規格(24px グリッド・線幅 1.5)で管理します。

> 現在は **v0.1.0 の土台**です。各分野のサンプルアイコン11個(line / duotone の2スタイル)が入っています。

## パッケージ

| パッケージ | 用途 |
|---|---|
| `mue-icons` | SVGデータ、`renderSvg()`(フレームワーク非依存) |
| `mue-icons-react` | React コンポーネント(React 17+) |
| `mue-icons-vue` | Vue 3 コンポーネント |
| `mue-icons-sprite` | `sprite.svg`(`<use>` 参照) |
| `packages/wordpress/mue-icons` | WordPress プラグイン(ショートコード) |

ESM のみ提供します。全パッケージは同一バージョンで同時にリリースします。

## 使い方

```jsx
// React
import { HankoIcon, ToriiIcon } from 'mue-icons-react';
<HankoIcon size={32} variant="duotone" title="印鑑" />
```

```vue
<!-- Vue 3 -->
<script setup>
import { InvoiceIcon } from 'mue-icons-vue';
</script>
<template><InvoiceIcon :size="24" /></template>
```

```js
// フレームワークなし
import { bank } from 'mue-icons';
import { renderSvg } from 'mue-icons/runtime';
el.innerHTML = renderSvg(bank, { variant: 'line', size: 24 });
```

```html
<!-- スプライト: id は mue-<名前>-<スタイル> -->
<svg width="24" height="24"><use href="/sprite.svg#mue-hanko-line"/></svg>
```

```
[mue_icon name="hanko" variant="duotone" size="32" label="印鑑"]   ← WordPress ショートコード
```

- 色は `currentColor`。duotone の副色は CSS 変数 `--icon-secondary` で変更できます(未指定なら主色)。
- `title` / `label` を指定すると `role="img"` + 名前付きに、省略すると装飾扱い(`aria-hidden`)になります。
- 使うアイコンだけをバンドルできます(`sideEffects: false`、アイコン単位の named export)。

## 互換性の方針

- SemVer。アイコン名・スタイルの **削除は major のみ**。
- リネームは旧名を `icons.json` の `aliases` に残します(コード上は旧名の export も維持)。
- `icons.snapshot.json` に過去リリースの名前を記録し、`pnpm compat` が削除・リネーム漏れを検出します。

## 開発

```bash
pnpm install
pnpm test          # lint + build + 生成物のテスト(React/Vue は SSR で描画確認)
pnpm build         # lint + build のみ
pnpm compat        # 後方互換性チェック
```

- アイコン原本は `svg/<line|duotone>/<name>.svg`、メタデータは `icons.json`。`dist/` と `site/` は自動生成物です。
- `site/index.html` が検索付きプレビュー(`python3 -m http.server --directory site` などで開く)。
- 追加ルールは [CONTRIBUTING.md](CONTRIBUTING.md)。

## リリース手順(まだ実行していません)

```bash
pnpm version:set 0.2.0   # 全パッケージとWPプラグインのバージョンを揃える
pnpm test && pnpm compat
pnpm compat:update       # 今回のリリース内容をスナップショットへ記録
# 各 packages/{core,react,vue,sprite} で: npm publish --provenance
```

WordPress プラグインは `pnpm build` 後に `packages/wordpress/mue-icons` を zip 化して配布します(`assets/` は生成物)。

## 地図記号について

`map-*` は地図記号の**着想による独自デザイン**で、公的な地図記号の図形データの転載ではありません。
国土地理院などの公的機関の地図記号を忠実に再現・転載する場合は、各機関の利用条件を確認してください(本リポジトリでは未確認)。
