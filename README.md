# 天神ふれあい広場ガイド

福岡市役所西側ふれあい広場の非公式・日本語単言語ガイドサイトです。広場紹介、年間イベント、詳細交通、周辺グルメ、周辺スポット、ブラウザ内完結の記念カードメーカーを含む多ページ構成です。

## 技術構成

- Astro 7.1.3
- Tailwind CSS 4.3.3（`@tailwindcss/vite`）
- TypeScript 7.0.2
- pnpm 11.18.0
- Wrangler 4.115.0
- Cloudflare Workers Static Assets
- Google Analytics 4: `G-HXM22WWPKP`
- データベース、ログイン、CMSなし

## ページ

- `/` ホーム
- `/about` 広場紹介
- `/events` 2026年度イベント案内
- `/access` 空港・博多駅・地下鉄・西鉄からの詳細交通
- `/food` 周辺グルメ
- `/nearby` 周辺スポットと徒歩コース
- `/card` ローカルCanvas記念カードメーカー
- `/privacy` プライバシー説明
- `/credits` 写真・情報出典

## ローカル起動

Node.js 22以上とpnpm 11.18.0を使用してください。

```bash
corepack enable
corepack prepare pnpm@11.18.0 --activate
pnpm install
cp .env.example .env
pnpm dev
```

`.env` の `PUBLIC_SITE_URL` を取得したドメインへ変更してください。ドメインはページ本文には表示されず、canonical、OG URL、サイトマップ、robots.txtの生成にのみ使われます。

## ビルド

```bash
pnpm build
pnpm preview
```

## Cloudflare Workersへデプロイ

```bash
pnpm login
pnpm deploy
```

`wrangler.jsonc` は `dist` をWorkers Static Assetsとして配信します。独自ドメインはCloudflare Dashboardの Workers & Pages → 対象Worker → Settings → Domains & Routes から追加してください。

## 記念カード機能

`src/scripts/card-maker.ts` が以下をブラウザ内で処理します。

- 後置カメラ撮影
- 前置カメラで自撮り
- 端末内の画像選択
- 1:1 / ポストカード縦 / 9:16
- 写真の拡大・水平・垂直位置調整
- 都市の緑 / 祭りの灯 / 天神の夜 の3スタイル
- スポット名・日付・短文の編集
- JPEG生成と端末保存

画像、文字、完成データを送信するAPIはありません。CanvasはローカルのBlob URLと同一オリジン画像のみを使用するため、完成画像を安全に書き出せます。

## 写真について

実装確認用として、福岡市公式シティガイドおよび各店舗公式サイトの公開写真をローカル保存しています。一般公開・商用運用前に各権利者の利用条件を確認し、必要に応じて許諾取得または自社撮影素材へ差し替えてください。コードの利用条件と写真の権利は別です。

## 情報更新

イベント日程、営業時間、休館日、徒歩時間は変更される場合があります。特に `src/data/events.ts`、`src/data/food.ts` は公開前とシーズンごとに確認してください。
