'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type VocabularyList = {
    id: number;
    title: string;
    language_code: string | null;
    source_type: string | null;
    updated_at: string | null;
};

type VocabularyItem = {
    id: string;
    position: number;
    raw_word: string | null;
    display_word: string | null;
    normalized_word: string | null;
    uploaded_image_url: string | null;
};

type MatchStatus = 'ready' | 'uploading' | 'uploaded' | 'error';

type ImageMatch = {
    file: File;
    position: number;
    item: VocabularyItem;
    outputName: string;
    status: MatchStatus;
    error?: string;
};

function wordForItem(item: VocabularyItem) {
    return item.normalized_word || item.display_word || item.raw_word || `word_${item.position}`;
}

function safeWord(value: string) {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[’']/g, '')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '') || 'word';
}

function extensionFor(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'jpeg') return 'jpg';
    if (ext && ['png', 'jpg', 'webp'].includes(ext)) return ext;

    if (file.type === 'image/png') return 'png';
    if (file.type === 'image/webp') return 'webp';
    return 'jpg';
}

function numberFromCanvaName(fileName: string) {
    const base = fileName.replace(/\.[^.]+$/, '').trim();

    // The normal workflow is 1.png, 2.png, 3.png ...
    const leading = base.match(/^(\d+)/);
    if (leading) return Number(leading[1]);

    // Also tolerate names such as "page_12" or "image-12".
    const anywhere = base.match(/(?:^|[^0-9])(\d+)(?:[^0-9]|$)/);
    return anywhere ? Number(anywhere[1]) : null;
}

