# データ設計

## Question
- id
- categoryId
- text
- depth（light / normal / deep）
- rating（general / adult）
- status（approved / pending / rejected）
- createdAt
- updatedAt

## Session（ローカル）
- participants
- questionIds
- answerMode
- currentQuestionIndex
- currentParticipantIndex

## Client Storage
- IndexedDB：質問データ
- localStorage：18+同意フラグ
