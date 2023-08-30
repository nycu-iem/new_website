import { SimpleLayout } from 'components/SimpleLayout'
import React from 'react'
import ClientPage from './client'

import { Reserve, User } from '@prisma/client'
import { getCasaReserve } from '../../api/casahouse/[year]/[month]/route'


export default async function RoomRenting() {
    const thisMonthData = await fetchAPI();

    return (
        <SimpleLayout
            title="公共空間租借"
            intro="系學會空間出借"
        >
            <ClientPage thisMonthData={thisMonthData} />
        </SimpleLayout>
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
    let events;
    let daysWithEvents;
    try {
        // const res = await fetch(`/api/casahouse/${date.getFullYear()}/${date.getMonth() + 1}`, {
        //     method: "GET"
        // })
        const result = await getCasaReserve({
            year: `${date.getFullYear()}`,
            month: `${date.getMonth()}`
        })
        // const result: Array<EventType> = await res.json();
        // console.log(result);
        events = result;
        // setEvents(result);
        let days: Set<number> = new Set();
        result.map(e => {
            const a = new Date(e.startedAt).getDate();
            const b = new Date(e.endedAt).getDate();
            days.add(a);
            days.add(b);
        })
        daysWithEvents = Array.from(days.values());
        // setDaysWithEvent(Array.from(days.values()));
    } catch (err) {
        console.log(err)
        return {
            events,
            daysWithEvents,
        }
    }

    console.log({
        events,
        daysWithEvents,
    })

    return {
        events,
        daysWithEvents,
    }
}






