'use client';

interface DownloadButtonProps {
    onClick: () => void;
    isGenerating: boolean;
    mode: 'single' | 'list';
    wordCount: number;
}

export default function DownloadButton({
    onClick,
    isGenerating,
    mode,
    wordCount
}: DownloadButtonProps) {
    const isDisabled = isGenerating;

    return (
        <button
            className="btn btn-primary"
            onClick={onClick}
            disabled={isDisabled}
            style={{
                fontSize: '1.2rem',
                padding: '1rem 3rem',
                minWidth: '250px',
                opacity: isDisabled ? 0.7 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                position: 'relative'
            }}
        >
            {isGenerating ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span className="spinner"></span>
                    Generating...
                </span>
            ) : (
                <span>
                    {mode === 'single' ? '⬇️ Download Prompt' : `⬇️ Download ${wordCount} Prompts (ZIP)`}
                </span>
            )}
        </button>
    );
}
