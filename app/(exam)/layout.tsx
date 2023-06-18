import "../globals.css"
import { Inter } from "next/font/google"


const inter = Inter({ subsets: ['latin'] });

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
        <html lang="zh-tw">
            <body>
                {children}
            </body>
        </html>
    )
}