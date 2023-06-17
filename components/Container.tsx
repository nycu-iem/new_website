import { forwardRef } from 'react'
import clsx from 'clsx'

interface Props {
    className?: string;
    style?: any;
    children: React.ReactNode
}

export const OuterContainer = forwardRef<HTMLDivElement, Props>((
    { className, children, ...props },
    ref
) => {
    return (
        <div ref={ref} className={clsx('sm:px-8', className)} {...props}>
            <div className="mx-auto max-w-7xl lg:px-8">{children}</div>
        </div>
    )
})

export const InnerContainer = forwardRef<HTMLDivElement, Props>(function InnerContainer(
    { className, children, ...props },
    ref
) {
    return (
        <div
            ref={ref}
            className={clsx('relative px-4 sm:px-8 lg:px-12', className)}
            {...props}
        >
            <div className="mx-auto max-w-2xl lg:max-w-5xl">{children}</div>
        </div>
    )
})


export const Container = forwardRef<HTMLDivElement, Props>(function Container(
    { children, ...props }: { children: React.ReactNode },
    ref
) {
    return (
        <OuterContainer ref={ref} {...props}>
            <InnerContainer>{children}</InnerContainer>
        </OuterContainer>
    )
})

