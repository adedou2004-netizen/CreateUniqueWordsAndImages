'use client';

import { useState } from 'react';
import { generatePrompt } from '@/lib/promptTemplate';
import { parseFile } from '@/lib/fileParser';
import { downloadTextFile, downloadZipFile } from '@/lib/fileGenerator';
import WordInput from '@/components/WordInput';
import PromptPreview from '@/components/PromptPreview';
import DownloadButton from '@/components/DownloadButton';

export default function PromptsPage() {
    const [mode, setMode] = useState<'single' | 'list'>('single');
    const [singleWord, setSingleWord] = useState('');
    const [wordList, setWordList] = useState<string[]>([]);
    const [fileName, setFileName] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleFileUpload = async (file: File) => {
        try {
            const words = await parseFile(file);
            setWordList(words);
            setFileName(file.name);
        } catch (error) {
            alert(`Error parsing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);

        try {
            if (mode === 'single') {
                if (!singleWord.trim()) {
                    alert('Please enter a word');
                    return;
                }
                const prompt = generatePrompt(singleWord);
                downloadTextFile(singleWord, prompt);
            } else {
                if (wordList.length === 0) {
                    alert('Please upload a file with words');
                    return;
                }
                const prompts = wordList.map(word => generatePrompt(word));
                await downloadZipFile(wordList, prompts);
            }

            // Small delay for UX
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            alert(`Error generating files: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const currentWord = mode === 'single' ? singleWord : wordList[0] || '';

    return (
        <div className="container">
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{
                    fontSize: '3.5rem',
                    color: 'white',
                    marginBottom: '0.5rem',
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    fontWeight: '700'
                }}>
                    ✨ AI Prompt Generator
                </h1>
                <p style={{
                    fontSize: '1.2rem',
                    color: 'rgba(255,255,255,0.9)',
                    textShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}>
                    Create child-friendly image prompts for vocabulary games
                </p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                gap: '2rem',
                marginBottom: '2rem'
            }}>
                <div className="glass-card fade-in">
                    <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                        Input
                    </h2>

                    <WordInput
                        mode={mode}
                        onModeChange={setMode}
                        singleWord={singleWord}
                        onSingleWordChange={setSingleWord}
                        onFileUpload={handleFileUpload}
                        fileName={fileName}
                        wordCount={wordList.length}
                    />
                </div>

                <div className="glass-card fade-in" style={{ animationDelay: '0.1s' }}>
                    <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                        Preview
                    </h2>

                    <PromptPreview word={currentWord} words={wordList} />
                </div>
            </div>

            <div className="fade-in" style={{ textAlign: 'center', animationDelay: '0.2s' }}>
                <DownloadButton
                    onClick={handleGenerate}
                    isGenerating={isGenerating}
                    mode={mode}
                    wordCount={wordList.length}
                />

                {mode === 'list' && wordList.length > 0 && (
                    <p style={{
                        marginTop: '1rem',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '0.9rem'
                    }}>
                        Will generate {wordList.length} prompt file{wordList.length !== 1 ? 's' : ''} in a ZIP archive
                    </p>
                )}
            </div>
        </div>
    );
}
