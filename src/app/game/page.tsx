'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useGameSession } from '@/hooks/useGameSession';
import styles from './page.module.css';

export default function GamePage() {
    const { session, currentQuestion, resumeSession, nextQuestion, loading } = useGameSession();
    const router = useRouter();

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
                            {currentQuestion.depth === 'deep' ? 'Deep' : 'Normal'}
                        </span>
                    </div>

                    <div className={styles.questionArea}>
                        <div className={styles.turnLabel}>
                            次は <span className={styles.participantName}>{currentParticipant.name}</span> さんの番です
                        </div>

                        <Card className={styles.questionCard}>
                            <p className={styles.questionText}>{currentQuestion.text}</p>
                        </Card>
                    </div>

                    <div className={styles.actions}>
                        <Button fullWidth onClick={nextQuestion} size="large">
                            次へ
                        </Button>
                    </div>
                </div>
            </Container>
        </>
    );
}
