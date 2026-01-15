# Agent Skill: Deep Dive Time Generator

---
name: deep-dive-time
description: 全質問終了後に「深掘りタイム」を生成し、これまでの質問一覧を提示することで会話を自然に延長するスキル。
---

## Purpose
本スキルは、セッション終了を「終わり」にせず、  
**「ここから本音が出る時間」へ自然につなぐための第2幕**として機能する。

質問そのものを再提示することで、
- 気になった価値観
- もう一度聞きたい答え
- 話し足りなかったテーマ

をユーザー自身に選ばせる。

---

## Trigger
- セッション内の全質問が完了したとき
- `currentQuestionIndex === totalQuestions`

---

## Behavior
When the last question is completed:

1. Transition to a new phase labeled **「深掘りタイム」**
2. Display a list of all questions used in the session
3. For each question, show:
   - Question text
   - 👍 Like state (if any)
4. Do NOT display any answers or logs
5. Allow users to:
   - Scroll freely
   - Tap a question and re-discuss it verbally
6. Do NOT force navigation or timers

---

## Naming & Presentation
- Phase name: **深掘りタイム**
- Subtitle example:
  - 「気になった質問を、もう一度話してみよう」
- Tone:
  - Calm
  - Optional
  - Non-judgmental

---

## UX Constraints
- No answer persistence (privacy first)
- No ranking or evaluation
- The list is a **conversation aid**, not a record

---

## Output
- Deep Dive Time screen with:
  - `questions: Question[]`
  - `likes: number`
  - Passive interaction only

---

## Design Intent
- Encourage organic continuation of conversation
- Let users choose depth voluntarily
- End sessions with warmth, not completion pressure

---

## Notes
- This phase is optional but recommended
- Users may exit freely without penalty
- This skill defines the **emotional aftertaste** of the app
