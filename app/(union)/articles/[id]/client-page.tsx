"use client"

import clsx from "clsx"
import {
    GetPostReturnType,
} from "lib/api"
import Link from "next/link"
import NotionImage from "../../../../components/NotionImage"

type PostsType = NonNullable<Awaited<GetPostReturnType>>

export default function ClientRenderedPage({ post }: { post: PostsType }) {

    return (
        <div className="space-y-5 w-full">
            {post.content && post.content.map((block) => {
                switch (block.type) {
                    case "image":
                        return (
                            <ImageRenderer
                                content={block.content}
                                blockId={block.id}
                                key={block.content}
                            />
                        )
                    case "quote":
                        return (
                            <div className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200 pl-8"
                                key={`${clsx(block.content[0].text.content)}z${Math.random()}`}>
                                <ParagraphRenderer content={block.content} className={block.className} />
                                <div className="h-full w-2 absolute bg-stone-700 left-0 dark:bg-slate-400" />
                            </div>
                        )
                    default:
                        // regard as paragraph
                        if (block.content.length === 0) return (<div key={Math.random()} />)

                        return (
                            <div key={`${clsx(block.content[0].text.content)}z`} className="flex flex-row">
                                <ParagraphRenderer content={block.content} className={block.className} />
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

function ImageRenderer({ content, blockId }: { content: string, blockId: string }) {
    if (typeof content === "string") {
        return (
            <div className="h-80 relative w-full">
                <NotionImage
                    src={content}
                    alt="image"
                    className="object-contain"
                    blockId={blockId}
                    fill
                />
            </div>
        )
    }
    return <></>
}

function ParagraphRenderer({ content, className }: { content: any[], className?: string }) {
    return (
        content.map(para => {
            if (para.text.link) {
                return (
                    <a href={para.text.link.url} key={para.text.content} target="_blank" rel="noopener noreferrer">
                        <PlainTextParser content={para.text.content} link className={className} />
                    </a>
                )
            }
            return <PlainTextParser content={para.text.content} key={para.text.content} className={className} />
        })
    )
}

function PlainTextParser({ content, link, className }: { content: string, link?: boolean, className?: string }) {
    if (content === "") console.log("empty content")
    if (content === "") return <div className="h-8 w-16 bg-red-100" />

    return (
        <p className={clsx(
            className,
            "relative z-10 flex font-medium ",
            link ? "text-zinc-900 transition dark:text-zinc-400 hover:text-teal-300 dark:hover:text-teal-600 underline" : "text-zinc-800 transition dark:text-zinc-200",
        )}
            dangerouslySetInnerHTML={{ __html: lineBreaker(content) }}
        />
    )
} 