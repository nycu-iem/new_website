import { Suspense } from "react";
import { Layout } from "./(components)/Layout"
import { getNavigationLinks } from "./notion_api"

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

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

    const session = await getServerSession(authOptions) ?? undefined;

    return (
        <div className="flex min-h-full bg-white antialiased dark:bg-zinc-900 w-full">
            <Suspense fallback={null}>
                <Layout allSections={posts}
                    session={session}
                >
                    {children}
                </Layout>
            </Suspense>
        </div>
    )
}

