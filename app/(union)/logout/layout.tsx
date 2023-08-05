import { SimpleLayout } from "../../../components/SimpleLayout"

export const metadata = {
    title: '陽明交大 工工系學會 認證系統 登出 | NYCU IEMSA AUTH Logout',
    description: '國立陽明交通大學工業工程與管理學系 官方網站',
}

export default function LogoutLayout({
    children
}: {
    children: React.ReactNode
}
) {
    return (
        <SimpleLayout title="登出" intro="">
            {children}
        </SimpleLayout>
    )
}