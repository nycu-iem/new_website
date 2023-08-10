import Image from "next/image"
import { clsx } from 'clsx'

export function Logo({
    className
}: {
    className?: string
}) {
    return (
        <div className={clsx(
            "relative aspect-square",
            className
        )}>
            <Image src="/images/logos/iem.png"
                alt="Logo of NYCU IEM"
                fill={true}
                sizes={'30rem'}
                className='rounded-full bg-zinc-100 object-cover'
                priority
            />
        </div>
    )
}