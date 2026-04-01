'use client';

import { useRef } from 'react';

interface WordInputProps {
    mode: 'single' | 'list';
    onModeChange: (mode: 'single' | 'list') => void;
    singleWord: string;
    onSingleWordChange: (word: string) => void;
    onFileUpload: (file: File) => void;
    fileName: string;
    wordCount: number;
}

export default function WordInput({
    mode,
    onModeChange,
    singleWord,
    onSingleWordChange,
    onFileUpload,
    fileName,
    wordCount,
}: WordInputProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div>
            {/* Mode Toggle */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1.5rem',
                background: 'rgba(255,255,255,0.1)',
                padding: '0.5rem',
                borderRadius: '12px'
            }}>
                <button
                    className={mode === 'single' ? 'btn btn-primary' : 'btn btn-secondary'}
                    onClick={() => onModeChange('single')}
                    style={{ flex: 1 }}
                >
                    📝 Single Word
                </button>
                <button
                    className={mode === 'list' ? 'btn btn-primary' : 'btn btn-secondary'}
                    onClick={() => onModeChange('list')}
                    style={{ flex: 1 }}
                >
                    📁 Word List
                </button>
            </div>

            {/* Input Area */}
            {mode === 'single' ? (
                <div>
                    <label style={{
                        display: 'block',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '0.5rem',
                        fontWeight: 500
                    }}>
                        Enter a word:
                    </label>
                    <input
                        type="text"
                        value={singleWord}
                        onChange={(e) => onSingleWordChange(e.target.value)}
                        placeholder="e.g., apple"
                        style={{ fontSize: '1.1rem' }}
                    />
                </div>
            ) : (
                <div>
                    <label style={{
                        display: 'block',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '0.5rem',
                        fontWeight: 500
                    }}>
                        Upload a file:
                    </label>

                    <div
                        className="file-upload"
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".txt,.csv,.xlsx,.xls"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />

                        {fileName ? (
                            <div>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
                                <div style={{ color: 'white', fontWeight: 600, marginBottom: '0.25rem' }}>
                                    {fileName}
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                                    {wordCount} word{wordCount !== 1 ? 's' : ''} loaded
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📤</div>
                                <div style={{ color: 'white', fontWeight: 600, marginBottom: '0.25rem' }}>
                                    Click to browse or drag & drop
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                                    Supports .txt, .csv, .xlsx files
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
