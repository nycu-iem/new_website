import { SimpleLayout } from 'components/SimpleLayout'
import React from 'react'
import ClientPage from './client'

import { Reserve, User } from '@prisma/client'
import { getCasaHouseReserve, getMojoDojoReserve } from '@/lib/api'
import Link from "next/link"

export default async function RoomRenting() {
    const thisMonthData = await fetchAPI();

    return (
        <SimpleLayout
            title="公共空間租借"
            intro="系學會空間出借"
        >
            <p>系窩租借規則<Link href="/articles/1557ddbd-0190-4812-990f-3062ca910643"
                className="text-zinc-900 transition dark:text-zinc-400 hover:text-teal-300 dark:hover:text-teal-600 underline"
            >連結！</Link></p>
            <ClientPage thisMonthData={thisMonthData} />
        </SimpleLayout >
    )
}

type EventType = Reserve & { user: User }
interface DateTime {
    year?: number,
    month?: number,
    day?: number,
}

const fetchAPI = async () => {
    const date = new Date();
    let CasaHouseEvents;
    let CasaHouseDaysWithEvents;
    let MojoDojoEvents;
    let MojoDojoDaysWithEvents;

    try {
        const casaHouseResult = await getCasaHouseReserve({
            year: `${date.getFullYear()}`,
            month: `${date.getMonth()}`
        })
        const MojoDojoResult = await getMojoDojoReserve({
            year: `${date.getFullYear()}`,
            month: `${date.getMonth()}`
        })
        CasaHouseEvents = casaHouseResult;
        MojoDojoEvents = MojoDojoResult;
        // setEvents(result);
        let mojoDojoDays: Set<number> = new Set();
        let casaHouseDays: Set<number> = new Set();
        casaHouseResult.map(e => {
            const a = new Date(e.startedAt).getDate();
            const b = new Date(e.endedAt).getDate();
            casaHouseDays.add(a);
            casaHouseDays.add(b);
        })
        MojoDojoResult.map(e => {
            const a = new Date(e.startedAt).getDate();
            const b = new Date(e.endedAt).getDate();
            mojoDojoDays.add(a);
            mojoDojoDays.add(b);
        })
        CasaHouseDaysWithEvents = Array.from(casaHouseDays.values());
        MojoDojoDaysWithEvents = Array.from(mojoDojoDays.values());
        // daysWithEvents = Array.from(days.values());
    } catch (err) {
        console.log(err)
        return {
            MojoDojo: {
                events: MojoDojoEvents,
                daysWithEvents: MojoDojoDaysWithEvents,
            },
            CasaHouse: {
                events: CasaHouseEvents,
                daysWithEvents: CasaHouseDaysWithEvents
            }
        }
    }

    console.log({
        MojoDojo: {
            events: MojoDojoEvents,
            daysWithEvents: MojoDojoDaysWithEvents,
        },
        CasaHouse: {
            events: CasaHouseEvents,
            daysWithEvents: CasaHouseDaysWithEvents
        }
    })

    return {
        MojoDojo: {
            events: MojoDojoEvents,
            daysWithEvents: MojoDojoDaysWithEvents,
        },
        CasaHouse: {
            events: CasaHouseEvents,
            daysWithEvents: CasaHouseDaysWithEvents
        }
    }
}






