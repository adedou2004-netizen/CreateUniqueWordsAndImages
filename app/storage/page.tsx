'use client';

import { useState } from 'react';
import BucketSelector from '@/components/BucketSelector';
import ImageGrid from '@/components/ImageGrid';
import UploadZone from '@/components/UploadZone';

export default function StoragePage() {
    const [selectedBucket, setSelectedBucket] = useState('');
    const [currentPath, setCurrentPath] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleUploadComplete = () => {
        // Trigger refresh of image grid
        setRefreshTrigger(prev => prev + 1);
    };

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
                    🗄️ Supabase Storage Manager
                </h1>
                <p style={{
                    fontSize: '1.2rem',
                    color: 'rgba(255,255,255,0.9)',
                    textShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}>
                    Manage your Supabase storage buckets and images
                </p>
            </header>

            <div className="glass-card fade-in" style={{ marginBottom: '2rem' }}>
                <BucketSelector
                    selectedBucket={selectedBucket}
                    onBucketChange={setSelectedBucket}
                />

                {selectedBucket && (
                    <div style={{ marginTop: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            color: 'white',
                            marginBottom: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: '500'
                        }}>
                            Folder Path (optional)
                        </label>
                        <input
                            type="text"
                            value={currentPath}
                            onChange={(e) => setCurrentPath(e.target.value)}
                            placeholder="e.g., word-images/guess50"
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                fontSize: '1rem',
                                borderRadius: '12px',
                                border: '2px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'rgba(147, 51, 234, 0.5)';
                                e.target.style.background = 'rgba(255,255,255,0.08)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                e.target.style.background = 'rgba(255,255,255,0.05)';
                            }}
                        />
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'rgba(255,255,255,0.5)',
                            marginTop: '0.5rem'
                        }}>
                            Leave empty for root directory
                        </p>
                    </div>
                )}
            </div>

            {selectedBucket && (
                <>
                    <div className="glass-card fade-in" style={{ animationDelay: '0.1s', marginBottom: '2rem' }}>
                        <h2 style={{
                            color: 'white',
                            fontSize: '1.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            📤 Upload Images
                        </h2>
                        <UploadZone
                            bucket={selectedBucket}
                            path={currentPath}
                            onUploadComplete={handleUploadComplete}
                        />
                    </div>

                    <div className="glass-card fade-in" style={{ animationDelay: '0.2s' }}>
                        <h2 style={{
                            color: 'white',
                            fontSize: '1.5rem',
                            marginBottom: '1rem'
                        }}>
                            🖼️ Images
                        </h2>
                        <ImageGrid
                            bucket={selectedBucket}
                            path={currentPath}
                            refreshTrigger={refreshTrigger}
                        />
                    </div>
                </>
            )}

            {!selectedBucket && (
                <div className="glass-card fade-in" style={{
                    textAlign: 'center',
                    padding: '4rem 2rem'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>☁️</div>
                    <p style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '1.2rem'
                    }}>
                        Select a bucket to get started
                    </p>
                </div>
            )}
        </div>
    );
}
