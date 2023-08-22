"use client"
import clsx from "clsx"
import Image from "next/image"
import {
    GetPostReturnType,
} from "lib/api"
import Link from "next/link"

type PostsType = NonNullable<Awaited<GetPostReturnType>>

export default function ClientRenderedPage({ post }: { post: PostsType }) {

    return (
        <div className="space-y-5 w-full">
            {post.content && post.content.map((block) => {
                switch (block.type) {
                    case "image":
                        return (
                            <ImageRenderer content={block.content} key={block.content} />
                        )
                    case "quote":
                        return (
                            <div className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200 pl-8"
                                key={`${clsx(block.content[0].text.content)}z`}>
                                <ParagraphRenderer content={block.content} />
                                <div className="h-full w-2 absolute bg-stone-700 left-0 dark:bg-slate-400" />
                            </div>
                        )
                    default:
                        // regard as paragraph
                        return (
                            <div key={`${clsx(block.content[0].text.content)}z`}>
                                <ParagraphRenderer content={block.content} />
                            </div>
                        )
                }
            })}
        </div>
    )
}

function lineBreaker(text: string) {
    return text.replaceAll(/\n/g, "<br />")
}

function ImageRenderer({ content }: { content: string }) {
    if (typeof content === "string") {
        return (
            <div className="h-80 relative w-full">
                <Image
                    src={content}
                    fill
                    alt="image"
                    className="object-contain"
                />
            </div>
        )
    }
    return <></>
}

function ParagraphRenderer({ content }: { content: any[] }) {
    return (
        content.map(para => {
            if (para.text.link) {
                return (
                    <a href={para.text.link.url} key={para.text.content} target="_blank" rel="noopener noreferrer">
                        <PlainTextParser content={para.text.content} link />
                    </a>
                )
            }
            return <PlainTextParser content={para.text.content} key={para.text.content} />
        })
    )
}

function PlainTextParser({ content, link }: { content: string, link?: boolean }) {
    return (
        <p className={clsx(
            "relative z-10 flex text-sm font-medium ",
            link ? "text-zinc-700 transition hover:text-teal-300 dark:text-zinc-300 underline" : "text-zinc-400 transition dark:text-zinc-200"
        )}
            dangerouslySetInnerHTML={{ __html: lineBreaker(content) }}
        />
    )
}