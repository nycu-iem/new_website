export const getNotionPost = async ({
    pageId,
}: {
    pageId: string,
}) => {
    const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NOTION_SECRET}`,
            "Notion-Version": "2022-06-28"
        }, next: {
            revalidate: 10
        }
    })
    return await res.json();
}

export const getNotionDatabase = async ({
    pageId
}: {
    pageId: string,
}) => {
    const res = await fetch(`https://api.notion.com/v1/databases/${pageId}/query`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NOTION_SECRET}`,
            "Notion-Version": "2022-06-28"
        }, next: {
            revalidate: 10
        }
    })
    return await res.json();
}

export const getPosts = async ({ isHomePage = false, verify_post }: { isHomePage?: boolean, verify_post?: string }) => {
    const page = "27a55c38f3774cceabedfbce1690347e"
    const res = await fetch(`https://api.notion.com/v1/databases/${page}/query`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NOTION_SECRET}`,
            "Notion-Version": "2022-06-28"
        }, next: {
            revalidate: 10
        }
    })

    const json = await res.json();
    // console.log(json.results[0]);

    // let posts: { slug: string, title: string, date: string, description: string }[] = [];
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
export type ImageType = { type: "image", content: string }
export type QuoteType = { type: "quote", content: any[] }

type ContentType = ParagraphType | ImageType | QuoteType;

export const getPost = async (id: string) => {
    // const post_exist = await getPosts({ verify_post: id });

    // if (post_exist.length) {
    // get post detail

    const res = await fetch(`https://api.notion.com/v1/pages/${id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NOTION_SECRET}`,
            "Notion-Version": "2022-06-28"
        }, next: {
            revalidate: 10
        }
    })
    const post = await res.json();

    const block = await fetch(`https://api.notion.com/v1/blocks/${id}/children?page_size=100`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NOTION_SECRET}`,
            "Notion-Version": "2022-06-28"
        }, next: {
            revalidate: 10
        }
    })
    const blocks = await block.json();
    // console.log(blocks)

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
                    content: e.image.file.url
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

        // let cont = {
        //     type: e.type,
        //     paragraph: e.paragraph.rich_text[0].plain_text
        // }
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