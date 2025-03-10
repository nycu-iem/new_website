"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from "react"
import { Footer } from './Footer'
import { Header } from './Header'
import { Logo } from './Logo'
import { Navigation } from './Navigation'
import React from 'react'
import { FirstLayerOfPost } from "../notion_api"
import Toaster from 'components/Toast'
import { ToastContainer } from 'react-toastify'
import { Session } from 'next-auth'

export function Layout({
    children,
    allSections = [],
    session,
}: {
    children: React.ReactNode,
    allSections: Array<FirstLayerOfPost>,
    session?: Session
}) {
    // TODO: set semester according to date
    const [semester, setSemester] = useState<"first" | "second" | "summer">("first");
    const [sectionSelected, setSectionSelected] = useState<Array<FirstLayerOfPost>>([]);

    return (
        <React.Fragment>
            <div className="h-full lg:ml-72 xl:ml-80 w-full">
                <motion.header layoutScroll
                    className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
                >
                    <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 lg:pt-4 lg:dark:border-white/10 xl:w-80">
                        <div className="hidden lg:flex">
                            <Link href="/" aria-label="Home">
                                <Logo className="md:w-12 w-8" />
                            </Link>
                        </div>
                        <Header sections={allSections}
                            semester={semester}
                            setSemester={setSemester}
                            sectionSelected={sectionSelected}
                            setSectionSelected={setSectionSelected}
                            // session={session}
                            session={session}
                        />
                        <Navigation
                            className="hidden lg:mt-10 lg:block"
                            sections={allSections}
                            semester={semester}
                            setSemester={setSemester}
                            sectionSelected={sectionSelected}
                            setSectionSelected={setSectionSelected}
                        />
                    </div>
                </motion.header>
                <div className="relative flex h-full flex-col px-4 pt-14 sm:px-6 lg:px-8">
                    <main className="flex-auto">{children}</main>
                    {/* TODO: footer needs to be fixed */}
                    {/* <Footer sections={sectionSelected} /> */}
                </div>
            </div>
            <Toaster />
            <ToastContainer />
        </React.Fragment>
    )
}


