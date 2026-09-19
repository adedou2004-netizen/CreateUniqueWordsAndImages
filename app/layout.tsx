import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
    title: 'Mamie Lemonde Utility Hub',
    description: 'Personal tools for vocabulary images and prompts',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${outfit.variable}`}>
                <nav style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    padding: '1rem 2rem',
                    background: 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <Link href="/" style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1.05rem',
                        textDecoration: 'none',
                    }}>
                        🏠 Tools
                    </Link>
                    <Link href="/book-images" style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1.05rem',
                        textDecoration: 'none',
                    }}>
                        📚 Book Images
                    </Link>
                    <Link href="/prompts" style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1.05rem',
                        textDecoration: 'none',
                    }}>
                        ✨ Prompts
                    </Link>
                </nav>
                <main style={{ paddingTop: '5rem' }}>
                    {children}
                </main>
            </body>
        </html>
    )
}
