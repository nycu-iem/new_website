import { Layout } from "./(components)/Layout"
import { getNavigationLinks } from "./notion_api"

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const res = await getNavigationLinks();

    console.log(res)
    const posts = typeof res !== "undefined" ? res : [];

    return (
        <div className="flex min-h-full bg-white antialiased dark:bg-zinc-900 w-full">
            <Layout allSections={posts}>
                {children}
            </Layout>
        </div>
    )
}

