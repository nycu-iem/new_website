import { notion } from "lib/notion";

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

export type ParagraphType = { type: "paragraph", content: any[] }
export type ImageType = { type: "image", content: string, id: string }
export type QuoteType = { type: "quote", content: any[] }

type ContentType = ParagraphType | ImageType | QuoteType;

export const getPost = async (id: string) => {

    const post = await notion.getPage({
        pageId: id
    })

    console.log(post)

    const blocks = await notion.getBlocks({
        pageId: id
    })

    console.log(blocks)

    if (post.object !== 'page') {
        return undefined
    }

    let content = [];
    for (let e of blocks.results) {
        console.log(e);

        let cont: ContentType;

        switch (e.type) {

            case "image":
                cont = {
                    type: "image",
                    content: e.image.type === 'external' ? e.image.external.url : e.image.file.url,
                    id: e.id
                }
                break;
            case "quote":
                cont = {
                    type: "quote",
                    content: e.quote.rich_text
                }
                break;
            default:
                // all data type unsupported assume its paragraph
                cont = {
                    type: "paragraph",
                    content: e.paragraph.rich_text
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
