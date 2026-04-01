'use client';

import Link from 'next/link';

export default function Dashboard() {
    return (
        <div className="container">
            <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{
                    fontSize: '4rem',
                    color: 'white',
                    marginBottom: '1rem',
                    textShadow: '0 2px 15px rgba(0,0,0,0.3)',
                    fontWeight: '800'
                }}>
                    🚀 Admin Hub
                </h1>
                <p style={{
                    fontSize: '1.4rem',
                    color: 'rgba(255,255,255,0.95)',
                    textShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>
                    Select a tool to manage your application
                </p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2.5rem',
                maxWidth: '1000px',
                margin: '0 auto'
            }}>
                <Link href="/storage" style={{ textDecoration: 'none' }}>
                    <div className="glass-card fade-in" style={{
                        textAlign: 'center',
                        padding: '3rem 2rem',
                        cursor: 'pointer',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🗄️</div>
                        <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>Storage Manager</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
                            Upload, view, and delete images in your Supabase buckets.
                        </p>
                    </div>
                </Link>

                <Link href="/prompts" style={{ textDecoration: 'none' }}>
                    <div className="glass-card fade-in" style={{
                        animationDelay: '0.1s',
                        textAlign: 'center',
                        padding: '3rem 2rem',
                        cursor: 'pointer',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>✨</div>
                        <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>Prompt Generator</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
                            Create AI prompts for vocabulary images from words or files.
                        </p>
                    </div>
                </Link>
            </div>

            <footer style={{
                marginTop: '6rem',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.9rem'
            }}>
                &copy; 2024 AdminSupabase • Modern Tools for Modern Apps
            </footer>
        </div>
    );
}
