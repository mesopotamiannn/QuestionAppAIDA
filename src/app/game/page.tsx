'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useGameSession } from '@/hooks/useGameSession';
import { getClientId } from '@/types';
import { CATEGORIES, ADULT_CATEGORY } from '@/data/categories';
import styles from './page.module.css';

export default function GamePage() {
    const { session, currentQuestion, resumeSession, nextQuestion, markDeepWarningShown, loading } = useGameSession();
    const router = useRouter();
    const [showDeepWarning, setShowDeepWarning] = useState(false);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const sessionId = localStorage.getItem('currentSessionId');
        if (!sessionId) {
            router.push('/');
            return;
        }
        if (!session) {
            resumeSession(sessionId);
        }
    }, [resumeSession, session, router]);

    // Deep質問前のワンクッション表示判定
    useEffect(() => {
        if (session && !session.shownDeepWarning && session.deepStartIndex !== -1) {
            if (session.currentQuestionIndex === session.deepStartIndex) {
                setShowDeepWarning(true);
            }
        }
    }, [session]);

    // いいね状態のリセット（質問が変わったら）
    useEffect(() => {
        setLiked(false);
    }, [currentQuestion?.id]);

    const handleDeepContinue = async () => {
        await markDeepWarningShown();
        setShowDeepWarning(false);
    };

    const handleLike = async () => {
        if (!currentQuestion || liked) return;
        setLiked(true);
        try {
            await fetch(`/api/questions/${currentQuestion.id}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId: getClientId() }),
            });
        } catch (e) {
            console.error('Like failed:', e);
        }
    };

    if (loading || !session || !currentQuestion) {
        return (
            <Container>
                <div className={styles.loading}>Loading...</div>
            </Container>
        );
    }

    const currentParticipant = session.participants[session.currentParticipantIndex];

    return (
        <>
            <Header />
            <Container>
                <div className={styles.gameWrapper}>
                    <div className={styles.status}>
                        <span className={styles.progress}>
                            Q. {session.currentQuestionIndex + 1} / {session.questionIds.length}
                        </span>
                        <span className={styles.categoryBadge}>
                            {currentQuestion.depth === 'deep' ? 'Deep' : currentQuestion.depth === 'light' ? 'Light' : 'Normal'}
                        </span>
                    </div>

                    <div className={styles.questionArea}>
                        <div className={styles.turnLabel}>
                            次は <span className={styles.participantName}>{currentParticipant.name}</span> さんの番です
                        </div>

                        <Card className={styles.questionCard}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '0.5rem', opacity: 0.8 }}>
                                #{([...CATEGORIES, ADULT_CATEGORY].find(c => c.id === currentQuestion.categoryId)?.name || 'その他')}
                            </div>
                            <p className={styles.questionText}>{currentQuestion.text}</p>
                        </Card>

                        <button className={styles.likeButton} onClick={handleLike} disabled={liked}>
                            {liked ? '👍 いいね！' : '👍'}
                        </button>
                    </div>

                    <div className={styles.actions}>
                        <Button fullWidth onClick={nextQuestion} size="large">
                            次へ
                        </Button>
                        <Button variant="ghost" fullWidth onClick={() => router.push('/result')} style={{ marginTop: '0.5rem' }}>
                            中断して終了する
                        </Button>
                    </div>

                </div>
            </Container>

            {/* Deep質問前のワンクッションモーダル */}
            <Modal isOpen={showDeepWarning}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
                    🌙 ここから少し深い質問です
                </h3>
                <div style={{ marginBottom: '1.5rem', lineHeight: '1.8', fontSize: '0.95rem' }}>
                    <p>・無理に答えなくてOK</p>
                    <p>・言いにくければスキップOK</p>
                    <p>・相手が嫌がったら別の話題に</p>
                </div>
                <Button fullWidth onClick={handleDeepContinue}>
                    OK、進む
                </Button>
            </Modal>
        </>
    );
}
