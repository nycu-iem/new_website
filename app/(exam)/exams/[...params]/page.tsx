import { notFound } from "next/navigation";
import { getExams } from "../../notion_api"

export default async function SectionPage({
    params,
    searchParams,
}: {
    params: { params: Array<string> },
    searchParams: { [key: string]: string | string[] | undefined }
}) {

    let blocks;
    try {
        blocks = await getExams({ pageId: params.params[0] });
        if(blocks.object === 'error'){
            throw new Error("page not found")
        }
    } catch (err) {
        return notFound();
    }

    // console.log(blocks)

    // return <></>

    return (
        <div>
            {blocks.results.map((block: any) => {
                // console.log(block)
                switch (block.type) {
                    case "paragraph":
                        const text = block.paragraph.rich_text[0].plain_text;
                        const result = /{(.*)}/.exec(text)?.[1]
                        if (result) {
                            // header
                            return (
                                <div key={block.paragraph.rich_text[0].plain_text}
                                    id={result ?? undefined}
                                    className="text-xl py-3 font-bold ">
                                    {result}
                                </div>
                            )
                        }
                        // normal text
                        return (
                            <div key={block.paragraph.rich_text[0].plain_text}>
                                {block.paragraph.rich_text[0].plain_text}
                            </div>
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