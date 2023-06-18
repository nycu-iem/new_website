import './globals.css'
import { Inter } from 'next/font/google'

import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
// import { useEffect, useRef } from 'react'
// import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: '陽明交大 工工系學會 | NYCU IEM SA',
    description: '國立陽明交通大學工業工程與管理學系 官方網站',
}

// function usePrevious(value: string) {
//     const ref = useRef<string>("");

//     useEffect(() => {
//         ref.current = value;
//     }, [value])

//     return ref.current;
// }


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // const router = useRouter();
    // const previousPathname = usePrevious(router.pathname);

    return (
        <html lang="zh-tw">
            <body className={inter.className}>
                <div className="fixed inset-0 flex justify-center sm:px-8">
                    <div className="flex w-full max-w-7xl lg:px-8">
                        <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
                    </div>
                </div>
                <div className="relative">
                    <Header />
                    <main>
                        {children}
                        {/* <Component previousPathname={previousPathname} {...pageProps} /> */}
                    </main>
                    <Footer />
                </div>

            </body>
        </html>
    )
}
