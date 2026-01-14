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
    createdAt: number;
}
