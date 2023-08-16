'use client'

import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { AnimatePresence, motion, useIsPresent, useMotionValue, useDragControls } from 'framer-motion'

import { Button } from './Button'
import { useIsInsideMobileNavigation } from './MobileNavigation'
import { Tag } from './Tag'
import { remToPx } from '../../../lib/remToPx'
import { FirstLayerOfPost } from '../notion_api'

function TopLevelNavItem({
    href,
    children
}: {
    href: string,
    children: React.ReactNode
}) {
    return (
        <li className="md:hidden">
            <Link href={href}
                className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
                {children}
            </Link>
        </li>
    )
}

function NavLink({
    href,
    tag,
    active = false,
    isAnchorLink = false,
    children,
}: {
    href: string,
    tag?: string,
    active?: boolean,
    isAnchorLink?: boolean,
    children: React.ReactNode,
}) {
    const pushEvent = () => {
        // const eventEmit = document.createEvent('HTMLEvents')
        // eventEmit.initEvent('link-clicked')
        const event = new Event("link-clicked", { "bubbles": true, "cancelable": false });
        document.dispatchEvent(event);
    }

    return (
        <Link href={href}
            aria-current={active ? 'page' : undefined}
            className={clsx(
                'flex justify-between gap-2 py-1 pr-3 text-sm transition',
                isAnchorLink ? 'pl-7' : 'pl-4',
                active
                    ? 'text-zinc-900 dark:text-white'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            )}
            onClick={() => { pushEvent() }}
        >
            <span className="truncate">{children}</span>
            {tag && (
                <Tag variant="small" color="zinc">
                    {tag}
                </Tag>
            )}
        </Link>
    )
}

function VisibleSectionHighlight({
    group,
    pathname,
    sections
}: {
    group: FirstLayerOfPost,
    pathname: string,
    sections: Array<FirstLayerOfPost>
}) {
    const visibleSections = sections.filter((section) => (
        pathname.includes(section.link)
    ))

    const isPresent = useIsPresent()
    // console.log(isPresent)

    const itemHeight = remToPx(2)
    const [height, setHeight] = useState<number>(0);
    const [top, setTop] = useState<number>(0);
    // const [hash, setHash] = useState<string>("");

    const hashChangedHandler = useCallback(() => {
        setTimeout(() => {
            // console.log(document.location.hash)
            const courses = visibleSections[0].classes;
            const classIndex = courses.findIndex(c => (encodeURI(`${visibleSections[0].link}/${c.link}`) === pathname))

            const firstVisibleSectionIndex = Math.max(
                0,
                [{ title: '_top', text: 'text' }, ...courses[classIndex].sections].findIndex(
                    (section) => encodeURI(`#${section.title}${section.text}`) === document.location.hash
                )
            )
            console.log('first visible section index:', firstVisibleSectionIndex)
            setHeight(isPresent
                ? Math.max(1, visibleSections.length) * itemHeight
                : itemHeight)

            setTop(group.classes.findIndex((course) => encodeURI(`${group.link}/${course.link}`) === pathname) * itemHeight +
                firstVisibleSectionIndex * itemHeight)

            console.log("height", height)
            console.log("top", top)
        }, 200)
    }, [])

    useEffect(() => {
        hashChangedHandler();
        window.addEventListener('link-clicked', hashChangedHandler)
        return () => {
            window.removeEventListener('link-clicked', hashChangedHandler)
        }
    }, [])

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2 } }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 top-0 bg-zinc-300 will-change-transform dark:bg-zinc-200"
            style={{ borderRadius: 8, height, top }}
        />
    )
}

function ActivePageMarker({
    group,
    pathname
}: {
    pathname: string,
    group: FirstLayerOfPost,
}) {
    const [top, setTop] = useState<number>(0);
    const itemHeight = remToPx(2)
    const offset = remToPx(0.25)

    const hashChangedHandler = useCallback(() => {
        setTimeout(() => {
            const activePageIndex = group.classes.findIndex((course) => encodeURI(`${group.link}/${course.link}`) === pathname)
            setTop(offset + activePageIndex * itemHeight)

        }, 200)
    }, [])

    useEffect(() => {
        hashChangedHandler();
        window.addEventListener('link-clicked', hashChangedHandler)
        return () => {
            window.removeEventListener('link-clicked', hashChangedHandler)
        }
    }, [])

    return (
        <motion.div layout
            className="absolute left-2 h-6 w-px bg-emerald-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2 } }}
            exit={{ opacity: 0 }}
            style={{ top }}
        />
    )
}

