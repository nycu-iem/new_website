"use client"

import './globals.css'
import 'react-toastify/dist/ReactToastify.css';

import {
    ThemeProvider,
    useTheme
} from 'next-themes';

import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react'
import { Inter } from 'next/font/google'
import Script from 'next/script';
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
                <SessionProvider>
                    <ThemeProvider disableTransitionOnChange defaultTheme='system' attribute='class'>
                        {/* attribute="className" disableTransitionOnChange */}
                        <ThemeWatcher />
                        {children}
                    </ThemeProvider>
                </SessionProvider>
                <Analytics />
                <Script id="ms-clarity" strategy="afterInteractive">
                    {`
                    (function(c,l,a,r,i,t,y){
                        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                    })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY}");
                    `}
                </Script>
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