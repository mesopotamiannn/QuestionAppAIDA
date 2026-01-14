import { Category } from '@/types';

// 通常カテゴリ (12個)
export const CATEGORIES: Category[] = [
    { id: '1', name: '自己紹介', description: '基本情報や性格について' },
    { id: '2', name: '趣味・休日', description: '好きなことや過ごし方' },
    { id: '3', name: '食・お店・旅行', description: '食の好みや旅の思い出' },
    { id: '4', name: '子供時代', description: '幼い頃のエピソード' },
    { id: '5', name: '学校・青春', description: '学生時代の思い出' },
    { id: '6', name: '仕事・学び', description: '仕事観や勉強について' },
    { id: '7', name: '価値観・人生観', description: '何を大切に生きているか' },
    { id: '8', name: 'お金・生活習慣', description: '金銭感覚や日常の習慣' },
    { id: '9', name: '人間関係', description: '友人・家族との付き合い方' },
    { id: '10', name: '恋愛観（マイルド）', description: '理想の関係やタイプ' },
    { id: '11', name: '将来・夢', description: 'これからの目標や夢' },
    { id: '12', name: '内面・深掘り', description: '普段話さない深い話' },
];

// 18+カテゴリ (13番目)
export const ADULT_CATEGORY: Category = {
    id: 'adult',
    name: '大人の質問（18+）',
    description: '成人向けの刺激的な質問',
};

