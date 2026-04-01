'use client';

import { useState, useEffect } from 'react';
import { listBuckets } from '@/lib/storageUtils';

interface Bucket {
    id: string;
    name: string;
    public: boolean;
}

interface BucketSelectorProps {
    selectedBucket: string;
    onBucketChange: (bucket: string) => void;
}

export default function BucketSelector({ selectedBucket, onBucketChange }: BucketSelectorProps) {
    const [buckets, setBuckets] = useState<Bucket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBuckets() {
            try {
                const data = await listBuckets();
                setBuckets(data);
                if (data.length > 0 && !selectedBucket) {
                    onBucketChange(data[0].name);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load buckets');
            } finally {
                setLoading(false);
            }
        }
        fetchBuckets();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '1rem', color: 'rgba(255,255,255,0.7)' }}>
                Loading buckets...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '1rem', color: '#ff6b6b' }}>
                Error: {error}
            </div>
        );
    }

    return (
        <div style={{ marginBottom: '2rem' }}>
            <label style={{
                display: 'block',
                color: 'white',
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '500'
            }}>
                Storage Bucket
            </label>
            <select
                value={selectedBucket}
                onChange={(e) => onBucketChange(e.target.value)}
                style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    fontSize: '1rem',
                    borderRadius: '12px',
                    border: '2px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(147, 51, 234, 0.5)';
                    e.target.style.background = 'rgba(255,255,255,0.08)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                }}
            >
                {buckets.map((bucket) => (
                    <option key={bucket.id} value={bucket.name} style={{ background: '#1a1a2e', color: 'white' }}>
                        {bucket.name} {bucket.public ? '(Public)' : '(Private)'}
                    </option>
                ))}
            </select>
        </div>
    );
}
