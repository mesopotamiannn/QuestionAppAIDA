# Cloudflare D1 データベース連携手順

現在、アプリの「いいね機能」などは簡易的な**インメモリ保存**（サーバー再起動で消える）で動作しています。
本番環境でデータを永続化するためには、以下の手順で Cloudflare D1 データベースを連携する必要があります。

## 手順 1: Cloudflare D1 データベースの作成

ターミナルで以下のコマンドを実行し、新しいデータベースを作成します。

```bash
npx wrangler d1 create question-app-db
```

実行後、以下のような出力が表示されます。この `database_id` をコピーしてください。

```
✅ Successfully created DB 'question-app-db' in region '...'
Created your database using D1's interactions API...

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "question-app-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

## 手順 2: Wrangler 設定ファイルの作成

プロジェクトルートに `wrangler.toml` ファイルを作成し、先ほどの情報を貼り付けます。

**ファイル:** `wrangler.toml`
```toml
name = "question-app"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "question-app-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" # ここを書き換える
```

## 手順 3: データベーススキーマの適用

作成したスキーマファイル (`d1/schema.sql`) を、リモートの D1 データベースに適用します。

```bash
# ローカル開発用（プレビュー）に適用する場合
npx wrangler d1 execute question-app-db --local --file=./d1/schema.sql

# 本番環境に適用する場合
npx wrangler d1 execute question-app-db --remote --file=./d1/schema.sql
```

## 手順 4: コードの修正 (API Route)

現在、`src/app/api/questions/[id]/like/route.ts` などはインメモリ変数 `likes` を使用しています。
これを `env.DB` を使うように修正する必要があります。

**例 (修正イメージ):**

```typescript
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(req) {
  const { env } = getRequestContext();
  const db = env.DB;
  
  // D1へのクエリ実行
  await db.prepare('INSERT INTO ...').bind(...).run();
  
  // ...
}
```

> **Note:** Next.js App Router を Cloudflare Pages で動かす場合、`@cloudflare/next-on-pages` パッケージを使用して環境変数（バインディング）にアクセスします。

## 手順 5: デプロイ

設定とコード修正が完了したら、Cloudflare Pages にデプロイします。

```bash
npm run pages:build
npx wrangler pages deploy .vercel/output/static
```
