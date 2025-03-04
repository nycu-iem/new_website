import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { Button } from 'components/Button'
import { Card, CardTitle, CardCta, CardDescription, CardEyebrow } from 'components/Card'
import { Container } from 'components/Container'
import {
    InstagramIcon,
    TwitterIcon,
    FacebookIcon
} from 'components/Icon'

import { formatDate } from 'lib/formatDate'
import { notion } from 'lib/notion'


function MailIcon(props: any) {
    return (
        <svg viewBox="0 0 24 24"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            <path d="M2.75 7.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
                className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
            />
            <path d="m4 6 6.024 5.479a2.915 2.915 0 0 0 3.952 0L20 6"
                className="stroke-zinc-400 dark:stroke-zinc-500"
            />
        </svg>
    )
}

function BriefcaseIcon(props: any) {
    return (
        <svg viewBox="0 0 24 24"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            <path d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
                className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
            />
            <path d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5"
                className="stroke-zinc-400 dark:stroke-zinc-500"
            />
        </svg>
    )
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
    const properties = article.properties;
    // console.log(article)
    // console.log(properties.description)
    // console.log(properties.title)
    return (
        <Card as="article">
            <CardTitle href={`/articles/${article.id}`}>
                {clsx(properties.title.title.map(t => (t.plain_text)))}
            </CardTitle>
            <CardEyebrow as="time" dateTime={article.last_edited_time} decorate>
                {formatDate(article.last_edited_time)}
            </CardEyebrow>
            <CardDescription>{clsx(properties.description.rich_text.map(t => (t.plain_text)))}</CardDescription>
            <CardCta>Read article</CardCta>
        </Card>
    )
}

function SocialLink({ icon: Icon, ...props }: { icon: any, href: string }) {
    return (
        <Link className="group -m-1 p-1" {...props}>
            <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
        </Link>
    )
}

function Newsletter() {
    return (
        <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
            <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                <MailIcon className="h-6 w-6 flex-none" />
                <span className="ml-3">聯絡我們</span>
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                你們的鼓勵以及指教，一直是我們系學會持續下去的動力，敬請填寫回饋表單。
            </p>
            <div className="mt-6 flex justify-end">
                {/* <input
                    type="email"
                    placeholder="Email address"
                    aria-label="Email address"
                    required
                    className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm"
                /> */}
                {/* TODO: awaiting report form */}
                <Button className="ml-4 flex-none" href="https://forms.gle/uaWQiyeHZoyqX7CZA">
                    填寫表單
                </Button>
            </div>
        </div>
    )
}

function Resume() {
    let resume: {
        company: string,
        title: string,
        href: string,
        start: string | { label: string, dateTime: any },
        end: string | { label: string, dateTime: any }
    }[] = [
            {
                company: '國立陽明交通大學',
                title: '管理學院',
                href: "/images/logos/nycu.png",
                start: '2021',
                end: {
                    label: 'Present',
                    dateTime: new Date().getFullYear(),
                },
            },
            {
                company: '國立交通大學',
                title: '管理學院',
                href: "/images/logos/nctu.png",
                start: '1984',
                end: '2021',
            },
        ]

    return (
        <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
            <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                <BriefcaseIcon className="h-6 w-6 flex-none" />
                <span className="ml-3">隸屬單位</span>
            </h2>
            <ol className="mt-6 space-y-4">
                {resume.map((role, roleIndex) => (
                    <li key={roleIndex} className="flex gap-4">
                        <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                            <Image src={role.href} alt="" fill={true} className="h-7 w-7" unoptimized />
                        </div>
                        <dl className="flex flex-auto flex-wrap gap-x-2">
                            <dt className="sr-only">Company</dt>
                            <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {role.company}
                            </dd>
                            <dt className="sr-only">Role</dt>
                            <dd className="text-xs text-zinc-500 dark:text-zinc-400">
                                {role.title}
                            </dd>
                            <dt className="sr-only">Date</dt>
                            <dd
                                className="ml-auto text-xs text-zinc-400 dark:text-zinc-500"
                                // @ts-ignore
                                aria-label={`${role.start.label ?? role.start} until ${role.end.label ?? role.end}`}
                            >
                                {/* @ts-ignore */}
                                <time dateTime={role.start.dateTime ?? role.start}>
                                    {/* @ts-ignore */}
                                    {role.start.label ?? role.start}
                                </time>{' '}
                                <span aria-hidden="true">—</span>{' '}
                                {/* @ts-ignore */}
                                <time dateTime={role.end.dateTime ?? role.end}>
                                    {/* @ts-ignore */}
                                    {role.end.label ?? role.end}
                                </time>
                            </dd>
                        </dl>
                    </li>
                ))}
            </ol>
            {/* <Button href="#" variant="secondary" className="group mt-6 w-full">
                Download CV
                <ArrowDownIcon className="h-4 w-4 stroke-zinc-400 transition group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50" />
            </Button> */}
        </div>
    )
}

function Photos() {
    let rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2']

    return (
        <div className="mt-16 sm:mt-20 w-full">
            <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8 w-full">
                {["/images/photos/image-1.jpg", "/images/photos/image-2.jpg", "/images/photos/image-3.jpg", "/images/photos/image-4.jpg", "/images/photos/image-5.jpg"].map((uri, imageIndex) => (
                    <div key={uri}
                        className={clsx(
                            'relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl',
                            rotations[imageIndex % rotations.length]
                        )}
                    >
                        <Image src={uri}
                            alt=""
                            fill={true}
                            sizes="(min-width: 640px) 18rem, 11rem"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default async function Home() {
    const results = (await notion.getDatabase({ pageId: "27a55c38f3774cceabedfbce1690347e" })).results
    const articles = results?.filter((arti: any) => {
        return arti.properties.highlight.checkbox
    }) ?? results
    return (
        <>
            <Container className="mt-9">
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                        國立陽明交通大學<br />
                        工業工程與管理學系 系學會
                    </h1>
                    <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                        這裡是陽明交大工工系學會，由一群有著高度熱誠的年輕學子所組成，主要職責為辦理系上各式活動以及管理系上公共設施等。歡迎有興趣的工工系學生加入我們。
                    </p>
                    <div className="mt-6 flex gap-6">
                        <SocialLink
                            href="https://twitter.com/nycu_iemsa"
                            aria-label="Follow on Twitter"
                            icon={TwitterIcon}
                        />
                        <SocialLink
                            href="https://www.facebook.com/IEMhome"
                            aria-label="Follow on Facebook"
                            icon={FacebookIcon}
                        />
                        <SocialLink
                            href="https://www.instagram.com/nycu.iem.sa"
                            aria-label="Follow on Instagram"
                            icon={InstagramIcon}
                        />
                    </div>
                </div>
            </Container>
            <section className="mx-auto lg:w-4/5 xl:px-10 w-full max-w-[80rem]">
                <Photos />
            </section>
            <Container className="mt-24 md:mt-28">
                <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
                    <div className="flex flex-col gap-16">
                        {articles && articles.map((article: any) => (
                            <Article key={article.id} article={article} />
                        ))}
                        {articles.length === 0 && <div>
                            近期無活動
                        </div>}
                    </div>
                    <div className="space-y-10 lg:pl-16 xl:pl-24">
                        <Newsletter />
                        <Resume />
                    </div>
                </div>
            </Container>
        </>
    )
}
