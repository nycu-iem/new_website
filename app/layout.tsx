"use client"

import './globals.css'
import 'react-toastify/dist/ReactToastify.css';

import {
    ThemeProvider,
    useTheme
} from 'next-themes';

import { Suspense, useState } from 'react';
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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <html>
            <body>
                {children}
            </body>
        </html>;
    }

    return (
        <html lang="zh-tw">
            <body className={clsx(
                'flex min-h-full antialiased dark:bg-zinc-900 bg-white',
                inter.className
            )}>
                <SessionProvider>
                    <Suspense fallback={null} >
                        <ThemeProvider disableTransitionOnChange defaultTheme='system' attribute='class'>
                            {/* attribute="className" disableTransitionOnChange */}
                            <ThemeWatcher />
                            {children}
                        </ThemeProvider>
                    </Suspense>
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