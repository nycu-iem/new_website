'use client'

import { createContext, Fragment, useContext, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Dialog, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { create } from 'zustand'

import { Header } from './Header'
import { Navigation } from './Navigation'
import { FirstLayerOfPost } from '../notion_api'
import { Dispatch, SetStateAction } from 'react'

import { XIcon, MenuIcon } from 'components/Icon'

const IsInsideMobileNavigationContext = createContext<boolean>(false)

export function useIsInsideMobileNavigation() {
    return useContext(IsInsideMobileNavigationContext)
}

export const useMobileNavigationStore = create<{
    isOpen: boolean,
    open: () => void,
    close: () => void,
    toggle: () => void
}>((set) => ({
    isOpen: false,
    open: () => set(() => ({ isOpen: true })),
    close: () => set(() => ({ isOpen: false })),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))

export function MobileNavigation({
    sections,
    semester,
    setSemester,
    sectionSelected,
    setSectionSelected,
}: {
    sections: Array<FirstLayerOfPost>,
    semester: "first" | "second" | "summer",
    setSemester: Dispatch<SetStateAction<"first" | "second" | "summer">>,
    sectionSelected: Array<FirstLayerOfPost>,
    setSectionSelected: Dispatch<SetStateAction<Array<FirstLayerOfPost>>>,
}) {
    let isInsideMobileNavigation = useIsInsideMobileNavigation()
    let { isOpen, toggle, close } = useMobileNavigationStore()
    let ToggleIcon = isOpen ? XIcon : MenuIcon
    let pathname = usePathname()
    let searchParams = useSearchParams()
    let initialPathname = useRef(pathname).current
    let initialSearchParams = useRef(searchParams).current

    useEffect(() => {
        if (pathname !== initialPathname || searchParams !== initialSearchParams) {
            close()
        }
    }, [pathname, searchParams, close, initialPathname, initialSearchParams])

    return (
        <IsInsideMobileNavigationContext.Provider value={true}>
            <button
                type="button"
                className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
                aria-label="Toggle navigation"
                onClick={toggle}
            >
                <ToggleIcon className="w-2.5 stroke-zinc-900 dark:stroke-white" />
            </button>
            {!isInsideMobileNavigation && (
                <Transition.Root show={isOpen} as={Fragment}>
                    <Dialog onClickCapture={(event) => {
                        const link = (event.target as HTMLElement).closest('a');
                        if (link && link.pathname + link.search + link.hash === window.location.pathname + window.location.search + window.location.hash) {
                            close();
                        }
                    }}
                        onClose={() => { close() }}
                        className="fixed inset-0 z-50 lg:hidden"
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="duration-300 ease-out"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="duration-200 ease-in"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 top-14 bg-zinc-400/20 backdrop-blur-sm dark:bg-black/40" />
                        </Transition.Child>

                        <Dialog.Panel>
                            <Transition.Child
                                as={Fragment}
                                enter="duration-300 ease-out"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="duration-200 ease-in"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Header
                                    sections={[]}
                                    semester={semester}
                                    setSemester={setSemester}
                                    sectionSelected={sectionSelected}
                                    setSectionSelected={setSectionSelected} />
                            </Transition.Child>

                            <Transition.Child
                                as={Fragment}
                                enter="duration-500 ease-in-out"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="duration-500 ease-in-out"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <motion.div
                                    layoutScroll
                                    className="fixed bottom-0 left-0 top-14 w-full overflow-y-auto bg-white px-4 pb-4 pt-6 shadow-lg shadow-zinc-900/10 ring-1 ring-zinc-900/7.5 dark:bg-zinc-900 dark:ring-zinc-800 min-[416px]:max-w-sm sm:px-6 sm:pb-10"
                                >
                                    <Navigation
                                        sections={sections}
                                        sectionSelected={sectionSelected}
                                        setSectionSelected={setSectionSelected}
                                        semester={semester}
                                        setSemester={setSemester}
                                    />
                                </motion.div>
                            </Transition.Child>
                        </Dialog.Panel>
                    </Dialog>
                </Transition.Root>
            )}
        </IsInsideMobileNavigationContext.Provider>
    )
}
