# Agent Skill: Default All-Answer Mode

---
name: default-all-answer-mode
description: セッション開始時の回答モードを「全員回答」をデフォルトとして設定し、ユーザー体験を価値観比較中心に最適化するスキル。
---

## Purpose
本スキルは、本アプリの中核コンセプトである  
**「同じ質問に全員が答え、価値観の違いを知る」** 体験を保証するために存在する。

交互回答モードは補助的なオプションとし、  
**初期状態では必ず全員回答モードが選択されている** 状態を作る。

---

## Trigger
- セッション作成画面が初期表示されたとき
- セッション設定がリセットされたとき

---

## Behavior
When initializing a session:

1. Set `answerMode` to `"all"` by default
2. Display UI label indicating:
   - 「みんなで答える（おすすめ）」
3. Keep `"turn"` mode available as an optional alternative
4. Ensure question count logic follows:
   - Question count = selected count (10 / 20 / 30)
   - Each question is answered by all participants
5. Prevent any auto-switching to turn mode unless explicitly chosen by the user

---

## UX Constraints
- ユーザーが意識せずとも「比較できる体験」に入れること
- 初回体験でモード選択に迷わせないこと
- 全質問が「共通体験」として記憶される構造を作ること

---

## Output
- Session object with:
  - `answerMode: "all"`
  - Fixed question count
  - All participants included per question

---

## Notes
- This skill defines the **default philosophy** of the application.
- Any future features must assume `"all"` as the baseline unless stated otherwise.
