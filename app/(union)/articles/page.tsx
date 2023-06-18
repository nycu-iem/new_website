import Head from 'next/head'

import { Card, CardCta, CardDescription, CardEyebrow, CardTitle } from '../../../components/Card'
import { SimpleLayout } from '../../../components/SimpleLayout'
import { formatDate } from '../../../lib/formatDate'

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
    const articles = await getArticles();

    return (
        <>
            <Head>
                <title>Articles - Spencer Sharp</title>
                <meta
                    name="description"
                    content="All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order."
                />
            </Head>
            <SimpleLayout
                title="Writing on software design, company building, and the aerospace industry."
                intro="All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order."
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

const getArticles = async () => {
    const posts: {
        slug: string,
        title: string,
        date: string,
        description: string,
    }[] = [
        {
            slug: "abc",
            title: "Hello",
            date: "sometime",
            description: "Description of hello"
        }, {
            slug: "cba",
            title: "Hola",
            date: "sometime",
            description: "Description of hola"
        }, {
            slug: "acb",
            title: "こんにちは",
            date: "sometime",
            description: "Description of こんにちは"
        }
    ].slice(0, 4);

    return posts;
}