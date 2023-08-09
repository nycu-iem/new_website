'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from './Button'
// import { navigation } from './Navigation'
import React from 'react'

import {
    DiscordIcon,
    TwitterIcon,
    GitHubIcon
} from "../../../components/Icon"

import { FirstLayerOfPost } from '../notion_api'

function PageLink({
    label,
    page,
    previous = false,
}: {
    label: string,
    page: any,
    previous?: boolean
}) {
    return (
        <>
            <Button href={page.href}
                aria-label={`${label}: ${page.title}`}
                variant="secondary"
                arrow={previous ? 'left' : 'right'}
            >
                {label}
            </Button>
            <Link
                href={page.href}
                tabIndex={-1}
                aria-hidden="true"
                className="text-base font-semibold text-zinc-900 transition hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300"
            >
                {page.title}
            </Link>
        </>
    )
}

const decompressArray = (sections: Array<FirstLayerOfPost>, pathPrefix?: string) => {
    let subsets: Array<FirstLayerOfPost> = [];

    sections.map((section) => {
        subsets = [
            ...subsets,
            {
                title: section.title,
                id: section.id
            },
            ...decompressArray(section.children ?? [], pathPrefix = `/${section.id}`)
        ]
    })
    return subsets;
}

function PageNavigation({
    sections
}: {
    sections: Array<FirstLayerOfPost>
}) {
    const pathname = usePathname()
    const allPages = decompressArray(sections);
    const allLinks = allPages.flatMap((group) => group.id);
    const currentPageIndex = allLinks.findIndex((page) => page === pathname)

    if (currentPageIndex === -1) {
        return null
    }

    const previousPage = allPages[currentPageIndex - 1]
    const nextPage = allPages[currentPageIndex + 1]

    if (!previousPage && !nextPage) {
        return null
    }

    return (
        <div className="flex">
            {previousPage && (
                <div className="flex flex-col items-start gap-3">
                    <PageLink label="Previous" page={previousPage} previous />
                </div>
            )}
            {nextPage && (
                <div className="ml-auto flex flex-col items-end gap-3">
                    <PageLink label="Next" page={nextPage} />
                </div>
            )}
        </div>
    )
}

// function SocialLink({
//     href,
//     icon: Icon,
//     children
// }: {
//     href: string,
//     icon: JSX.Element,
//     children: React.ReactNode
// }) {
//     return (
//         <Link href={href} className="group">
//             <span className="sr-only">{children}</span>
//             <Icon className="h-5 w-5 fill-zinc-700 transition group-hover:fill-zinc-900 dark:group-hover:fill-zinc-500" />
//         </Link>
//     )
// }

function SmallPrint() {
    return (
        <div className="flex flex-col items-center justify-between gap-5 border-t border-zinc-900/5 pt-8 dark:border-white/5 sm:flex-row">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
                &copy; Copyright {new Date().getFullYear()}. All rights reserved.
            </p>
            <div className="flex gap-4">
                <Link href="#" className="group">
                    <span className="sr-only">Follow us on twitter</span>
                    <TwitterIcon className="h-5 w-5 fill-zinc-700 transition group-hover:fill-zinc-900 dark:group-hover:fill-zinc-500" />
                </Link>
                <Link href="href" className='group'>
                    <span className='sr-only'>Follow us on Github</span>
                    <GitHubIcon className="h-5 w-5 fill-zinc-700 transition group-hover:fill-zinc-900 dark:group-hover:fill-zinc-500" />
                </Link>
                <Link href="href" className='group'>
                    <span className='sr-only'>Join our Discord server</span>
                    <DiscordIcon className="h-5 w-5 fill-zinc-700 transition group-hover:fill-zinc-900 dark:group-hover:fill-zinc-500" />
                </Link>
            </div>
        </div>
    )
}

export function Footer({
    sections = []
}: {
    sections: Array<FirstLayerOfPost>
}) {
    return (
        <footer className="mx-auto w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
            <PageNavigation sections={sections} />
            <SmallPrint />
        </footer>
    )
}
