'use client';

import { useState, useEffect } from 'react';
import { listFiles, deleteFile, getPublicUrl, formatFileSize, type StorageFile } from '@/lib/storageUtils';

interface ImageGridProps {
    bucket: string;
    path: string;
    refreshTrigger: number;
}

export default function ImageGrid({ bucket, path, refreshTrigger }: ImageGridProps) {
    const [files, setFiles] = useState<StorageFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        if (!bucket) return;

        async function fetchFiles() {
            setLoading(true);
            setError(null);
            try {
                const data = await listFiles(bucket, path);
                // Filter only image files
                const imageFiles = data.filter(file =>
                    file.metadata?.mimetype?.startsWith('image/')
                );
                setFiles(imageFiles);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load files');
            } finally {
                setLoading(false);
            }
        }

        fetchFiles();
    }, [bucket, path, refreshTrigger]);

    const handleDelete = async (fileName: string) => {
        if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
            return;
        }

        try {
            const filePath = path ? `${path}/${fileName}` : fileName;
            await deleteFile(bucket, filePath);
            setFiles(files.filter(f => f.name !== fileName));
            alert('File deleted successfully');
        } catch (err) {
            alert(`Failed to delete file: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    if (loading) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'rgba(255,255,255,0.7)'
            }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                Loading images...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#ff6b6b'
            }}>
                Error: {error}
            </div>
        );
    }

    if (files.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'rgba(255,255,255,0.6)'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
                <p style={{ fontSize: '1.2rem' }}>No images found</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Upload some images to get started
                </p>
            </div>
        );
    }

    return (
        <>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginTop: '2rem'
            }}>
                {files.map((file) => {
                    const filePath = path ? `${path}/${file.name}` : file.name;
                    const imageUrl = getPublicUrl(bucket, filePath);

                    return (
                        <div
                            key={file.id}
                            className="image-card"
                            style={{
                                position: 'relative',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                            onClick={() => setSelectedImage(imageUrl)}
                        >
                            <div style={{
                                position: 'relative',
                                paddingTop: '100%',
                                background: 'rgba(0,0,0,0.2)'
                            }}>
                                <img
                                    src={imageUrl}
                                    alt={file.name}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                            <div style={{
                                padding: '0.75rem',
                                background: 'rgba(0,0,0,0.3)'
                            }}>
                                <p style={{
                                    color: 'white',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    marginBottom: '0.25rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {file.name}
                                </p>
                                <p style={{
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: '0.75rem'
                                }}>
                                    {formatFileSize(file.metadata.size)}
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(file.name);
                                }}
                                className="delete-btn"
                                style={{
                                    position: 'absolute',
                                    top: '0.5rem',
                                    right: '0.5rem',
                                    background: 'rgba(255, 59, 48, 0.9)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.5rem',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    opacity: 0,
                                    transition: 'opacity 0.2s ease',
                                    fontWeight: 'bold'
                                }}
                            >
                                🗑️
                            </button>
                        </div>
                    );
                })}
            </div>

            {selectedImage && (
                <div
                    onClick={() => setSelectedImage(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        cursor: 'pointer',
                        padding: '2rem'
                    }}
                >
                    <img
                        src={selectedImage}
                        alt="Full size"
                        style={{
                            maxWidth: '90%',
                            maxHeight: '90%',
                            objectFit: 'contain',
                            borderRadius: '12px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        onClick={() => setSelectedImage(null)}
                        style={{
                            position: 'absolute',
                            top: '2rem',
                            right: '2rem',
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '3rem',
                            height: '3rem',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}
        </>
    );
}
