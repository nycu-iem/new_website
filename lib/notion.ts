const revalidate_time = 60 * 1; // in second
import { avoidRateLimit } from "./avoidRateLimit";

class NotionClient {
    getPage = async ({
        pageId
    }: {
        pageId: string
    }) => {
        await avoidRateLimit()
        const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NOTION_SECRET}`,
                "Notion-Version": "2022-06-28"
            }, next: {
                revalidate: revalidate_time
            }
        })

        return res.json();
    }

    getDatabase = async ({
        pageId,
    }: {
        pageId: string
    }) => {
        await avoidRateLimit()

        const res = await fetch(`https://api.notion.com/v1/databases/${pageId}/query`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NOTION_SECRET}`,
                "Notion-Version": "2022-06-28"
            }, next: {
                revalidate: revalidate_time
            }
        })

        return res.json();
    }

    getBlocks = async ({
        pageId,
    }: {
        pageId: string
    }) => {
        await avoidRateLimit()

        const res = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NOTION_SECRET}`,
                "Notion-Version": "2022-06-28"
            }, next: {
                revalidate: 10
            }
        })

        return res.json()
    }

    getBlock = async ({ blockId }: { blockId: string }) => {
        await avoidRateLimit()

        const res = await fetch(`https://api.notion.com/v1/blocks/${blockId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NOTION_SECRET}`,
                "Notion-Version": "2022-06-28"
            }
        })

        return res.json()
    }
}

const globalForNotionAPI = globalThis as unknown as {
    notion: NotionClient | undefined
}

export const notion = globalForNotionAPI.notion ?? new NotionClient()

if (process.env.NODE_ENV !== 'production') globalForNotionAPI.notion = notion