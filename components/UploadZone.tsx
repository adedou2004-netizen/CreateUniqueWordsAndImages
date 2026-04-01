'use client';

import { useState } from 'react';
import { uploadFile } from '@/lib/storageUtils';

interface UploadZoneProps {
    bucket: string;
    path: string;
    onUploadComplete: () => void;
}

export default function UploadZone({ bucket, path, onUploadComplete }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState<string>('');

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        await handleFiles(files);
    };

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            await handleFiles(files);
        }
    };

    const handleFiles = async (files: File[]) => {
        if (!bucket) {
            alert('Please select a bucket first');
            return;
        }

        setUploading(true);
        let successCount = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}`);

            try {
                const filePath = path ? `${path}/${file.name}` : file.name;
                await uploadFile(bucket, filePath, file);
                successCount++;
            } catch (error) {
                console.error(`Failed to upload ${file.name}:`, error);
                alert(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }

        setUploading(false);
        setProgress('');

        if (successCount > 0) {
            alert(`Successfully uploaded ${successCount} file${successCount !== 1 ? 's' : ''}`);
            onUploadComplete();
        }
    };

    return (
        <div style={{ marginBottom: '2rem' }}>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                    border: `2px dashed ${isDragging ? 'rgba(147, 51, 234, 0.8)' : 'rgba(255,255,255,0.2)'}`,
                    borderRadius: '16px',
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    background: isDragging ? 'rgba(147, 51, 234, 0.1)' : 'rgba(255,255,255,0.03)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                }}
            >
                {uploading ? (
                    <div>
                        <div style={{
                            fontSize: '2rem',
                            marginBottom: '1rem',
                            animation: 'spin 1s linear infinite'
                        }}>
                            ⏳
                        </div>
                        <p style={{ color: 'white', fontSize: '1rem' }}>{progress}</p>
                    </div>
                ) : (
                    <>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📤</div>
                        <p style={{
                            color: 'white',
                            fontSize: '1.2rem',
                            marginBottom: '0.5rem'
                        }}>
                            Drag & Drop Images Here
                        </p>
                        <p style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.9rem',
                            marginBottom: '1.5rem'
                        }}>
                            or click to browse
                        </p>
                        <label style={{
                            display: 'inline-block',
                            padding: '0.75rem 2rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            transition: 'transform 0.2s ease',
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Choose Files
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileInput}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </>
                )}
            </div>
        </div>
    );
}
