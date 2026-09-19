'use client';

import Link from 'next/link';

export default function Dashboard() {
    const cards = [
        {
            href: '/book-images',
            icon: '📚🖼️',
            title: 'Book Image Utility',
            description: 'Match Canva files named 1, 2, 3... to your vocabulary words and upload the whole batch to Supabase.',
        },
        {
            href: '/prompts',
            icon: '✨',
            title: 'Prompt Generator',
            description: 'Create child-friendly AI image prompts from one word or a vocabulary list.',
        },
    ];

    return (
        <div className="container">
            <header style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <h1 style={{
                    fontSize: '3.6rem',
                    color: 'white',
                    marginBottom: '1rem',
                    textShadow: '0 2px 15px rgba(0,0,0,0.3)',
                    fontWeight: '800'
                }}>
                    🧰 My Utility Hub
                </h1>
                <p style={{
                    fontSize: '1.25rem',
                    color: 'rgba(255,255,255,0.95)',
                    textShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    maxWidth: '760px',
                    margin: '0 auto',
                    lineHeight: 1.6,
                }}>
                    Small tools that you can open from any computer. For Canva book images,
                    start with the Book Image Utility.
                </p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2.5rem',
                maxWidth: '1000px',
                margin: '0 auto'
            }}>
                {cards.map((card, index) => (
                    <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
                        <div className="glass-card fade-in" style={{
                            animationDelay: `${index * 0.1}s`,
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
                            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>{card.icon}</div>
                            <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>{card.title}</h2>
                            <p style={{ color: 'rgba(255,255,255,0.76)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                                {card.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            <footer style={{
                marginTop: '5rem',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.55)',
                fontSize: '0.9rem'
            }}>
                Mamie Lemonde utility tools
            </footer>
        </div>
    );
}
