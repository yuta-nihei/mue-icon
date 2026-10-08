# アイコン追加のルール

lint(`pnpm lint`)が機械的に検査します。違反するとビルドが失敗します。

## 規格

- キャンバス 24×24(`viewBox="0 0 24 24"`)、外周 2px 以上の余白を目安にする
- 線幅 **1.5**、端点・角は round(ルート要素で固定。個別の `stroke-width` は禁止)
- ルート要素は既存SVGと**完全に同一**にする(コピーして使う)
- 色は `currentColor` のみ。`#fff` や `rgb()` の直書き禁止
- `id` / `class` / `<style>` / `<script>` / イベント属性は使わない

## スタイル

- `line`(必須): 線のみ
- `duotone`: line の図形に、副色の面を**先頭に1つ以上**重ねる。副色は次の形式のみ:
  `style="fill:var(--icon-secondary,currentColor)" fill-opacity=".25" stroke="none"`

## 手順

1. `svg/line/<name>.svg`(と必要なら `svg/duotone/<name>.svg`)を作る。名前は kebab-case
2. `icons.json` に登録(category / tags の日英 / since / variants / aliases)
3. `pnpm test` と `pnpm compat` を通す

## 名前を変えたいとき

旧名を `aliases` に残し、消さない。削除は major バージョンでのみ行う。

## 地図記号・商標

- 公的機関の記号・ロゴ・商標をそのままトレースしない。独自のデザインにする
- 出典や参考にした資料がある場合は PR に書く
