"use client"
import { Fragment, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Popover, Transition } from '@headlessui/react'
import clsx from 'clsx'

import { Container } from './Container'
import { usePathname } from "next/navigation"
import Swal from "sweetalert2"

import { ToastContainer } from 'react-toastify';
import Toaster from "./Toast"
import { useTheme } from 'next-themes'

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
        blocked: false,
        // reason: "Not Yet Implemented"
    }, {
        title: "歷屆考古題",
        href: "/exams",
        blocked: false,
        // reason: "Not Yet Implemented"
    }
]

function CloseIcon(props: any) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function ChevronDownIcon(props: any) {
    return (
        <svg viewBox="0 0 8 6" aria-hidden="true" {...props}>
            <path d="M1.75 1.75 4 4.25l2.25-2.5"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function SunIcon(props: any) {
    return (
        <svg viewBox="0 0 24 24"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            <path d="M8 12.25A4.25 4.25 0 0 1 12.25 8v0a4.25 4.25 0 0 1 4.25 4.25v0a4.25 4.25 0 0 1-4.25 4.25v0A4.25 4.25 0 0 1 8 12.25v0Z" />
            <path d="M12.25 3v1.5M21.5 12.25H20M18.791 18.791l-1.06-1.06M18.791 5.709l-1.06 1.06M12.25 20v1.5M4.5 12.25H3M6.77 6.77 5.709 5.709M6.77 17.73l-1.061 1.061"
                fill="none"
            />
        </svg>
    )
}

function MoonIcon(props: any) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M17.25 16.22a6.937 6.937 0 0 1-9.47-9.47 7.451 7.451 0 1 0 9.47 9.47ZM12.75 7C17 7 17 2.75 17 2.75S17 7 21.25 7C17 7 17 11.25 17 11.25S17 7 12.75 7Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function MobileNavItem({ href, children, ...props }: { href: string, children: React.ReactNode, blocked: boolean, reason?: string }) {
    return (
        <li>
            {props.blocked ?
                <Popover.Button className="block py-2" onClick={() => {
                    Swal.fire({
                        icon: "error",
                        text: props.reason
                    })
                }}>
                    {children}
                </Popover.Button>
                :
                <Popover.Button as={Link} href={href} className="block py-2">
                    {children}
                </Popover.Button>
            }
        </li>
    )
}

function MobileNavigation(props: any) {
    return (
        <Popover {...props}>
            <Popover.Button className="group flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20">
                Menu
                <ChevronDownIcon className="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400" />
            </Popover.Button>
            <Transition.Root>
                <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Popover.Overlay className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-sm dark:bg-black/80" />
                </Transition.Child>
                <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Popover.Panel
                        focus
                        className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-800"
                    >
                        <div className="flex flex-row-reverse items-center justify-between">
                            <Popover.Button aria-label="Close menu" className="-m-1 p-1">
                                <CloseIcon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
                            </Popover.Button>
                            <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                Navigation
                            </h2>
                        </div>
                        <nav className="mt-6">
                            <ul className="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
                                {menuOptions.map((option) => (
                                    <MobileNavItem key={option.title} {...option}>{option.title}</MobileNavItem>
                                ))}
                            </ul>
                        </nav>
                    </Popover.Panel>
                </Transition.Child>
            </Transition.Root>
        </Popover>
    )
}

function NavItem({ href, children, ...props }: { href: string, children: React.ReactNode, reason?: string, blocked: boolean }) {
    const isActive = usePathname() === href

    return (
        <li>
            {!props.blocked ?
                <Link href={href} passHref>
                    <div className={clsx(
                        'relative block px-3 py-2 transition',
                        isActive ? 'text-teal-500 dark:text-teal-400' : 'hover:text-teal-500 dark:hover:text-teal-400'
                    )}>
                        {children}

                        {isActive && (
                            <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0 dark:from-teal-400/0 dark:via-teal-400/40 dark:to-teal-400/0" />
                        )}
                    </div>
                </Link>
                :
                <div className='relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400 cursor-pointer' onClick={() => {
                    // toast(props.reason, {
                    //     autoClose: 5000,
                    // });
                    Swal.fire({
                        icon: "error",
                        text: props.reason
                    })
                    // console.log("pressed", props.reason)
                }}>
                    {children}
                </div>
            }

        </li>
    )
}

function DesktopNavigation(props: any) {
    return (
        <nav {...props}>
            <ul className="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
                {menuOptions.map((option) => (
                    <NavItem key={option.title} {...option}>{option.title}</NavItem>
                ))}
            </ul>
        </nav>
    )
}

function ModeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const otherTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    const [mounted, setMounted] = useState<boolean>(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <button
            type="button"
            aria-label="Toggle dark mode"
            className="group rounded-full bg-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
            onClick={() => setTheme(otherTheme)}
        >
            <SunIcon className="h-6 w-6 fill-zinc-100 stroke-zinc-500 transition group-hover:fill-zinc-200 group-hover:stroke-zinc-700 dark:hidden [@media(prefers-color-scheme:dark)]:fill-teal-50 [@media(prefers-color-scheme:dark)]:stroke-teal-500 [@media(prefers-color-scheme:dark)]:group-hover:fill-teal-50 [@media(prefers-color-scheme:dark)]:group-hover:stroke-teal-600" />
            <MoonIcon className="hidden h-6 w-6 fill-zinc-700 stroke-zinc-500 transition dark:block [@media(prefers-color-scheme:dark)]:group-hover:stroke-zinc-400 [@media_not_(prefers-color-scheme:dark)]:fill-teal-400/10 [@media_not_(prefers-color-scheme:dark)]:stroke-teal-500" />
        </button>
    )
}

function clamp(number: number, a: number, b: number) {
    let min = Math.min(a, b)
    let max = Math.max(a, b)
    return Math.min(Math.max(number, min), max)
}

function AvatarContainer({ className, ...props }: { className?: string, style?: any, children?: React.ReactNode }) {
    return (
        <div className={clsx(
            className,
            'h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:ring-white/10'
        )}
            {...props}
        />
    )
}

function Avatar({ large = false, className, ishomepage, ...props }: { large?: boolean, className?: string, style?: any, ishomepage?: boolean }) {
    return (
        <Link href="/"
            aria-label="Home"
            // TODO: Tiny issue about the position
            className={clsx(className, 'pointer-events-auto', ishomepage && "relative")}
            {...props}
            passHref
        >
            <Image src="/images/logos/iem.png"
                alt="Logo of NYCU IEM"
                fill={true}
                sizes={large ? '4rem' : '2.25rem'}
                className={clsx(
                    'rounded-full bg-zinc-100 object-cover',
                    large ? 'h-16 w-16' : 'h-9 w-9'
                )}
                priority
            />
        </Link>
    )
}


export function Header() {
    let isHomePage = usePathname() === '/'

    let headerRef = useRef<HTMLDivElement>(null);
    let avatarRef = useRef<HTMLDivElement>(null);
    let isInitial = useRef<boolean>(true);

    useEffect(() => {
        let downDelay = avatarRef.current?.offsetTop ?? 0
        let upDelay = 64

        function setProperty(property: string, value: string) {
            document.documentElement.style.setProperty(property, value)
        }

        function removeProperty(property: string) {
            document.documentElement.style.removeProperty(property)
        }

        function updateHeaderStyles() {
            if (headerRef.current === null)
                return;
            let { top, height } = headerRef.current.getBoundingClientRect()
            let scrollY = clamp(
                window.scrollY,
                0,
                document.body.scrollHeight - window.innerHeight
            )

            if (isInitial.current) {
                setProperty('--header-position', 'sticky')
            }

            setProperty('--content-offset', `${downDelay}px`)

            if (isInitial.current || scrollY < downDelay) {
                setProperty('--header-height', `${downDelay + height}px`)
                setProperty('--header-mb', `${-downDelay}px`)
            } else if (top + height < -upDelay) {
                let offset = Math.max(height, scrollY - upDelay)
                setProperty('--header-height', `${offset}px`)
                setProperty('--header-mb', `${height - offset}px`)
            } else if (top === 0) {
                setProperty('--header-height', `${scrollY + height}px`)
                setProperty('--header-mb', `${-scrollY}px`)
            }

            if (top === 0 && scrollY > 0 && scrollY >= downDelay) {
                setProperty('--header-inner-position', 'fixed')
                removeProperty('--header-top')
                removeProperty('--avatar-top')
            } else {
                removeProperty('--header-inner-position')
                setProperty('--header-top', '0px')
                setProperty('--avatar-top', '0px')
            }
        }

        function updateAvatarStyles() {
            if (!isHomePage) {
                return
            }

            let fromScale = 1
            let toScale = 36 / 64
            let fromX = 0
            let toX = 2 / 16

            let scrollY = downDelay - window.scrollY

            let scale = (scrollY * (fromScale - toScale)) / downDelay + toScale
            scale = clamp(scale, fromScale, toScale)

            let x = (scrollY * (fromX - toX)) / downDelay + toX
            x = clamp(x, fromX, toX)

            setProperty(
                '--avatar-image-transform',
                `translate3d(${x}rem, 0, 0) scale(${scale})`
            )

            let borderScale = 1 / (toScale / scale)
            let borderX = (-toX + x) * borderScale
            let borderTransform = `translate3d(${borderX}rem, 0, 0) scale(${borderScale})`

            setProperty('--avatar-border-transform', borderTransform)
            setProperty('--avatar-border-opacity', scale === toScale ? "1" : "0")
        }

        function updateStyles() {
            updateHeaderStyles()
            updateAvatarStyles()
            isInitial.current = false
        }

        updateStyles()
        window.addEventListener('scroll', updateStyles, { passive: true })
        window.addEventListener('resize', updateStyles)

        return () => {
            window.removeEventListener('scroll', updateStyles)
            window.removeEventListener('resize', updateStyles)
        }
    }, [isHomePage])

    return (
        <>
            <header className="pointer-events-none relative z-50 flex flex-col"
                style={{
                    height: 'var(--header-height)',
                    marginBottom: 'var(--header-mb)',
                }}
            >
                {isHomePage && (
                    <>
                        <div ref={avatarRef}
                            className="order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]"
                        />
                        <Container className="top-0 order-last -mb-3 pt-3"
                            style={{ position: 'var(--header-position)' }}
                        >
                            <div className="top-[var(--avatar-top,theme(spacing.3))] w-full"
                                /* @ts-ignore */
                                style={{ position: 'var(--header-inner-position)' }}
                            >
                                <div className="relative">
                                    <AvatarContainer className="absolute left-0 top-3 origin-left transition-opacity"
                                        style={{
                                            opacity: 'var(--avatar-border-opacity, 0)',
                                            transform: 'var(--avatar-border-transform)',
                                        }}
                                    />
                                    <Avatar large
                                        className="block h-16 w-16 origin-left"
                                        style={{ transform: 'var(--avatar-image-transform)' }}
                                        ishomepage={isHomePage}
                                    />
                                </div>
                            </div>
                        </Container>
                    </>
                )}
                <div ref={headerRef}
                    className="top-0 z-10 h-16 pt-6"
                    /* @ts-ignore */
                    style={{ position: 'var(--header-position)' }}
                >
                    <Container
                        className="top-[var(--header-top,theme(spacing.6))] w-full"
                        style={{ position: 'var(--header-inner-position)' }}
                    >
                        <div className="relative flex gap-4">
                            <div className="flex flex-1">
                                {!isHomePage && (
                                    <AvatarContainer className='relative'>
                                        <Avatar />
                                    </AvatarContainer>
                                )}
                            </div>
                            <div className="flex flex-auto justify-end md:justify-center">
                                <MobileNavigation className="pointer-events-auto md:hidden" />
                                <DesktopNavigation className="pointer-events-auto hidden md:block" />
                            </div>
                            <div className="flex justify-end md:flex-1">
                                <div className="pointer-events-auto">
                                    <ModeToggle />
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </header>
            {isHomePage && <div style={{ height: 'var(--content-offset)' }} />}
            <ToastContainer />
            <Toaster />
        </>
    )
}
