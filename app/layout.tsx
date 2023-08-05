"use client"
import { Analytics } from '@vercel/analytics/react';
// import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // const router = useRouter();
    // const previousPathname = usePrevious(router.pathname);

    return (
        <html lang="zh-tw">
            {/* <SessionProvider > */}
                {children}
            {/* </SessionProvider> */}
            {/* <Component previousPathname={previousPathname} {...pageProps} /> */}
            <Analytics />
        </html>
    )
}
