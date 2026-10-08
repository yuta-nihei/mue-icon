# mue-icons

日本の暮らしや仕事で使うアイコン(印鑑・帳票・地図記号・医療・金融・生活)の SVG ライブラリ。line / duotone の2スタイル、24px グリッド・線幅 1.5 で統一。

このパッケージは SVG データと、フレームワーク非依存の `renderSvg()` を提供します。

## インストール

```bash
npm install mue-icons
```

## 使い方

```js
import { hanko } from 'mue-icons';
import { renderSvg } from 'mue-icons/runtime';

document.body.innerHTML = renderSvg(hanko, { variant: 'duotone', size: 32, title: '印鑑' });
```

- 使うアイコンだけを named import するとバンドルに含まれます(名前はキャメルケース: `trash-burnable` → `trashBurnable`)。
- `mue-icons/all` は全アイコンの一覧とメタデータ(検索 UI 向け)です。
- React は `mue-icons-react`、Vue 3 は `mue-icons-vue`、スプライトは `mue-icons-sprite` もあります。

## アイコン

40 個(印鑑・帳票・地図記号・医療・金融・生活)。一覧・使い方・オプションは[リポジトリの README](https://github.com/yuta-nihei/mue#readme)を参照してください。

色は `currentColor`、duotone の副色は CSS 変数 `--icon-secondary` で変更できます。

## ライセンス

MIT
