'use client';

import React from 'react';

interface HowToPlayModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
    if (!isOpen) return null;

    const steps = [
        {
            title: "名前を入力しよう",
            content: "一緒に話す相手の名前を入力して「開始」ボタンを押します。",
            icon: "🖊️"
        },
        {
            title: "質問に答えよう",
            content: "画面に表示された質問に交互に、あるいは全員で答えて対話を楽しんでください。",
            icon: "💬"
        },
        {
            title: "対話を深掘りしよう",
            content: "全ての質問が終わると、気になった話題をさらに深掘りできる「振り返りタイム」があります。",
            icon: "🔍"
        },
        {
            title: "新しい質問を投稿",
            content: "自分たちが考えたオリジナルの質問を登録して、他のユーザーとも共有できます（審査後に公開）。",
            icon: "✨"
        }
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content how-to-play" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>

                <h2 className="modal-title">遊び方ガイド</h2>

                <div className="steps-container">
                    {steps.map((step, index) => (
                        <div key={index} className="step-item">
                            <div className="step-icon">{step.icon}</div>
                            <div className="step-text">
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-desc">{step.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="modal-actions">
                    <button className="primary-button" onClick={onClose}>
                        わかった！
                    </button>
                </div>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                    animation: fadeIn 0.3s ease-out;
                }

                .modal-content.how-to-play {
                    background: rgba(30, 41, 59, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    padding: 32px;
                    width: 100%;
                    max-width: 440px;
                    position: relative;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .modal-title {
                    font-size: 1.5rem;
                    color: white;
                    margin-bottom: 24px;
                    text-align: center;
                    font-weight: 700;
                }

                .steps-container {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    margin-bottom: 32px;
                }

                .step-item {
                    display: flex;
                    gap: 16px;
                    align-items: flex-start;
                }

                .step-icon {
                    font-size: 1.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    flex-shrink: 0;
                }

                .step-title {
                    font-size: 1rem;
                    color: #e2e8f0;
                    margin-bottom: 4px;
                    font-weight: 600;
                }

                .step-desc {
                    font-size: 0.875rem;
                    color: #94a3b8;
                    line-height: 1.5;
                }

                .modal-close {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    background: none;
                    border: none;
                    color: #94a3b8;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 4px;
                    line-height: 1;
                }

                .modal-actions {
                    display: flex;
                    justify-content: center;
                }

                .primary-button {
                    background: linear-gradient(135deg, #275b91 0%, #1e4a7a 100%);
                    color: white;
                    border: none;
                    padding: 12px 40px;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }

                .primary-button:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.1);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
