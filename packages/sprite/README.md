# mue-icons-sprite

[mue-icons](https://www.npmjs.com/package/mue-icons) の SVG スプライト。`<use>` で参照して使います。

## インストール

```bash
npm install mue-icons-sprite
```

## 使い方

`mue-icons-sprite/sprite.svg` を配信ディレクトリにコピーし、シンボル ID `mue-<アイコン名>-<line|duotone>` を参照します。

```html
<svg width="24" height="24" aria-hidden="true">
  <use href="/sprite.svg#mue-hanko-line" />
</svg>
```

## アイコン

40 個(印鑑・帳票・地図記号・医療・金融・生活)。一覧・使い方・オプションは[リポジトリの README](https://github.com/yuta-nihei/mue#readme)を参照してください。

色は `currentColor`、duotone の副色は CSS 変数 `--icon-secondary` で変更できます。

## ライセンス

MIT
