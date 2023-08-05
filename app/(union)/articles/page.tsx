import { Card, CardCta, CardDescription, CardEyebrow, CardTitle } from '../../../components/Card'
import { SimpleLayout } from '../../../components/SimpleLayout'
import { formatDate } from '../../../lib/formatDate'

import { getPosts } from '../../../lib/api'

export const metadata = {
    title: '相關文章 | 陽明交大 工工系學會 | NYCU IEM SA',
}

function Article({ article }: { article: { slug: string, title: string, date: string, description: string } }) {
    return (
        <article className="md:grid md:grid-cols-4 md:items-baseline">
            <Card className="md:col-span-3">
                <CardTitle href={`/articles/${article.slug}`}>
                    {article.title}
                </CardTitle>
                <CardEyebrow
                    as="time"
                    dateTime={article.date}
                    className="md:hidden"
                    decorate
                >
                    {formatDate(article.date)}
                </CardEyebrow>
                <CardDescription>{article.description}</CardDescription>
                <CardCta>Read article</CardCta>
            </Card>
            <CardEyebrow
                as="time"
                dateTime={article.date}
                className="mt-1 hidden md:block"
            >
                {formatDate(article.date)}
            </CardEyebrow>
        </article>
    )
}

export default async function ArticlesIndex() {
    const articles = await getPosts({});
    console.log(articles)
    return (
        <>
            <SimpleLayout
                title="相關文章"
                intro="所有工工系學會的公告以及活動宣傳都在這邊"
            >
                <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
                    <div className="flex max-w-3xl flex-col space-y-16">
                        {articles && articles.map((article) => (
                            <Article key={article.slug} article={article} />
                        ))}
                    </div>
                </div>
            </SimpleLayout>
        </>
    )
}
