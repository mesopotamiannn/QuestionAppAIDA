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

            // Shuffle within depth groups, then sort by depth order
            const depthOrder: Record<string, number> = { light: 0, normal: 1, deep: 2 };
            const shuffled = filtered.sort(() => 0.5 - Math.random());
            const sorted = shuffled.sort((a, b) => depthOrder[a.depth] - depthOrder[b.depth]);
            const selected = sorted.slice(0, questionCount);

            if (selected.length === 0) {
                throw new Error('No questions found for selected categories.');
            }

            // Calculate deepStartIndex
            const deepStartIndex = selected.findIndex(q => q.depth === 'deep');

            const questionIds = selected.map(q => q.id);

            // 2. Auto-fill participant names
            const autoFilledParticipants = participants.map((name, index) => {
                if (name.trim() === '') {
                    // 2人はA/B、3人以上は1/2/3...
                    if (participants.length === 2) {
                        return index === 0 ? 'Aさん' : 'Bさん';
                    } else {
                        return `${index + 1}さん`;
                    }
                }
                return name;
            });

            // 3. Create Session Object
            const newSession: Session = {
                id: crypto.randomUUID(),
                participants: autoFilledParticipants.map(name => ({ id: crypto.randomUUID(), name })),
                questionIds,
                answerMode: mode,
                currentQuestionIndex: 0,
                currentParticipantIndex: 0,
                is18Plus,
                deepStartIndex: deepStartIndex === -1 ? -1 : deepStartIndex, // -1 = no deep questions
                shownDeepWarning: false,
                createdAt: Date.now(),
            };

            // 4. Save to DB (Persistent session)
            await saveSession(newSession);

            // 5. Update State and Navigate
            setSession(newSession);
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

        let nextQuestionIndex = session.currentQuestionIndex;
        let nextParticipantIndex = session.currentParticipantIndex;

        if (session.answerMode === 'everyone') {
            // Everyone mode: Rotate participant, then question if all answered
            // Logic: 
            // - Increment participant index loopingly
            // - If we loop back to the first participant for this question, move to next question

            // NOTE: currentParticipantIndex points to WHOSE TURN IT IS.
            // When they click Next, it means they finished.

            // Check if this was the last participant for the current question
            // In a simple round-robin starting from 0:
            // 0 -> 1 -> ... -> last -> 0 (next question)
            // But we might want to rotate who starts. Use simple logic first:
            // 0 -> 1 -> ... -> last -> Next Q + Participant 0

            const isLastParticipant = nextParticipantIndex === session.participants.length - 1;

            if (isLastParticipant) {
                // All answered this question -> Next Question
                nextQuestionIndex++;
                nextParticipantIndex = 0; // Reset to first participant for new question
            } else {
                // Next participant for same question
                nextParticipantIndex++;
            }
        } else {
            // Interactive mode (Default): New Question + Next Participant
            nextQuestionIndex++;
            nextParticipantIndex = (session.currentParticipantIndex + 1) % session.participants.length;
        }

        if (nextQuestionIndex >= session.questionIds.length) {
            // Game Over
            router.push('/result');
            return;
        }

        const updatedSession = {
            ...session,
            currentQuestionIndex: nextQuestionIndex,
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

    // Mark deep warning as shown
    const markDeepWarningShown = useCallback(async () => {
        if (!session) return;
        const updatedSession = { ...session, shownDeepWarning: true };
        setSession(updatedSession);
        await saveSession(updatedSession);
    }, [session]);

    return {
        session,
        currentQuestion,
        loading,
        error,
        startSession,
        nextQuestion,
        resumeSession,
        markDeepWarningShown,
    };
};
