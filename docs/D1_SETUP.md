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

### 方法 A: Cloudflare Git Integration (推奨)

Windows環境では `next-on-pages` のローカルビルドがエラーになる場合が多いため、GitHub経由のデプロイを推奨します。

1. **GitHubにコードをプッシュ**
   このプロジェクトをGitHubのリポジトリにプッシュします。

2. **Cloudflare Pagesと連携**
   - Cloudflareダッシュボード > Pages > Connect to Git
   - リポジトリを選択
   - **Build Settings (ビルド設定)**:
     - **Framework preset**: Next.js (Static HTML Export) ではなく **None** を選択する場合もありますが、通常はフレームワーク自動検出に任せるか、以下を手動設定します：
     - **Build command**: `npx @cloudflare/next-on-pages`
     - **Build output directory**: `.vercel/output/static`
     - **Environment Variables (環境変数)**:
       - `NODE_VERSION`: `20` (または使用しているバージョン)

3. **D1データベースのバインディング**
   デプロイプロジェクトが作成されたら、Settings > Functions > D1 Database Bindings で以下を設定します：
   - Variable name: `DB`
   - D1 Database: `question-app-db`

4. **再デプロイ**
   設定後、Retry deployment を行うと、クラウド上でビルドが実行され、D1と連携したアプリが公開されます。

### 方法 B: ローカルビルド (Windowsでの注意点)

`npm run pages:build` が `Unexpected error` (文字化け等) で失敗する場合、Windowsの文字コード設定などが原因の可能性があります。

**対策:**
ターミナルで文字コードを UTF-8 に変更してから実行してみてください。
```bash
chcp 65001
npm run pages:build
```
それでも失敗する場合は、上記 **「方法 A」** を利用してください。

ビルドが成功した場合のみ、以下・ﾅデプロイ可能です：
```bash
npx wrangler pages deploy .vercel/output/static
```
