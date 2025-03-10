"use server"
import { notion } from "lib/notion";

import { cache } from 'react'

import { Client } from "@notionhq/client"
import { avoidRateLimit } from "./avoidRateLimit";

const revalidate = 60;

const real_notion = new Client({
    auth: process.env.NOTION_SECRET,
})

export const getStudents = cache(async ({
    student_id,
    student_id_or_name = false
}: {
    student_id: string
    student_id_or_name?: boolean
}) => {
    await avoidRateLimit();

    let result;

    if (student_id_or_name) {
        result = await real_notion.databases.query({
            database_id: '0e90f296e95e42018ee4b777265979e2',
            filter: {
                or: [{
                    property: '學號',
                    rich_text: {
                        contains: student_id
                    }

                }, {
                    property: '姓名',
                    rich_text: {
                        contains: student_id
                    }
                }]
            }
        })
    } else {
        result = await real_notion.databases.query({
            database_id: '0e90f296e95e42018ee4b777265979e2',
            filter: {
                property: '學號',
                rich_text: {
                    contains: student_id
                }
            }
        })
    }

    if (!result) {
        return []
    }

    const stus: Array<any> = result.results;

    return stus.map(stu => ({
        name: stu.properties['姓名'].title[0].plain_text,
        student_id: stu.properties['學號'].rich_text[0].plain_text,
        gender: stu.properties?.['性別']?.select?.name ?? '無紀錄',
        teacher: stu.properties?.['導師']?.select?.name ?? '無紀錄',
        in_department: stu.properties?.['在系上']?.checkbox ?? false,
        enterMethod: stu.properties?.['入學方式']?.select?.name ?? '無紀錄',
        graduate_year: stu.properties?.['畢業級數']?.number ?? 100,
        union_fee: stu.properties?.['系學會費']?.checkbox ?? false,
        comment: stu.properties['備註']?.rich_text[0]?.plain_text ?? '',
    }))
})

export const getStudent = cache(async ({
    student_id,
}: {
    student_id: string,
}) => {

    await avoidRateLimit();
    const result = await real_notion.databases.query({
        database_id: '0e90f296e95e42018ee4b777265979e2',
        filter: {
            property: '學號',
            rich_text: {
                contains: student_id
            }
        }
    })

    if (result === undefined) {
        return undefined;
    }

    const stu: any = result.results[0]

    return {
        name: stu.properties['姓名'].title[0].plain_text,
        student_id: stu.properties['學號'].rich_text[0].plain_text,
        gender: stu.properties?.['性別']?.select?.name ?? '無紀錄',
        teacher: stu.properties?.['導師']?.select?.name ?? '無紀錄',
        in_department: stu.properties['在系上'].checkbox,
        enterMethod: stu.properties?.['入學方式']?.select?.name ?? '無紀錄',
        graduate_year: stu.properties['畢業級數'].number,
        union_fee: stu.properties['系學會費'].checkbox,
        comment: stu.properties['備註']?.rich_text[0]?.plain_text ?? '',
    }
})

export const getChangeLogImageSrc = async (blockId: string) => {
    const supportedBlockType = "image";

    const block = await notion.getBlock({ blockId });

    if (block.type !== supportedBlockType) {
        throw new Error(`blockId: ${blockId} is not a image`);
    }

    const image = block[supportedBlockType];

    if (image.type === "external") {
        return image.external.url
    }

    return image.file.url
}

export const Posts = async ({ isHomePage = false, verify_post }: { isHomePage?: boolean, verify_post?: string }) => {
    const page = "27a55c38f3774cceabedfbce1690347e"

    const json = await notion.getDatabase({
        pageId: page
    });

    let posts = [];

    for (let e of json.results) {
        let post: { date: string, highlight: boolean, description: string, title: string, slug: string } = {
            date: e.last_edited_time,
            highlight: e.properties.highlight.checkbox,
            description: e.properties.description.rich_text[0].plain_text,
            title: e.properties.title.title[0].plain_text,
            slug: trim(e.id)
        }
        posts.push(post)
    }

    if (verify_post) {
        return posts.filter((post) => (post.slug === verify_post))
    }

    return isHomePage ? posts.filter((post) => (post.highlight === true)).slice(0, 3) : posts;
}

