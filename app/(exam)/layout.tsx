import "../globals.css"
// import { Inter } from "next/font/google"
// import { SessionProvider } from "next-auth/react"
import { Providers } from "./(components)/providers"
import { Layout } from "./(components)/Layout"
import { getNavigationLinks } from "./notion_api"
// const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: '陽明交大 工工系學會 考古題 | NYCU IEMSA EXAM',
    description: '國立陽明交通大學工業工程與管理學系 官方網站',
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const sections = await getNavigationLinks();

    return (
        <body className="flex min-h-full bg-white antialiased dark:bg-zinc-900">
            <Providers>
                <div className="w-full">
                    <Layout allSections={sections}>
                        {children}
                    </Layout>
                </div>
            </Providers>
        </body>
    )
}

// export default async function RootLayout({ children }) {
//   let pages = await glob('**/*.mdx', { cwd: 'src/app' })
//   let allSections = await Promise.all(
//     pages.map(async (filename) => [
//       '/' + filename.replace(/(^|\/)page\.mdx$/, ''),
//       (await import(`./${filename}`)).sections,
//     ])
//   )
//   allSections = Object.fromEntries(allSections)

//   return (
//     <html lang="en" className="h-full" suppressHydrationWarning>
//       <body className="flex min-h-full bg-white antialiased dark:bg-zinc-900">
//         <Providers>
//           <div className="w-full">
//             <Layout allSections={allSections}>{children}</Layout>
//           </div>
//         </Providers>
//       </body>
//     </html>
//   )
// }
