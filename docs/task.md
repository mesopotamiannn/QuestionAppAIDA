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
- [ ] 共通コンポーネントの作成 (Button, Card, Input, Layout)
- [ ] ホーム画面の実装 (参加者入力, モード設定)
- [ ] ゲームロジックの実装 (出題順, プレイヤーローテーション)
- [ ] ゲーム画面の実装 (質問カード表示, アニメーション)
- [ ] 結果/終了画面の実装
- [ ] **Phase 3 完了時のGitコミットとバックアップ**

## Phase 4: バックエンド連携と機能拡張
- [ ] 質問投稿フォームの実装
- [ ] Cloudflare Workers API の実装 (質問取得, 投稿)
- [ ] データ同期機能の実装 (Server -> Client)
- [ ] 18+ モードの制御実装
- [ ] **Phase 4 完了時のGitコミットとバックアップ**

## Phase 5: PWA化と仕上げ
- [ ] Service Worker の設定とオフライン動作確認
- [ ] マニフェストファイルの設定
- [ ] UI/UXのブラッシュアップ (インタラクション, デザイン詳細)
- [ ] SEO設定 (Meta tags, OGP)
- [ ] **Phase 5 完了時のGitコミットとバックアップ**

## Phase 6: デプロイとテスト
- [ ] Cloudflare Pages へのデプロイ設定
- [ ] 動作テスト (クロスブラウザ, モバイル実機確認)
- [ ] **Phase 6 完了時のGitコミットとバックアップ**
