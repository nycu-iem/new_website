import { notFound } from "next/navigation";
import { getExams } from "../../notion_api"
import { notion } from "lib/notion";
import React from 'react'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../api/auth/[...nextauth]/route"
import NotionPdf from "components/PdfRenderer";
import NotionImage from "components/NotionImage";
import { LockClosedIcon } from "@heroicons/react/20/solid";

import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
    { params, searchParams }: {
        params: { params: Array<string> }
        searchParams: { [key: string]: string | string[] | undefined }
    },
    parent: ResolvingMetadata
): Promise<Metadata> {

    // fetch data
    // const product = await fetch(`https://.../${id}`).then((res) => res.json())
    const page = await notion.getPage({ pageId: params.params[0] });
    // optionally access and extend (rather than replace) parent metadata
    // const previousImages = (await parent).openGraph?.images || []

    return {
        title: `${page.properties['標題'].title[0].plain_text} | 工工系學會 考古網站`,
        // openGraph: {
        //     images: ['/some-specific-page-image.jpg', ...previousImages],
        // },
    }
}

export default async function SectionPage({
    params,
    searchParams,
}: {
    params: { params: Array<string> },
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const session = await getServerSession(authOptions);

    let blocks;
    let page;
    try {
        blocks = await getExams({ pageId: params.params[0] });
        page = await notion.getPage({ pageId: params.params[0] });
        // console.log(blocks)
        if (blocks.object === 'error') {
            throw new Error("page not found")
        }
    } catch (err) {
        return notFound();
    }
    if (!session) {
        return (
            <div className="h-[70vh] flex flex-col justify-center text-center text-xl">
                登入以查看內容
            </div>
        )
    }

    let block_blocks = false;

    return (
        <div className="w-full flex flex-col">
            <div className='py-5 font-bold text-2xl'>
                {page.properties['標題'].title[0].plain_text}
            </div>

            {blocks.results.map((block: any) => {
                // console.log(block_blocks)
                // console.log(block)
                switch (block.type) {
                    case "paragraph":
                        const text = block.paragraph?.rich_text[0]?.plain_text ?? '';
                        const result = /{(.*)}/.exec(text)?.[1]
                        if (result) {
                            // header
                            const title = getTitle(result);
                            const category = getCategory(result);
                            // console.log('title:', category)
                            if (category === '讀書心得') {
                                if (session.user.union_fee) {
                                    block_blocks = false
                                } else {
                                    block_blocks = true
                                }
                            } else {
                                block_blocks = false
                            }
                            return (
                                <div key={block.id}
                                    id={result ?? undefined}
                                    className="text-xl py-3 font-bold ">
                                    {title}
                                </div>
                            )
                        }
                        // normal text
                        if (block_blocks) {
                            return <LockClosedIcon className="w-20 self-center" />
                        }
                        return (
                            <div key={block.id} className="select-none">
                                {block.paragraph.rich_text[0]?.plain_text}
                            </div>
                        )
                    case "file":
                        if (block_blocks) {
                            return <LockClosedIcon className="w-20 self-center" />
                        }
                        if (block.file && block.file.file && block.file.file.url) {
                            return (
                                <div className="w-full flex flex-row md:justify-start justify-center">
                                    <NotionPdf
                                        key={block.id}
                                        blockId={block.id}
                                        fileSrc={block.file.file.url}
                                    />
                                </div>
                            )
                        } else {
                            return (
                                <div>PDF Not Found</div>
                            )
                        }
                    case "image":
                        if (block_blocks) {
                            return <LockClosedIcon className="w-20 self-center" />
                        }
                        return (
                            <NotionImage
                                src={block.image.type === "external" ? block.image.external.url : block.image.file.url}
                                alt={"notion Image"}
                                blockId={block.id}
                            />
                        )
                    // TODO:add other file types
                    default:
                        console.log(block)
                        return <></>
                }
            })}
        </div>
    )
}

const getTitle = (input: string) => {
    const regex = /(.*)\|(.*)/.exec(input);

    if (regex) {
        return `${regex[2]} - ${regex[1]}`
    }
    return input
}

const getCategory = (input: string) => {
    const regex = /(.*)\|(.*)/.exec(input);

    if (regex) {
        return regex[2]
    }
    return input
}