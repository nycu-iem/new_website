import Image from 'next/image'

import { Card, CardLink, CardDescription } from 'components/Card'
import { SimpleLayout } from 'components/SimpleLayout'
import facebookIcon from 'public/images/logos/facebook.svg'
import logoPlanetaria from 'public/images/logos/planetaria.svg'
import googleFormsIcon from 'public/images/logos/google_forms.png'
import { Suspense } from 'react'

export const metadata = {
    title: '相關活動 | 陽明交大 工工系學會 | NYCU IEM SA',
}

const page = [
    {
        name: 'Planetaria',
        description:
            'Creating technology to empower civilians to explore space on their own terms.',
        link: { href: 'http://planetaria.tech', label: 'planetaria.tech' },
        logo: logoPlanetaria,
    }
]

const team = [
    {
        name: '系羽',
        description: "系上的羽球隊，連結是系羽社群",
        link: { href: "https://www.facebook.com/groups/125387687561451", label: "facebook.com" },
        logo: facebookIcon
    }, {
        name: "男籃",
        description: "系上的男子籃球隊，連結是隊長的 Facebook",
        link: { href: "https://www.facebook.com/profile.php?id=100006992283746", label: "facebook.com" },
        logo: facebookIcon
    }, {
        name: "男排",
        description: "系上的男子排球隊，連結是入隊表單",
        link: { href: "https://docs.google.com/forms/d/e/1FAIpQLSdRHl7qlcy7FPVdT4WiNcvLoPVLqi6_cCs49HMu0FgtPDEDjw/viewform?usp=sf_link", label: "docs.google.com" },
        logo: googleFormsIcon
    }, {
        name: "女排",
        description: "系上的女子排球隊，連結是女排社群",
        link: { href: "https://facebook.com/groups/1707578539378408", label: "facebook.com" },
        logo: facebookIcon
    }
]

function LinkIcon(props: any) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path
                d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm-4.95 1.768a.75.75 0 0 0 1.06-1.06l-1.06 1.06Zm-2.475-1.414a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm4.95-1.768a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.359.53-.884.884 1.06 1.06.885-.883-1.061-1.06Zm-4.95-2.12 1.414-1.415L12 6.344l-1.415 1.413 1.061 1.061Zm0 3.535a2.5 2.5 0 0 1 0-3.536l-1.06-1.06a4 4 0 0 0 0 5.656l1.06-1.06Zm4.95-4.95a2.5 2.5 0 0 1 0 3.535L17.656 12a4 4 0 0 0 0-5.657l-1.06 1.06Zm1.06-1.06a4 4 0 0 0-5.656 0l1.06 1.06a2.5 2.5 0 0 1 3.536 0l1.06-1.06Zm-7.07 7.07.176.177 1.06-1.06-.176-.177-1.06 1.06Zm-3.183-.353.884-.884-1.06-1.06-.884.883 1.06 1.06Zm4.95 2.121-1.414 1.414 1.06 1.06 1.415-1.413-1.06-1.061Zm0-3.536a2.5 2.5 0 0 1 0 3.536l1.06 1.06a4 4 0 0 0 0-5.656l-1.06 1.06Zm-4.95 4.95a2.5 2.5 0 0 1 0-3.535L6.344 12a4 4 0 0 0 0 5.656l1.06-1.06Zm-1.06 1.06a4 4 0 0 0 5.657 0l-1.061-1.06a2.5 2.5 0 0 1-3.535 0l-1.061 1.06Zm7.07-7.07-.176-.177-1.06 1.06.176.178 1.06-1.061Z"
                fill="currentColor"
            />
        </svg>
    )
}

export default function Projects() {
    return (
        <Suspense fallback={null}>
            <SimpleLayout
                title="相關活動"
                intro="系上最近將舉辦的活動，以及系隊組成"
            >
                <ul role="list"
                    className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {team.map((project) => (
                        <Card as="li" key={project.name}>
                            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                                <Image src={project.logo}
                                    alt=""
                                    className="h-8 w-8"
                                    unoptimized
                                />
                            </div>
                            <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
                                <CardLink href={project.link.href} _blank={true}>{project.name}</CardLink>
                            </h2>
                            <CardDescription>{project.description}</CardDescription>
                            <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
                                <LinkIcon className="h-6 w-6 flex-none" />
                                <span className="ml-2">{project.link.label}</span>
                            </p>
                        </Card>
                    ))}
                </ul>
                <hr className='my-10' />
                {/* <ul role="list" className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                    {page.map((project) => (
                        <Card as="li" key={project.name}>
                            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                                <Image src={project.logo}
                                    alt=""
                                    className="h-8 w-8"
                                    unoptimized
                                />
                            </div>
                            <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
                                <CardLink href={project.link.href}>{project.name}</CardLink>
                            </h2>
                            <CardDescription>{project.description}</CardDescription>
                            <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
                                <LinkIcon className="h-6 w-6 flex-none" />
                                <span className="ml-2">{project.link.label}</span>
                            </p>
                        </Card>
                    ))}
                </ul> */}
            </SimpleLayout>
        </Suspense>
    )
}
