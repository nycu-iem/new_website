import { cache } from "react"

export const getPosts = async ({ isHomePage }: { isHomePage: boolean }) => {
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

    return isHomePage ? posts.filter((post) => (post.highlight === true)) : posts;
    // return posts
}

const trim = (str: string) => {
    var newStr = str.replace(/-/g, "");
    return newStr;
}