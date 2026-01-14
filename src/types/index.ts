export type QuestionDepth = 'light' | 'normal' | 'deep';
export type QuestionRating = 'general' | 'adult';
export type QuestionStatus = 'approved' | 'pending' | 'rejected';

export interface Question {
    id: string;
    categoryId: string;
    text: string;
    depth: QuestionDepth;
    rating: QuestionRating;
    status: QuestionStatus;
    createdAt: number;
    updatedAt: number;
}

export interface Category {
    id: string;
    name: string;
    description: string;
}

export type AnswerMode = 'interactive' | 'everyone';

export interface Participant {
    id: string;
    name: string;
}

export interface Session {
    id: string;
    participants: Participant[];
    questionIds: string[];
    answerMode: AnswerMode;
    currentQuestionIndex: number;
    currentParticipantIndex: number;
    is18Plus: boolean;
    deepStartIndex: number; // Deep質問の開始位置
    shownDeepWarning: boolean; // Deep前の警告を表示済みか
    createdAt: number;
}

// クライアント識別子の取得/生成
export const getClientId = (): string => {
    if (typeof window === 'undefined') return '';
    let clientId = localStorage.getItem('clientId');
    if (!clientId) {
        clientId = crypto.randomUUID();
        localStorage.setItem('clientId', clientId);
    }
    return clientId;
};
