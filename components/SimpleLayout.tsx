import { Container } from './Container'

import clsx from "clsx"

export function SimpleLayout({ title, intro, children, className, is_post }: { title: string, intro: string, children?: React.ReactNode, className?: string, is_post?: boolean }) {
    return (
        <Container className={clsx(
            "mt-16 sm:mt-32",
            className
        )}>
            <header className={clsx(
                is_post || "max-w-2xl",
                is_post && "border-b"
            )}>
                <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                    {title}
                </h1>
                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                    {intro}
                </p>
            </header>
            <div className="mt-12 sm:mt-20 w-full">{children}</div>
        </Container>
    )
}
