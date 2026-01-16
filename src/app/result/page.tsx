'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { Header } from '@/components/layout/Header';
import { getSession, getAllQuestions } from '@/utils/db';
import { Question } from '@/types';
import styles from './page.module.css';

export default function ResultPage() {
    const router = useRouter();
    const [history, setHistory] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const sessionId = localStorage.getItem('currentSessionId');
            if (sessionId) {
                try {
                    const session = await getSession(sessionId);
                    if (session) {
                        const allQuestions = await getAllQuestions();
                        // 実際に表示された（現在のインデックスまでの）質問のみを表示
                        // インデックスは0から始まるため、+1問分を取得対象とする
                        const shownQuestionIds = session.questionIds.slice(0, session.currentQuestionIndex + 1);

                        const sessionValues = shownQuestionIds
                            .map(id => allQuestions.find(q => q.id === id))
                            .filter((q): q is Question => !!q);
                        setHistory(sessionValues);
                    }

                } catch (e) {
                    console.error('Failed to load session history', e);
                }
            }
            setLoading(false);
        };
        fetchHistory();
    }, []);

    return (
        <>
            <Header />
            <Container>
                <div className={styles.wrapper}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>終了！</h2>
                        <p>すべての質問が終わりました。<br />楽しんでもらえましたか？</p>
                    </div>

                    {!loading && history.length > 0 && (
                        <div className={styles.deepDiveSection}>
                            <h3 className={styles.sectionTitle}>🌙 深掘りタイム</h3>
                            <p className={styles.subTitle}>気になった質問を、もう一度話してみよう</p>

                            <div className={styles.questionList}>
                                {history.map((q, i) => (
                                    <div key={q.id} className={styles.questionItem}>
                                        <div>
                                            <span className={`${styles.depthLabel} ${styles[`depth-${q.depth}`]}`}>
                                                {q.depth}
                                            </span>
                                            <span className={styles.questionText}>{q.text}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <Button onClick={() => router.push('/')} fullWidth>
                            ホームに戻る
                        </Button>
                    </div>
                </div>
            </Container>
        </>
    );
}
