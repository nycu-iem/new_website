import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // const router = useRouter();
    // const previousPathname = usePrevious(router.pathname);

    return (
        <html lang="zh-tw">
            {children}
            {/* <Component previousPathname={previousPathname} {...pageProps} /> */}
            <Analytics />
        </html>
    )
}
