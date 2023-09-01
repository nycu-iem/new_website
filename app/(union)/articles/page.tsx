import { Card, CardCta, CardDescription, CardEyebrow, CardTitle } from 'components/Card'
import { SimpleLayout } from 'components/SimpleLayout'
import { formatDate } from 'lib/formatDate'
import { clsx } from "clsx"
// import { getPosts } from 'lib/api'
import { notion } from "lib/notion"

export const metadata = {
    title: '相關文章 | 陽明交大 工工系學會 | NYCU IEM SA',
}

function Article({ article }: {
    article: {
        properties: {
            highlight: { checkbox: boolean },
            description: {
                rich_text: Array<{
                    plain_text: string
                }>
            },
            title: {
                title: Array<{
                    plain_text: string
                }>
            }
        },
        id: string,
        last_edited_time: string
    }
}) {
    return (
        <article className="md:grid md:grid-cols-4 md:items-baseline">
            <Card className="md:col-span-3">
                <CardTitle href={`/articles/${article.id}`}>
                    {clsx(article.properties.title.title.map(t => t.plain_text))}
                </CardTitle>
                <CardEyebrow
                    as="time"
                    dateTime={article.last_edited_time}
                    className="md:hidden"
                    decorate
                >
                    {formatDate(article.last_edited_time)}
                </CardEyebrow>
                <CardDescription>{clsx(article.properties.description.rich_text.map(t => t.plain_text))}</CardDescription>
                <CardCta>Read article</CardCta>
            </Card>
            <CardEyebrow
                as="time"
                dateTime={article.last_edited_time}
                className="mt-1 hidden md:block"
            >
                {formatDate(article.last_edited_time)}
            </CardEyebrow>
        </article>
    )
}

export default async function ArticlesIndex() {
    const articles = (await notion.getDatabase({ pageId: "27a55c38f3774cceabedfbce1690347e" })).results;
    // console.log(articles)
    return (
        <>
            <SimpleLayout
                title="相關文章"
                intro="所有工工系學會的公告以及活動宣傳都在這邊"
            >
                <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
                    <div className="flex max-w-3xl flex-col space-y-16">
                        {articles && articles.map((article: any) => (
                            <Article key={article.id} article={article} />
                        ))}
                    </div>
                </div>
            </SimpleLayout>
        </>
    )
}
