import Image from "next/image"
import { clsx } from 'clsx'

export function Logo({ className }: { className?: string }) {
    return (
        <div className="relative h-12 w-12">
            <Image src="/images/logos/iem.png"
                alt="Logo of NYCU IEM"
                fill={true}
                sizes={'30rem'}
                className={clsx(
                    'rounded-full bg-zinc-100 object-cover h-6 w-6',
                    // className
                )}
                priority
            />
        </div>
    )
}