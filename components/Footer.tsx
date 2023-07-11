import Link from 'next/link'

import { OuterContainer, InnerContainer } from './Container'

const menuOptions: { title: string, href: string, blocked: boolean, reason?: string }[] = [
    {
        title: "關於系學會",
        href: "/about",
        blocked: false
    }, {
        title: "文章",
        href: "/articles",
        blocked: false
    }, {
        title: "相關活動",
        href: "/activities",
        blocked: false
    }, {
        title: "公開文件",
        href: "/docs",
        blocked: false
    }, {
        title: "系窩租借",
        href: "/booking",
        blocked: true,
        reason: "Not Yet Implemented"
    }, {
        title: "歷屆考古題",
        href: "/exams",
        blocked: true,
        reason: "Not Yet Implemented"
    }
]

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href}
            className="transition hover:text-teal-500 dark:hover:text-teal-400">
            {children}
        </Link>
    )
}

export function Footer() {
    return (
        <footer className="mt-32">
            <OuterContainer>
                <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
                    <InnerContainer>
                        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                {menuOptions.map(option => (
                                    <NavLink href={option.href} key={option.href}>{option.title}</NavLink>
                                ))}
                            </div>
                            <p className="text-sm text-zinc-400 dark:text-zinc-500">
                                &copy; {new Date().getFullYear()} NYCU IEM SA. All rights reserved.
                            </p>
                        </div>
                    </InnerContainer>
                </div>
            </OuterContainer>
        </footer>
    )
}
