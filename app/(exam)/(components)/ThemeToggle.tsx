import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

import {
    SunIcon,
    MoonIcon
} from "components/Icon"

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme()
    const otherTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
            aria-label={mounted ? `Switch to ${otherTheme} theme` : 'Toggle theme'}
            onClick={() => setTheme(otherTheme)}
        >
            <SunIcon className="h-5 w-5 stroke-zinc-900 dark:hidden" />
            <MoonIcon className="hidden h-5 w-5 stroke-white dark:block" />
        </button>
    )
}
