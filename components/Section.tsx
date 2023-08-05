"use client"
import { useId } from 'react'

export function Section({ title, children }: { title: string | Array<string>, children: React.ReactNode }) {
    // let id = useId()

    return (
        <section aria-labelledby={`${title}-sectionid`}
            className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40"
        >
            <div className="grid grid-cols-1 items-baseline gap-y-8 md:grid-cols-4">
                <h2 id={`${title}-sectionid`} className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 flex flex-row md:flex-col space-x-1 md:space-x-0">
                    {typeof title === "string" ? title : title.map((text) => (<div key={text}>{text}</div>))}
                </h2>
                <div className="md:col-span-3">{children}</div>
            </div>
        </section>
    )
}
