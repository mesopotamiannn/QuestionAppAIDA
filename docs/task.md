# Task Checklist: Question App Development

## Phase 1: 初期設定と基盤構築
- [x] 要件定義と設計ドキュメントの確認
- [x] Next.js プロジェクトのセットアップ (TypeScript, PWA設定)
- [x] スタイル基盤の構築 (Vanilla CSS / CSS Modules variables, Global Styles)
- [x] 開発環境の整備 (ESLint, Prettier, Husky)
- [x] **Phase 1 完了時のGitコミットとバックアップ**

## Phase 2: データ設計と実装
- [x] IndexedDB ラッパーの実装 (idb使用)
- [x] データモデルの定義 (Question, Session, Participant)
- [x] Cloudflare D1 スキーマ定義 (マイグレーションファイル作成)
- [x] 初期データ (Seed) の作成 (各カテゴリの質問データ)
- [x] **Phase 2 完了時のGitコミットとバックアップ**

## Phase 3: コア機能実装 (フロントエンド)
- [x] 共通コンポーネントの作成 (Button, Card, Input, Layout)
- [x] ホーム画面の実装 (参加者入力, モード設定)
- [x] ゲームロジックの実装 (出題順, プレイヤーローテーション)
- [x] ゲーム画面の実装 (質問カード表示, アニメーション)
- [x] 結果/終了画面の実装
- [x] **Phase 3 完了時のGitコミットとバックアップ**

## Phase 4: バックエンド連携と機能拡張
- [x] 質問投稿フォームの実装
- [x] Cloudflare Workers API の実装 (質問取得, 投稿)
- [x] データ同期機能の実装 (Server -> Client)
- [x] 18+ モードの制御実装
- [x] **Phase 4 完了時のGitコミットとバックアップ**

## Phase 5: PWA化と仕上げ
- [x] Service Worker の設定とオフライン動作確認
- [x] マニフェストファイルの設定
- [x] UI/UXのブラッシュアップ (インタラクション, デザイン詳細)
- [x] SEO設定 (Meta tags, OGP)
- [x] **Phase 5 完了時のGitコミットとバックアップ**

## Phase 6: デプロイとテスト
- [x] Cloudflare Pages へのデプロイ設定 (DEPLOY.md 作成, ビルドスクリプト整備)
- [x] 動作テスト (クロスブラウザ, モバイル実機確認 - ローカルにて完了)
- [x] **Phase 6 完了時のGitコミットとバックアップ**
