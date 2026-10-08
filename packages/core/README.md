# mue-icons

日本向けアイコン(印鑑・帳票・地図記号・医療・金融)のSVGデータと、フレームワーク非依存の `renderSvg()`。

```js
import { hanko } from 'mue-icons';
import { renderSvg } from 'mue-icons/runtime';

document.body.innerHTML = renderSvg(hanko, { variant: 'duotone', size: 32, title: '印鑑' });
```

- 使うアイコンだけを named import するとバンドルに含まれます。
- `mue-icons/all` は全アイコンの一覧とメタデータ(検索UI向け)。
- React: `mue-icons-react` / Vue: `mue-icons-vue` / スプライト: `mue-icons-sprite`
- MIT License
