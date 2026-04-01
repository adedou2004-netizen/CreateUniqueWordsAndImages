'use client';

import { useState, useEffect } from 'react';
import { generatePrompt } from '@/lib/promptTemplate';

interface PromptPreviewProps {
    word: string;
    words?: string[];
}

export default function PromptPreview({ word, words = [] }: PromptPreviewProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayWord, setDisplayWord] = useState(word);

    useEffect(() => {
        if (words.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % words.length);
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [words.length]);

    useEffect(() => {
        if (words.length > 0) {
            setDisplayWord(words[currentIndex]);
        } else {
            setDisplayWord(word);
        }
    }, [word, words, currentIndex]);

    const prompt = displayWord ? generatePrompt(displayWord) : '';

    return (
        <div>
            {displayWord ? (
                <>
                    <div style={{
                        marginBottom: '1rem',
                        padding: '0.75rem 1rem',
                        background: 'rgba(6, 182, 212, 0.2)',
                        borderRadius: '8px',
                        border: '1px solid rgba(6, 182, 212, 0.4)'
                    }}>
                        <div style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '0.85rem',
                            marginBottom: '0.25rem'
                        }}>
                            Current word:
                        </div>
                        <div style={{
                            color: 'white',
                            fontSize: '1.5rem',
                            fontWeight: 700
                        }}>
                            {displayWord}
                        </div>
                        {words.length > 1 && (
                            <div style={{
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '0.8rem',
                                marginTop: '0.25rem'
                            }}>
                                {currentIndex + 1} of {words.length}
                            </div>
                        )}
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div style={{
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '8px',
                            padding: '1rem',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            lineHeight: '1.6',
                            color: 'rgba(255,255,255,0.9)',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {prompt}
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(prompt);
                                const btn = document.getElementById('copy-btn');
                                if (btn) {
                                    const originalText = btn.innerText;
                                    btn.innerText = '✅ Copied!';
                                    btn.style.background = 'rgba(34, 197, 94, 0.4)';
                                    setTimeout(() => {
                                        btn.innerText = originalText;
                                        btn.style.background = 'rgba(255, 255, 255, 0.1)';
                                    }, 2000);
                                }
                            }}
                            id="copy-btn"
                            style={{
                                position: 'absolute',
                                top: '0.5rem',
                                right: '0.5rem',
                                padding: '0.4rem 0.8rem',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontWeight: '600',
                                backdropFilter: 'blur(5px)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                        >
                            📋 Copy
                        </button>
                    </div>
                </>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    color: 'rgba(255,255,255,0.6)'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👀</div>
                    <div>Enter a word or upload a file to see the prompt preview</div>
                </div>
            )}
        </div>
    );
}
