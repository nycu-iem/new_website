import { SimpleLayout } from "components/SimpleLayout"

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
        <SimpleLayout title="登入"
            intro=""
            className="flex flex-col"
        >
            <div className="text-sm text-slate-600 pb-10 dark:text-slate-200">
                請使用自己的 NYCU 單一入口帳號登入本服務<br />
                若需登入他人帳號請使用無痕視窗等方式<br />
                因為你登入完就不能換帳號ㄌ (除非你到 <a href="https://id.nycu.edu.tw">交大oauth</a>刪除本網頁再重新登入
            </div>
            <div>
                {children}
            </div>
        </SimpleLayout>
    )
}