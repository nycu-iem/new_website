import { Suspense } from "react";
import { Layout } from "./(components)/Layout"
import { getNavigationLinks } from "./notion_api"

export const metadata = {
    title: '陽明交大 工工系學會 考古題網站 | NYCU IEMSA EXAM',
    description: '國立陽明交通大學工業工程與管理學系 官方網站',
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const res = await getNavigationLinks();

    const posts = res.filter(t => true) ?? []

    return (
        <div className="flex min-h-full bg-white antialiased dark:bg-zinc-900 w-full">
            <Suspense fallback={null}>
                    {children}
                {/* <Layout allSections={posts}>
                </Layout> */}
            </Suspense>
        </div>
    )
}

