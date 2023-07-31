import { SessionProvider } from "next-auth/react"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"

export const metadata = {
    title: '陽明交大 工工系學會 認證系統 | NYCU IEMSA AUTH',
    description: '國立陽明交通大學工業工程與管理學系 官方網站',
}

export default function AuthRootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <body>
            {children}
        </body>
    )
}