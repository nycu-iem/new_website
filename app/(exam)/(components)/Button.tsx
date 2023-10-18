"use client"
import Link from 'next/link'
import clsx from 'clsx'
import React from 'react'

import { ArrowIcon } from 'components/Icon'
import { usePathname } from 'next/navigation'

const variantStyles = {
    primary:
        'rounded-full bg-zinc-900 py-1 px-3 text-white hover:bg-zinc-700 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300 dark:hover:ring-emerald-300',
    secondary:
        'rounded-full bg-zinc-100 py-1 px-3 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-400 dark:ring-1 dark:ring-inset dark:ring-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-300',
    filled:
        'rounded-full bg-zinc-900 py-1 px-3 text-white hover:bg-zinc-700 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400',
    outline:
        'rounded-full py-1 px-3 text-zinc-700 ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/2.5 hover:text-zinc-900 dark:text-zinc-400 dark:ring-white/10 dark:hover:bg-white/5 dark:hover:text-white',
    text: 'text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-500',
}

export function Button({
    variant = 'primary',
    className,
    children,
    arrow,
    href,
    onClick,
    ...props
}: {
    variant?: 'primary' | 'text' | 'secondary' | 'outline' | 'filled',
    className?: string,
    children: React.ReactNode,
    arrow?: 'left' | 'right',
    href?: string,
    id?: string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}) {
    // const Component = props.href ? Link : 'button'
    const pathname = usePathname();
    className = clsx(
        'inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition',
        variantStyles[variant],
        className
    )

    const arrowIcon = (
        <ArrowIcon className={clsx(
            'mt-0.5 h-5 w-5',
            variant === 'text' && 'relative top-px',
            arrow === 'left' && '-ml-1 rotate-180',
            arrow === 'right' && '-mr-1'
        )}
        />
    )

    if (href) {
        if (href === "/login") {
            localStorage.setItem('redirect_to', pathname);
        }

        return (
            <Link className={className} href={href} {...props}>
                {arrow === 'left' && arrowIcon
                }
                {children}
                {arrow === 'right' && arrowIcon}
            </Link >
        )
    } else {
        return (
            <button className={className} onClick={onClick} {...props}>
                {arrow === 'left' && arrowIcon}
                {children}
                {arrow === 'right' && arrowIcon}
            </button>
        )
    }
}
