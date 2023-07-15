import Head from 'next/head'

import { Card, CardTitle, CardEyebrow, CardDescription, CardCta } from '../../../components/Card'
import { Section } from '../../../components/Section'
import { SimpleLayout } from '../../../components/SimpleLayout'
import React from 'react'

export const metadata = {
    title: '公開文件 | 陽明交大 工工系學會 | NYCU IEM SA',
}

function SpeakingSection({ children, ...props }: { children: React.ReactNode, title: string }) {
    return (
        <Section {...props}>
            <div className="space-y-16">{children}</div>
        </Section>
    )
}

function Appearance({ title, description, event, cta, href }: { title: string, description: string, event: string, cta: string, href: string }) {
    return (
        <Card as="article">
            <CardTitle as="h3" href={href}>
                {title}
            </CardTitle>
            <CardEyebrow decorate>{event}</CardEyebrow>
            <CardDescription>{description}</CardDescription>
            <CardCta>{cta}</CardCta>
        </Card>
    )
}

export default function Speaking() {
    return (
        <>
            <SimpleLayout
                title="公開文件"
                intro="資料公開是本會所秉持的信念，故所有會議記錄只要能公開的都會放在這邊"
            >
                <div className="space-y-20">
                    <SpeakingSection title="組織章程">
                        <Appearance
                            href="#"
                            title="工工系學會組織章程"
                            description="其實沒有"
                            event="XXX年系學會議"
                            cta="檔案不存在"
                        />
                        {/* <Appearance
                            href="#"
                            title="Lessons learned from our first product recall"
                            description="They say that if you’re not embarassed by your first version, you’re doing it wrong. Well when you’re selling DIY space shuttle kits it turns out it’s a bit more complicated."
                            event="Business of Startups 2020"
                            cta="Watch video"
                        /> */}
                    </SpeakingSection>
                    <SpeakingSection title="會議記錄">
                        <Appearance
                            href="/files/工工系學會第一次會議紀錄.pdf"
                            title="112年工工系學會第一次會議紀錄"
                            description="討論上學期的活動概要以及成員小破冰"
                            event="線上會議, July 2023"
                            cta="立即查看"
                        />
                        {/* <Appearance
                            href="#"
                            title="Bootstrapping an aerospace company to $17M ARR"
                            description="The story of how we built one of the most promising space startups in the world without taking any capital from investors."
                            event="The Escape Velocity Show, March 2022"
                            cta="Listen to podcast"
                        />
                        <Appearance
                            href="#"
                            title="Programming your company operating system"
                            description="On the importance of creating systems and processes for running your business so that everyone on the team knows how to make the right decision no matter the situation."
                            event="How They Work Radio, September 2021"
                            cta="Listen to podcast"
                        /> */}
                    </SpeakingSection>
                </div>
            </SimpleLayout>
        </>
    )
}
