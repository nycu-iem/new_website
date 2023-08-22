const revalidate_time = 60 * 1; // in second

class NotionClient {
    private queue: Array<any> = [];
    private queue_pos: number = 0;

    private fetch_post = async () => {
        const postToDealWith = this.queue_pos++;

        this.queue[postToDealWith] = Promise.resolve(this.queue[postToDealWith])

        return;
    }

    constructor() {
        setInterval(() => {
            if (this.queue.length !== this.queue_pos) {
                this.fetch_post();
            }
        }, 400)
    }

    getPage = async ({
        pageId
    }: {
        pageId: string
    }) => {
        const id = this.queue.length;
        this.queue.push(await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NOTION_SECRET}`,
                "Notion-Version": "2022-06-28"
            }, next: {
                revalidate: revalidate_time
            }
        }))

        return this.queue[id].json();
    }

    getDatabase = async ({
        pageId,
    }: {
        pageId: string
    }) => {
        const id = this.queue.length;

        this.queue.push(await fetch(`https://api.notion.com/v1/databases/${pageId}/query`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NOTION_SECRET}`,
                "Notion-Version": "2022-06-28"
            }, next: {
                revalidate: revalidate_time
            }
        }))
        return this.queue[id].json();
    }

    getBlocks = async ({
        pageId,
    }: {
        pageId: string
    }) => {
        const id = this.queue.length;

        this.queue.push(await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NOTION_SECRET}`,
                "Notion-Version": "2022-06-28"
            }, next: {
                revalidate: 10
            }
        }))

        return this.queue[id].json();
    }

    getBlock = async ({ blockId }: { blockId: string }) => {
        const id = this.queue.length;

        this.queue.push(await fetch(`https://api.notion.com/v1/blocks/${blockId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NOTION_SECRET}`,
                "Notion-Version": "2022-06-28"
            }
        }))

        return this.queue[id].json();
    }
}

const globalForNotionAPI = globalThis as unknown as {
    notion: NotionClient | undefined
}

export const notion = globalForNotionAPI.notion ?? new NotionClient()

if (process.env.NODE_ENV !== 'production') globalForNotionAPI.notion = notion