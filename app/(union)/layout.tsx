import 'react-toastify/dist/ReactToastify.css';

import { Footer } from "components/Footer"
import { Header } from "components/Header"

export const metadata = {
    title: '陽明交大 工工系學會 | NYCU IEM SA',
    description: '國立陽明交通大學工業工程與管理學系 官方網站',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <div className="flex h-full flex-col bg-zinc-50 w-full">
            <div className="fixed inset-0 flex justify-center sm:px-8">
                <div className="flex w-full max-w-7xl lg:px-8">
                    <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
                </div>
            </div>
            <div className="relative">
                <Header />
                <main>
                    {children}
                </main>
                <Footer />
            </div>

        </div>
    )
}
