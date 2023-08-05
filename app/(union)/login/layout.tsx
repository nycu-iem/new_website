import { SimpleLayout } from "../../../components/SimpleLayout"

export const metadata = {
    title: '陽明交大 工工系學會 認證系統 | NYCU IEMSA AUTH',
    description: '國立陽明交通大學工業工程與管理學系 官方網站',
}

export default function LoginLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <SimpleLayout title="登入" intro="">
            {children}
        </SimpleLayout>
    )
}