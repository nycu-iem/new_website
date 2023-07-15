import { cache } from "react"

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

    let content = [];
    for (let e of blocks.results) {
        let cont = {
            type: e.type,
            paragraph: e.paragraph.rich_text[0].plain_text
        }
        content.push(cont)
    }

    if (post.object !== 'page') {
        return undefined
    }
    return {
        title: post.properties.title.title[0].plain_text,
        description: post.properties.description.rich_text[0].plain_text,
        content: content,
    }

    // return post_exist[0];
    // }

    // return undefined
}