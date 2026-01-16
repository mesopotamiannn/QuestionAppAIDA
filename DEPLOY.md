# Deployment Guide (Cloudflare Pages)

## Prerequisites
- Cloudflare Account
- GitHub Repository (linked to this project)

## Setup Steps

9. **Gitの同期（リセット後）**
   リセットを行ったため、通常の `git push` は拒否されます。以下のコマンドで強制的にリモートを更新し、Cloudflare Pages のビルドをトリガーします。
   ```bash
   git push -f origin main
   ```

10. **Build Command 確認**
    Cloudflare の「Build setting」で以下のようになっていることを確認してください。
    - **Build command**: `npm run pages:build`
    - **Build output directory**: `.vercel/output/static`

11. **D1 Database のバインディング**
    Cloudflare Pages の設定から D1 を紐付ける必要があります。
    - **Settings** > **Functions** > **D1 database bindings**
    - **Variable name**: `DB`
    - **D1 database**: `question-app-db` を選択

12. **D1 スキーマの適用 (初回のみ)**
    リモートのデータベースにテーブルを作成します。ローカルのターミナルで以下を実行してください。
    ```bash
    npx wrangler d1 execute question-app-db --remote --file=./d1/schema.sql
    ```

## Troubleshooting
- **500 Internal Server Error**: D1 のバインディングが正しくないか、テーブルが作成されていない場合に発生します。上記の手順 11, 12 を再確認してください。

## Local Preview
To preview the Cloudflare build locally:
```bash
npm run pages:build
npx wrangler pages dev .vercel/output/static
```
