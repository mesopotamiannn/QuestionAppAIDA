import { Question } from '@/types';

const createQuestion = (
    id: string,
    categoryId: string,
    text: string,
    depth: Question['depth'] = 'normal'
): Question => ({
    id,
    categoryId,
    text,
    depth,
    rating: 'general',
    status: 'approved',
    createdAt: Date.now(),
    updatedAt: Date.now(),
});

export const INITIAL_QUESTIONS: Question[] = [
    // 1. 自己紹介
    createQuestion('q1_1', '1', '自分の性格を一言で表すと？', 'light'),
    createQuestion('q1_2', '1', '最近ハマっていることは？', 'light'),
    createQuestion('q1_3', '1', '名前の由来を知ってる？', 'normal'),

    // 2. 趣味・休日
    createQuestion('q2_1', '2', '理想の休日の過ごし方は？', 'light'),
    createQuestion('q2_2', '2', '死ぬまでにやってみたい趣味は？', 'normal'),
    createQuestion('q2_3', '2', 'おすすめの映画やドラマは？', 'light'),

    // 3. 食・お店・旅行
    createQuestion('q3_1', '3', '最後の晩餐に何を食べたい？', 'normal'),
    createQuestion('q3_2', '3', '今までで一番美味しかった旅行先のご飯は？', 'normal'),

    // 7. 価値観
    createQuestion('q7_1', '7', '人生で一番大切にしている価値観は？', 'deep'),
    createQuestion('q7_2', '7', '尊敬する人は誰？その理由は？', 'deep'),

    // 10. 恋愛観
    createQuestion('q10_1', '10', '初デートで行きたい場所は？', 'light'),
    createQuestion('q10_2', '10', 'パートナーに求める一番の条件は？', 'normal'),
];
