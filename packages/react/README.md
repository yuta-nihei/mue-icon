# mue-icons-react

[mue-icons](https://www.npmjs.com/package/mue-icons) の React(17 以上)コンポーネント。

## インストール

```bash
npm install mue-icons-react
```

## 使い方

```jsx
import { HankoIcon, TrashBurnableIcon } from 'mue-icons-react';

<HankoIcon size={32} variant="duotone" title="印鑑" />
<TrashBurnableIcon />
```

| props | 内容 | 既定値 |
|---|---|---|
| `size` | 幅・高さ(px) | `24` |
| `variant` | `line` / `duotone` | `line` |
| `title` | 名前。指定すると `role="img"` になり、省略時は装飾扱い | なし |

その他の props は `<svg>` にそのまま渡されます。コンポーネント名は「アイコン名のパスカルケース + `Icon`」です。

## アイコン

40 個(印鑑・帳票・地図記号・医療・金融・生活)。一覧・使い方・オプションは[リポジトリの README](https://github.com/yuta-nihei/mue#readme)を参照してください。

色は `currentColor`、duotone の副色は CSS 変数 `--icon-secondary` で変更できます。

## ライセンス

MIT
