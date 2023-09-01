"use client"

import React, { forwardRef, Dispatch, SetStateAction, useState, useRef } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import { Button } from './Button'
import { Logo } from './Logo'
import {
    MobileNavigation,
    useIsInsideMobileNavigation,
} from './MobileNavigation'
import { useMobileNavigationStore } from './MobileNavigation'
import { MobileSearch, Search } from './Search'
import { ThemeToggle } from './ThemeToggle'
import { FirstLayerOfPost } from '../notion_api'
import { useSession } from 'next-auth/react'

function TopLevelNavItem({
    href,
    children
}: {
    href: string,
    children: React.ReactNode
}) {
    return (
        <li>
            <Link href={href ?? ''}
                className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
                {children}
            </Link>
        </li>
    )
}

export const Header = forwardRef(function Header({
    className,
    sections,
    semester,
    setSemester,
    sectionSelected,
    setSectionSelected,
}: {
    sections: Array<FirstLayerOfPost>
    className?: string
    semester: "first" | "second" | "summer",
    setSemester: Dispatch<SetStateAction<"first" | "second" | "summer">>,
    sectionSelected: Array<FirstLayerOfPost>,
    setSectionSelected: Dispatch<SetStateAction<Array<FirstLayerOfPost>>>,
}, ref: React.ForwardedRef<HTMLDivElement>) {
    const { isOpen: mobileNavIsOpen } = useMobileNavigationStore()
    const isInsideMobileNavigation = useIsInsideMobileNavigation()

    const { scrollY } = useScroll()
    const bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9])
    const bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8])
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    const { data: session, status } = useSession()
    
    type ExtendedSession = typeof session & {
        user: {
            student_id: string
        }
    }

    const setSettings = () => {
        // console.log(document.activeElement)
        // console.log(settingsRef.current)
        // console.log(document.activeElement)
        switch (document.activeElement?.id) {
            case 'nav_btn':
                // console.log('button')
                setSettingsOpen(p => !p);
                return;
            case 'child':
            case 'settings':
                // console.log('settings')
                return;
            default:
                setSettingsOpen(false);
        }
    }

    useEffect(() => {
        window.addEventListener('click', setSettings);
        return () => {
            window.removeEventListener('click', setSettings);
        }
    }, [])

    return (
        <motion.div
            ref={ref}
            className={clsx(
                className,
                'fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 xl:left-80',
                !isInsideMobileNavigation &&
                'backdrop-blur-sm dark:backdrop-blur lg:left-72 xl:left-80',
                isInsideMobileNavigation
                    ? 'bg-white dark:bg-zinc-900'
                    : 'bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]'
            )}
            style={{
                // @ts-ignore
                '--bg-opacity-light': bgOpacityLight,
                '--bg-opacity-dark': bgOpacityDark,
            }}
        >
            <div className={clsx(
                'absolute inset-x-0 top-full h-px transition',
                (isInsideMobileNavigation || !mobileNavIsOpen) &&
                'bg-zinc-900/7.5 dark:bg-white/7.5'
            )}
            />
            {/* TODO: search disabled */}
            <div className='sm:flex-grow hidden md:block'/>
            {/* <Search sections={sections} /> */}
            <div className="flex items-center gap-5 lg:hidden">
                <MobileNavigation
                    sections={sections}
                    semester={semester}
                    setSemester={setSemester}
                    sectionSelected={sectionSelected}
                    setSectionSelected={setSectionSelected} />
                <Link href="/" aria-label="Home">
                    <Logo className="md:w-12 w-8" />
                </Link>
            </div>
            <div className="flex items-center gap-5">
                <nav className="hidden md:block">
                    <ul role="list" className="flex items-center gap-8">
                        <TopLevelNavItem href="/articles">所有文章</TopLevelNavItem>
                        <TopLevelNavItem href="/activities">活動</TopLevelNavItem>
                        <TopLevelNavItem href="/booking">系窩租借</TopLevelNavItem>
                    </ul>
                </nav>
                <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15" />
                <div className="flex gap-4">
                    <MobileSearch sections={sections} />
                    <ThemeToggle />
                </div>
                <div className="hidden min-[416px]:contents relative">
                    {status === "authenticated" ?
                        <Button onClick={(event) => {
                            if (settingsRef.current) {
                                settingsRef.current.focus();
                            }
                        }} id="nav_btn">
                            {session.user?.name === 'anonymous' ? (session as ExtendedSession).user.student_id : session.user?.name}
                        </Button> :
                        <Button href="/login">登入</Button>
                    }
                    <motion.div
                        className={clsx(
                            'absolute -bottom-10 right-10 bg-slate-300 dark:bg-slate-700 w-20 rounded-lg px-3 py-2 flex flex-col',
                            settingsOpen || 'hidden'
                        )}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        ref={settingsRef}
                        id="settings"
                    >
                        <Button href='/logout'
                            variant='text'
                            className='w-full'
                            id="child"
                        >
                            登出
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.div >
    )
})