function NavigationGroup({
    group,
    className,
    sections,
}: {
    className: React.ReactNode,
    group: FirstLayerOfPost,
    sections: Array<FirstLayerOfPost>
}) {
    // If this is the mobile navigation then we always render the initial
    // state, so that the state does not change during the close animation.
    // The state will still update when we re-open (re-render) the navigation.
    const isInsideMobileNavigation = useIsInsideMobileNavigation()
    // let [pathname, sections] = useInitialValue(
    //     [usePathname(), useSectionStore((s) => s.sections)],
    //     isInsideMobileNavigation
    // )

    const pathname = usePathname()
    // console.log(`${group.link}/${group.classes[0]?.link}`, pathname)
    const isActiveGroup = group.classes.findIndex((post) => encodeURI(`${group.link}/${post.link}`) === pathname) !== -1
    // console.log(isActiveGroup)

    return (
        <li className={clsx('relative mt-6', className)}>
            <motion.h2 layout="position"
                className="text-xs font-semibold text-zinc-900 dark:text-white"
            >
                {group.title}
            </motion.h2>
            <div className="relative mt-3 pl-2">
                <AnimatePresence initial={!isInsideMobileNavigation}>
                    {isActiveGroup && (
                        <VisibleSectionHighlight group={group} pathname={pathname} sections={sections} />
                    )}
                </AnimatePresence>
                <motion.div layout
                    className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
                />
                <AnimatePresence initial={false}>
                    {isActiveGroup && (
                        <ActivePageMarker group={group} pathname={pathname} />
                    )}
                </AnimatePresence>

                <ul role="list" className="border-l border-transparent">
                    {group.classes.map((course) => (
                        <motion.li key={course.link} layout="position" className="relative">
                            <NavLink href={`${group.link}/${course.link}`} active={`${group.link}/${course.link}` === pathname}>
                                {course.title}
                            </NavLink>
                            <AnimatePresence mode="popLayout" initial={false}>
                                {encodeURI(`${group.link}/${course.link}`) === pathname && group.classes.length > 0 && (
                                    <motion.ul
                                        role="list"
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: 1,
                                            transition: { delay: 0.1 },
                                        }}
                                        exit={{
                                            opacity: 0,
                                            transition: { duration: 0.15 },
                                        }}
                                    >
                                        {course.sections.map((section) => (
                                            <li key={`${section.title}${section.text}`}>
                                                <NavLink href={`${group.link}/${course.link}#${section.title}${section.text}`}
                                                    tag={section.text}
                                                    isAnchorLink
                                                >
                                                    {section.title}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </li>
    )
}

export function Navigation({
    sections,
    ...props
}: {
    className?: string,
    sections: Array<FirstLayerOfPost>
}) {
    // TODO: set semester according to date
    const [semester, setSemester] = useState<"first" | "second" | "summer">("first");
    const [sectionSelected, setSectionSelected] = useState<Array<FirstLayerOfPost>>([]);

    const updateSemesterSelection = () => {

    }

    useEffect(() => {
        updateSemesterSelection();
    }, [])

    return (
        <nav {...props}>
            <ul role="list" className='relative'>
                <TopLevelNavItem href="/articles">文章</TopLevelNavItem>
                <TopLevelNavItem href="/activities">活動</TopLevelNavItem>
                <TopLevelNavItem href="/booking">系窩租借</TopLevelNavItem>
                <Selection semster={semester} setSemester={setSemester} />
                {sections.map((group, groupIndex) => (
                    <NavigationGroup
                        key={group.title}
                        group={group}
                        sections={sections}
                        className={groupIndex === 0 && 'md:mt-0'}
                    />
                ))}
                <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
                    <Button href="#" variant="filled" className="w-full">
                        Sign in
                    </Button>
                </li>
            </ul>
        </nav>
    )
}

export function Selection({
    className,
    semster,
    setSemester,
}: {
    className?: string,
    semster: "first" | "second" | "summer"
    setSemester: Dispatch<SetStateAction<"first" | "second" | "summer">>
}) {
    const firstRef = useRef<HTMLDivElement>(null);
    const secondRef = useRef<HTMLDivElement>(null);
    const summerRef = useRef<HTMLDivElement>(null);
    const motherBoxRef = useRef<HTMLDivElement>(null);
    const motionRef = useRef<HTMLDivElement>(null);
    const [translateX, setTranslateX] = useState<number>(0);
    // const [customStyle, setCustomStyle] = useState<any>({});
    const x = useMotionValue(0);
    const controls = useDragControls()

    const setSelection = (option: "first" | "second" | "summer") => {
        switch (option) {
            case "first":
                setTranslateX(0);
                break;
            case "second":
                setTranslateX(firstRef.current?.offsetWidth ?? 0)
                break;
            case "summer":
                setTranslateX((firstRef.current?.offsetWidth ?? 0) * 2)
                break;
        }
    }

    const stopDrag = () => {
        // console.log('dragging off')
        setTimeout(() => {

            const re = /translateX\(([0-9.]*)px\)/
            const transform = motionRef.current?.style.transform ?? ""
            console.log(transform)
            console.log(transform.match(re))
            const result = transform.match(re);

            if (!result) {
                return setTranslateX(0);
            }

            if (result.length > 1) {
                const block_width = firstRef.current?.offsetWidth;
                const pos = parseFloat(result[1])
                if (!block_width) {
                    return;
                } else if (pos > block_width * 1.5) {
                    setTranslateX(block_width * 2)
                } else if (pos > block_width * 0.5) {
                    setTranslateX(block_width)
                } else {
                    setTranslateX(0)
                }
            }
        }, 100)
    }

    return (
        <div className={clsx(
            "grid grid-cols-3 items-center my-2 py-1 px-3 w-full bg-slate-100 select-none rounded-md",
            className,
        )} ref={motherBoxRef}>
            <div className='text-center cursor-pointer' ref={firstRef} onClick={() => {
                setSelection("first")
            }}>
                上學期
            </div>
            <div className='text-center cursor-pointer' ref={secondRef} onClick={() => {
                setSelection("second")
            }}>
                下學期
            </div>
            <div className="text-center cursor-pointer" ref={summerRef} onClick={() => {
                setSelection("summer")
            }}>
                暑假
            </div>
            <motion.div
                className='bg-blue-400 h-2 absolute opacity-30 rounded-lg'
                drag="x"
                dragConstraints={{ left: 0, right: (firstRef.current?.offsetWidth ?? 0) * 2 }}
                style={{
                    width: firstRef.current?.offsetWidth,
                    height: firstRef.current?.offsetHeight,
                    touchAction: "none",
                }}
                animate={{ x: translateX }}
                transition={{ delay: 0.1 }}
                layout
                onPointerUp={() => { stopDrag() }}
                dragControls={controls}
                ref={motionRef} />
        </div >
    )
}