export default function BookImagesPage() {
    const [authLoading, setAuthLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [email, setEmail] = useState('');
    const [authMessage, setAuthMessage] = useState('');
    const [lists, setLists] = useState<VocabularyList[]>([]);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [items, setItems] = useState<VocabularyItem[]>([]);
    const [loadingLists, setLoadingLists] = useState(false);
    const [loadingItems, setLoadingItems] = useState(false);
    const [matches, setMatches] = useState<ImageMatch[]>([]);
    const [unmatchedFiles, setUnmatchedFiles] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const selectedList = useMemo(
        () => lists.find(list => list.id === selectedListId) || null,
        [lists, selectedListId]
    );

    useEffect(() => {
        let mounted = true;

        async function loadSession() {
            const { data } = await supabase.auth.getSession();
            if (!mounted) return;
            setSession(data.session);
            await checkAdmin(data.session);
            setAuthLoading(false);
        }

        loadSession();

        const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
            setSession(nextSession);
            await checkAdmin(nextSession);
            setAuthLoading(false);
        });

        return () => {
            mounted = false;
            subscription.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (isAdmin) {
            loadLists();
        } else {
            setLists([]);
            setItems([]);
            setSelectedListId(null);
            setMatches([]);
        }
    }, [isAdmin]);

    useEffect(() => {
        if (isAdmin && selectedListId) {
            loadItems(selectedListId);
        } else {
            setItems([]);
            setMatches([]);
        }
    }, [selectedListId, isAdmin]);

    async function checkAdmin(currentSession: Session | null) {
        if (!currentSession?.user) {
            setIsAdmin(false);
            return;
        }

        const { data, error } = await supabase
            .from('users')
            .select('is_admin')
            .eq('auth_user_id', currentSession.user.id)
            .maybeSingle();

        if (error || !data?.is_admin) {
            setIsAdmin(false);
            setAuthMessage('This account is signed in, but it is not an administrator account.');
            return;
        }

        setIsAdmin(true);
        setAuthMessage('');
    }

    async function sendMagicLink() {
        if (!email.trim()) {
            setAuthMessage('Enter your email address first.');
            return;
        }

        setAuthMessage('Sending sign-in link...');

        const { error } = await supabase.auth.signInWithOtp({
            email: email.trim(),
            options: {
                emailRedirectTo: `${window.location.origin}/book-images`,
            },
        });

        if (error) {
            setAuthMessage(`Could not send the sign-in link: ${error.message}`);
            return;
        }

        setAuthMessage('Check your email and open the sign-in link. It will bring you back to this utility.');
    }

    async function signOut() {
        await supabase.auth.signOut();
        setSession(null);
        setIsAdmin(false);
    }

    async function loadLists() {
        setLoadingLists(true);

        const { data, error } = await supabase
            .from('vocabulary_lists')
            .select('id,title,language_code,source_type,updated_at')
            .order('updated_at', { ascending: false })
            .limit(100);

        if (error) {
            alert(`Could not load vocabulary lists: ${error.message}`);
        } else {
            setLists((data || []) as VocabularyList[]);
        }

        setLoadingLists(false);
    }

    async function loadItems(listId: number) {
        setLoadingItems(true);
        setMatches([]);
        setUnmatchedFiles([]);

        const { data, error } = await supabase
            .from('vocabulary_list_items')
            .select('id,position,raw_word,display_word,normalized_word,uploaded_image_url')
            .eq('vocabulary_list_id', listId)
            .order('position', { ascending: true });

        if (error) {
            alert(`Could not load the words for this list: ${error.message}`);
            setItems([]);
        } else {
            setItems((data || []) as VocabularyItem[]);
        }

        setLoadingItems(false);
    }

    function prepareImages(files: File[]) {
        if (!selectedListId || items.length === 0) {
            alert('Choose a vocabulary list first.');
            return;
        }

        const itemByPosition = new Map(items.map(item => [item.position, item]));
        const nextMatches: ImageMatch[] = [];
        const nextUnmatched: string[] = [];

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                nextUnmatched.push(`${file.name} (not an image)`);
                continue;
            }

            const position = numberFromCanvaName(file.name);
            if (!position) {
                nextUnmatched.push(`${file.name} (no number found)`);
                continue;
            }

            const item = itemByPosition.get(position);
            if (!item) {
                nextUnmatched.push(`${file.name} (no word at position ${position})`);
                continue;
            }

            const word = wordForItem(item);
            const outputName = `${selectedListId}_${position}_${safeWord(word)}.${extensionFor(file)}`;

            nextMatches.push({
                file,
                position,
                item,
                outputName,
                status: 'ready',
            });
        }

        nextMatches.sort((a, b) => a.position - b.position);
        setMatches(nextMatches);
        setUnmatchedFiles(nextUnmatched);
    }

    function handleFileInput(event: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(event.target.files || []);
        prepareImages(files);
    }

    async function uploadAll() {
        if (!selectedListId || matches.length === 0) return;

        setUploading(true);
        let completed = 0;
        let failed = 0;

        for (let index = 0; index < matches.length; index++) {
            const match = matches[index];

            setMatches(current =>
                current.map((row, rowIndex) =>
                    rowIndex === index ? { ...row, status: 'uploading', error: undefined } : row
                )
            );
            setProgress(`Uploading ${index + 1} of ${matches.length}: ${match.file.name}`);

            const { error: uploadError } = await supabase.storage
                .from('word-images')
                .upload(match.outputName, match.file, {
                    upsert: true,
                    cacheControl: '3600',
                    contentType: match.file.type || undefined,
                });

            if (uploadError) {
                failed++;
                setMatches(current =>
                    current.map((row, rowIndex) =>
                        rowIndex === index
                            ? { ...row, status: 'error', error: uploadError.message }
                            : row
                    )
                );
                continue;
            }

            const { error: updateError } = await supabase
                .from('vocabulary_list_items')
                .update({
                    uploaded_image_url: match.outputName,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', match.item.id);

            if (updateError) {
                failed++;
                setMatches(current =>
                    current.map((row, rowIndex) =>
                        rowIndex === index
                            ? { ...row, status: 'error', error: `Image uploaded, but database update failed: ${updateError.message}` }
                            : row
                    )
                );
                continue;
            }

            completed++;
            setMatches(current =>
                current.map((row, rowIndex) =>
                    rowIndex === index ? { ...row, status: 'uploaded' } : row
                )
            );
        }

        setUploading(false);
        setProgress(
            failed === 0
                ? `Finished: ${completed} image${completed === 1 ? '' : 's'} uploaded.`
                : `Finished: ${completed} uploaded, ${failed} failed.`
        );

        await loadItems(selectedListId);
    }

    if (authLoading) {
        return (
            <div className="container" style={{ textAlign: 'center', color: 'white', paddingTop: '6rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                Checking sign-in...
            </div>
        );
    }

    if (!session || !isAdmin) {
        return (
            <div className="container" style={{ maxWidth: '720px' }}>
                <div className="glass-card fade-in">
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>📚🖼️</div>
                        <h1 style={{ color: 'white', fontSize: '2.4rem', marginBottom: '0.75rem' }}>
                            Book Image Utility
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                            Sign in with your administrator email. This protects your Supabase image library
                            while still letting you use the utility from a library computer.
                        </p>
                    </div>

                    <label style={{ display: 'block', color: 'white', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Administrator email
                    </label>
                    <input
                        type="text"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        placeholder="your email"
                        onKeyDown={event => {
                            if (event.key === 'Enter') sendMagicLink();
                        }}
                    />

                    <button
                        className="btn btn-primary"
                        onClick={sendMagicLink}
                        style={{ width: '100%', marginTop: '1rem' }}
                    >
                        ✉️ Send me a sign-in link
                    </button>

                    {session && !isAdmin && (
                        <button
                            className="btn btn-secondary"
                            onClick={signOut}
                            style={{ width: '100%', marginTop: '0.75rem' }}
                        >
                            Sign out and use another account
                        </button>
                    )}

                    {authMessage && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            borderRadius: '12px',
                            background: 'rgba(0,0,0,0.2)',
                            color: 'white',
                            lineHeight: 1.5,
                        }}>
                            {authMessage}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const missingCount = items.filter(item => !item.uploaded_image_url).length;

    return (
        <div className="container">
            <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📚🖼️</div>
                <h1 style={{
                    fontSize: '3rem',
                    color: 'white',
                    marginBottom: '0.75rem',
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                }}>
                    Book Image Utility
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    color: 'rgba(255,255,255,0.9)',
                    maxWidth: '850px',
                    margin: '0 auto',
                    lineHeight: 1.6,
                }}>
                    In Canva, keep the image names simple: <strong>1, 2, 3, 4...</strong>.
                    This utility matches each number to the word in your Supabase vocabulary list,
                    renames it correctly, uploads it, and records the image on the matching word.
                </p>
            </header>

            <div className="glass-card fade-in" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                        <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.35rem' }}>
                            1. Choose the word list
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                            The list itself is your matching table. You do not have to type the word into Canva.
                        </p>
                    </div>
                    <button className="btn btn-secondary" onClick={signOut}>Sign out</button>
                </div>

                <select
                    value={selectedListId ?? ''}
                    onChange={event => {
                        const value = event.target.value;
                        setSelectedListId(value ? Number(value) : null);
                    }}
                    disabled={loadingLists}
                    style={{
                        width: '100%',
                        marginTop: '1.25rem',
                        padding: '0.9rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.25)',
                        background: '#2f285f',
                        color: 'white',
                        fontSize: '1rem',
                    }}
                >
                    <option value="">{loadingLists ? 'Loading lists...' : 'Select a vocabulary list'}</option>
                    {lists.map(list => (
                        <option key={list.id} value={list.id}>
                            #{list.id} — {list.title} {list.language_code ? `(${list.language_code})` : ''}
                        </option>
                    ))}
                </select>

                {selectedList && (
                    <div style={{
                        marginTop: '1rem',
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        color: 'white',
                    }}>
                        <span><strong>List ID:</strong> {selectedList.id}</span>
                        <span><strong>Words:</strong> {items.length}</span>
                        <span><strong>Missing images:</strong> {missingCount}</span>
                    </div>
                )}
            </div>

            {selectedListId && (
                <div className="glass-card fade-in" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                        2. Select the numbered Canva images
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                        Download the PNG/JPG files to a normal library-computer folder. Click below, press
                        <strong> Ctrl+A</strong> in the file window, then Open.
                    </p>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        multiple
                        onChange={handleFileInput}
                        style={{ display: 'none' }}
                    />

                    <button
                        className="btn btn-primary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loadingItems || items.length === 0}
                        style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
                    >
                        📂 Choose Canva Images
                    </button>

                    {loadingItems && (
                        <p style={{ color: 'white', textAlign: 'center', marginTop: '1rem' }}>Loading words...</p>
                    )}

                    {unmatchedFiles.length > 0 && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            borderRadius: '12px',
                            background: 'rgba(255, 193, 7, 0.15)',
                            color: 'white',
                        }}>
                            <strong>Not matched:</strong>
                            <div style={{ marginTop: '0.5rem', lineHeight: 1.6 }}>
                                {unmatchedFiles.join(', ')}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {matches.length > 0 && (
                <div className="glass-card fade-in" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                        3. Check the matches
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '1rem' }}>
                        Nothing is uploaded until you press the button below.
                    </p>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            color: 'white',
                            minWidth: '720px',
                        }}>
                            <thead>
                                <tr style={{ background: 'rgba(0,0,0,0.18)' }}>
                                    {['Canva file', '#', 'Word', 'Supabase filename', 'Status'].map(label => (
                                        <th key={label} style={{ textAlign: 'left', padding: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                                            {label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {matches.map((match, index) => (
                                    <tr key={`${match.file.name}-${index}`}>
                                        <td style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            {match.file.name}
                                        </td>
                                        <td style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            {match.position}
                                        </td>
                                        <td style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: 700 }}>
                                            {wordForItem(match.item)}
                                        </td>
                                        <td style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                            {match.outputName}
                                        </td>
                                        <td style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            {match.status === 'ready' && 'Ready'}
                                            {match.status === 'uploading' && '⏳ Uploading'}
                                            {match.status === 'uploaded' && '✅ Uploaded'}
                                            {match.status === 'error' && (
                                                <span title={match.error} style={{ color: '#ffd0d0' }}>❌ {match.error || 'Error'}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={uploadAll}
                        disabled={uploading}
                        style={{
                            width: '100%',
                            marginTop: '1.5rem',
                            fontSize: '1.15rem',
                            padding: '1rem',
                            opacity: uploading ? 0.7 : 1,
                        }}
                    >
                        {uploading ? '⏳ Uploading...' : `⬆️ Upload all ${matches.length} matched images`}
                    </button>

                    {progress && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            borderRadius: '12px',
                            background: 'rgba(0,0,0,0.2)',
                            color: 'white',
                            textAlign: 'center',
                            fontWeight: 600,
                        }}>
                            {progress}
                        </div>
                    )}
                </div>
            )}

            {selectedListId && items.length > 0 && (
                <div className="glass-card fade-in">
                    <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Word table
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '0.65rem',
                    }}>
                        {items.map(item => (
                            <div key={item.id} style={{
                                padding: '0.8rem',
                                borderRadius: '10px',
                                background: item.uploaded_image_url
                                    ? 'rgba(34, 197, 94, 0.18)'
                                    : 'rgba(255,255,255,0.08)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.12)',
                            }}>
                                <strong>{item.position}. {wordForItem(item)}</strong>
                                <div style={{ marginTop: '0.3rem', fontSize: '0.8rem', opacity: 0.75 }}>
                                    {item.uploaded_image_url ? '✅ image saved' : '○ no image yet'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
