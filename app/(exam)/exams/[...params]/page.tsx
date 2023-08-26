import { notFound } from "next/navigation";
import { getExams } from "../../notion_api"
import { notion } from "lib/notion";

import NotionPdf from "components/NotionFile";
import NotionImage from "components/NotionImage";

export default async function SectionPage({
    params,
    searchParams,
}: {
    params: { params: Array<string> },
    searchParams: { [key: string]: string | string[] | undefined }
}) {

    let blocks;
    let page;
    try {
        blocks = await getExams({ pageId: params.params[0] });
        page = await notion.getPage({ pageId: params.params[0] });
        console.log(blocks)
        if (blocks.object === 'error') {
            throw new Error("page not found")
        }
    } catch (err) {
        return notFound();
    }

    return (
        <div>
            <div className='py-5 font-bold text-2xl'>
                {page.properties['標題'].title[0].plain_text}
            </div>

            {blocks.results.map((block: any) => {
                // console.log(block)
                switch (block.type) {
                    case "paragraph":
                        const text = block.paragraph.rich_text[0].plain_text;
                        const result = /{(.*)}/.exec(text)?.[1]
                        if (result) {
                            // header
                            return (
                                <div key={block.id}
                                    id={result ?? undefined}
                                    className="text-xl py-3 font-bold ">
                                    {result}
                                </div>
                            )
                        }
                        // normal text
                        return (
                            <div key={block.id}>
                                {block.paragraph.rich_text[0].plain_text}
                            </div>
                        )
                    case "file":
                        return (
                            <NotionPdf
                                key={block.id}
                                blockId={block.id}
                                fileSrc={block.file.file.url}
                            />
                        )
                    case "image":
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