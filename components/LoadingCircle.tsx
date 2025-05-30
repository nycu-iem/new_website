import clsx from "clsx"

export default function LoadingCircle({
    className,
    size = "md",
}: {
    className?: string
    size?: "xl" | "md" | "lg"
}) {
    return (
        <svg className={clsx(
            "animate-spin -ml-1 mr-3 text-blue-500",
            size === "xl" && "w-32 h-32",
            size === "md" && "w-10 h-10",
            size === "lg" && "w-20 h-20",
            className
        )} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    )
}