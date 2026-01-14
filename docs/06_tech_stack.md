# 技術スタック

## フロントエンド
- Next.js
- TypeScript
- PWA（Service Worker）
- IndexedDB（idb）

## インフラ
- Cloudflare Pages（ホスティング）
- Cloudflare Workers（API）
- Cloudflare D1（SQLite）
- Cloudflare R2（質問パック配布）

## 設計方針
- 静的配信を最大化
- DBアクセス最小化
- 差分同期方式
- 無料枠での商用運用を前提
