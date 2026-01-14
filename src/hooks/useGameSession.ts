import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Question, Session, Participant, AnswerMode } from '@/types';
import { getQuestionsByCategory, getAllQuestions, saveSession } from '@/utils/db';

interface UseGameSessionProps {
    initialSession?: Session;
}

export const useGameSession = () => {
    const router = useRouter();
    const [session, setSession] = useState<Session | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize a new session
    const startSession = useCallback(async (
        participants: string[],
        categoryIds: string[], // 複数カテゴリ対応
        questionCount: number,
        mode: AnswerMode,
        is18Plus: boolean
    ) => {
        setLoading(true);
        try {
            // 1. Fetch Questions
            let questions: Question[] = [];

            if (categoryIds.length === 0) {
                // 未選択 = 全カテゴリ（Adult除く）
                questions = await getAllQuestions();
                questions = questions.filter(q => q.rating === 'general');
            } else {
                // 選択されたカテゴリから取得
                const questionSets = await Promise.all(
                    categoryIds.map(id => getQuestionsByCategory(id))
                );
                questions = questionSets.flat();
            }

            // Filter by rating
            const filtered = questions.filter(q => {
                // Adult質問はadultカテゴリが選択されている場合のみ
                if (q.rating === 'adult') {
                    return categoryIds.includes('adult');
                }
                return true;
            });

            // Shuffle and Slice
            const shuffled = filtered.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, questionCount);

            if (selected.length === 0) {
                throw new Error('No questions found for selected categories.');
            }

            const questionIds = selected.map(q => q.id);

            // 2. Create Session Object
            const newSession: Session = {
                id: crypto.randomUUID(),
                participants: participants.map(name => ({ id: crypto.randomUUID(), name })),
                questionIds,
                answerMode: mode,
                currentQuestionIndex: 0,
                currentParticipantIndex: 0,
                is18Plus,
                createdAt: Date.now(),
            };

            // 3. Save to DB (Persistent session)
            await saveSession(newSession);

            // 4. Update State and Navigate
            setSession(newSession);
            // In a real app we might redirect here, but we'll let the component decide
            localStorage.setItem('currentSessionId', newSession.id);

            return newSession;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to start session');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Load question detail
    useEffect(() => {
        if (!session) return;

        // In a real optimized app, we would cache these questions or fetch by ID
        // For now, let's re-fetch or assume we loaded them. 
        // To ensure accuracy, let's fetch the current question by ID.
        // Or simpler: We already fetched all questions?? No, we only saved IDs.

        const fetchCurrentQuestion = async () => {
            const currentId = session.questionIds[session.currentQuestionIndex];
            // This is inefficient (getting all to find one), 
            // but fine for MVP with IndexedDB and small dataset.
            // Better: getById(id) in db.ts
            const all = await getAllQuestions();
            const q = all.find(q => q.id === currentId);
            setCurrentQuestion(q || null);
        };

        fetchCurrentQuestion();
    }, [session?.currentQuestionIndex, session?.questionIds]);

    const nextQuestion = useCallback(async () => {
        if (!session) return;

        const nextIndex = session.currentQuestionIndex + 1;

        if (nextIndex >= session.questionIds.length) {
            // Game Over
            router.push('/result');
            return;
        }

        // Rotate participant
        const nextParticipantIndex = (session.currentParticipantIndex + 1) % session.participants.length;

        const updatedSession = {
            ...session,
            currentQuestionIndex: nextIndex,
            currentParticipantIndex: nextParticipantIndex
        };

        setSession(updatedSession);
        await saveSession(updatedSession);
    }, [session, router]);

    // Load session by ID
    const resumeSession = useCallback(async (sessionId: string) => {
        setLoading(true);
        try {
            const db = await import('@/utils/db');
            const savedSession = await db.getSession(sessionId);
            if (savedSession) {
                setSession(savedSession);
            } else {
                setError('Session not found');
            }
        } catch (err) {
            setError('Failed to resume session');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        session,
        currentQuestion,
        loading,
        error,
        startSession,
        nextQuestion,
        resumeSession,
    };
};
