import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from 'components/Container'
import {
    FacebookIcon,
    InstagramIcon,
    TwitterIcon,
} from 'components/Icon'

export const metadata = {
    title: '系學會組成介紹 | 陽明交大 工工系學會 | NYCU IEM SA'
}

function SocialLink({ className, href, children, icon: Icon }: { className?: string, href: string, children: React.ReactNode, icon: any }) {
    return (
        <li className={clsx(className, 'flex')}>
            <Link href={href}
                className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
            >
                <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
                <span className="ml-4">{children}</span>
            </Link>
        </li>
    )
}

function MailIcon(props: any) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path fillRule="evenodd"
                d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
            />
        </svg>
    )
}

export default function About() {
    return (
        <>
            <Container className="mt-16 sm:mt-32">
                <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
                    <div className="lg:pl-20">
                        <div className="max-w-xs px-2.5 lg:max-w-12 relative aspect-square">
                            <Image src="/images/logos/iem.png"
                                alt=""
                                fill={true}
                                sizes="(min-width: 1024px) 32rem, 20rem"
                                className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
                            />
                        </div>
                    </div>
                    <div className="lg:order-first lg:row-span-2">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                            陽明交大工工系學會
                        </h1>
                        <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
                            <p>
                                大家好！我們是陽明交通大學工業工程與管理學系學會。
                            </p>
                            <p>
                                國立陽明交通大學工業工程與管理學系系學會(以下簡稱系學會)，唯以交大工工系大學部為主體的學生自治組織，凡為交大工工系大學部之學生皆為本會之當然成員。
                                成立宗旨以爭取與維護會員權益為基本原則，並為系上事務給與協助。目前系學會設置會長一名、副會長一名、幹部及組員若干名。任期為一學年，採學年制。
                            </p>
                            <p>
                                系學會所提供之事務相當廣泛，舉凡舉辦活動增進系上學生情誼、提升系上同學向心力、學習力、建立學生與教授間溝通的管道以及增加和其他系交流的機會都是系學會所努力的方向。
                            </p>
                            <p>
                                秉持著服務的精神，系學會希望能與各成員一起創造更美好的工工系，也期許每一位對於工工系有美好願景的同學一通參與，為工工系奮鬥。
                            </p>
                        </div>
                    </div>
                    <div className="lg:pl-20">
                        <ul role="list">
                            <SocialLink href="https://twitter.com/nycu_iemsa" icon={TwitterIcon}>
                                Follow on Twitter
                            </SocialLink>
                            <SocialLink href="https://www.instagram.com/nycu.iem.sa" icon={InstagramIcon} className="mt-4">
                                Follow on Instagram
                            </SocialLink>
                            <SocialLink href="https://www.facebook.com/IEMhome" icon={FacebookIcon} className="mt-4">
                                Follow on Facebook
                            </SocialLink>
                            <SocialLink
                                href="mailto:iemsa.nycu@gmail.com"
                                icon={MailIcon}
                                className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
                            >
                                iemsa.nycu@gmail.com
                            </SocialLink>
                        </ul>
                    </div>
                </div>
            </Container>
        </>
    )
}