const trim = (str: string) => {
    var newStr = str.replace(/-/g, "");
    return newStr;
}

export type ParagraphType = { type: "paragraph", content: any[], className?: string }
export type ImageType = { type: "image", content: string, id: string, className?: string }
export type QuoteType = { type: "quote", content: any[], className?: string }

type ContentType = ParagraphType | ImageType | QuoteType;

export const getPost = async (id: string) => {
    const post = await notion.getPage({
        pageId: id
    })

    // console.log(post)

    const blocks = await notion.getBlocks({
        pageId: id
    })

    // console.log(blocks)

    if (post.object !== 'page') {
        return undefined
    }

    let content = [];
    for (let e of blocks.results) {
        // console.log(e);

        let cont: ContentType;

        // console.log(e.type)

        switch (e.type) {
            case "image":
                cont = {
                    type: "image",
                    content: e.image.type === 'external' ? e.image.external.url : e.image.file.url,
                    id: e.id,
                }
                break;
            case "quote":
                cont = {
                    type: "quote",
                    content: e.quote.rich_text
                }
                break;
            case "paragraph":
                // console.log(e)
                cont = {
                    type: "paragraph",
                    content: e.paragraph.rich_text
                }
                break;
            case "numbered_list_item":
                // assume numbered list item is paragraph
                console.log(e)
                // console.log(e.has_children ? e.numbered_list_item.children : e.numbered_list_item.rich_text)
                cont = {
                    type: "paragraph",
                    content: e.numbered_list_item.rich_text
                }
                break;
            case "heading_2":
                // assume heading 2 is paragraph
                // console.log(e.heading_2.rich_text)
                cont = {
                    className: "text-2xl font-bold py-2",
                    type: "paragraph",
                    content: e.heading_2.rich_text
                }
                break;
            case "bulleted_list_item":
                console.log(e.bulleted_list_item)

                cont = {
                    type: "paragraph",
                    content: [{
                        plain_text: "•　",
                        type: "text",
                        text: {
                            content: "•　"
                        }
                    }, ...e.bulleted_list_item.rich_text]
                }
                break;
            default:
                // all data type unsupported assume its paragraph
                console.log(e)
                console.error("unsupported block type")
                cont = {
                    type: "paragraph",
                    content: []
                }
                break;
        }
        content.push(cont)
    }

    return {
        title: post.properties.title.title[0].plain_text,
        description: post.properties.description.rich_text[0].plain_text,
        content: content,
        raw: blocks
    }
}

function getReturnType<R>(f: (...args: any[]) => R): { returnType: R } {
    return null!;
}

// dummy variable, used for retrieving toast return type only
let PostType = getReturnType(getPost);
export type GetPostReturnType = typeof PostType.returnType;

import { prisma } from "lib/prisma"

export const getCasaHouseReserve = async ({
    month,
    year,
}: {
    year: string,
    month: string
}) => {
    const startTimeOfTheMonth = new Date(parseInt(year), parseInt(month) - 1, -1);
    const endTimeOfTheMonth = new Date(parseInt(year), parseInt(month));

    const days = await prisma.reserve.findMany({
        where: {
            startedAt: {
                // gte, lte
                gte: startTimeOfTheMonth,
                lte: endTimeOfTheMonth,
            }, room: {
                equals: "CASAHOUSE"
            }
        }, select: {
            startedAt: true,
            endedAt: true,
            purpose: true,
            id:true,
            user: {
                select: {
                    student_id: true,
                    name: true,
                }
            }
        }
    })

    return days;
}

export const getMojoDojoReserve = async ({
    month,
    year,
}: {
    year: string,
    month: string
}) => {
    const startTimeOfTheMonth = new Date(parseInt(year), parseInt(month) - 1, -1);
    const endTimeOfTheMonth = new Date(parseInt(year), parseInt(month));

    const days = await prisma.reserve.findMany({
        where: {
            AND: {
                startedAt: {
                    // gte, lte
                    gte: startTimeOfTheMonth,
                    lte: endTimeOfTheMonth,
                },
                room: { equals: 'MOJODOJO' }
            }
        }, select: {
            startedAt: true,
            endedAt: true,
            purpose: true,
            id:true,
            user: {
                select: {
                    student_id: true,
                    name: true,
                }
            }
        }
    })
    console.log(days)
    return days;
}