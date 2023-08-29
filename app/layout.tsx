"use client"

import './globals.css'
import 'react-toastify/dist/ReactToastify.css';

import {
    ThemeProvider,
    useTheme
} from 'next-themes';

import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react';

import { Inter } from 'next/font/google' 
import clsx from 'clsx';
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="zh-tw">
            <body className={clsx(
                'flex min-h-full bg-white antialiased dark:bg-zinc-900',
                inter.className
            )}>
                <ThemeProvider disableTransitionOnChange defaultTheme='system' attribute='class'> 
                    {/* attribute="className" disableTransitionOnChange */}
                    <ThemeWatcher />
                    {children}
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    )
}


function ThemeWatcher() {
    const { resolvedTheme, setTheme } = useTheme()

    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)')

        function onMediaChange() {
            let systemTheme = media.matches ? 'dark' : 'light'
            if (resolvedTheme === systemTheme) {
                setTheme('system')
            }
        }

        onMediaChange()
        media.addEventListener('change', onMediaChange)

        return () => {
            media.removeEventListener('change', onMediaChange)
        }
    }, [resolvedTheme, setTheme])

    return null
}