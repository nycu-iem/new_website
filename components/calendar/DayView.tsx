import clsx from "clsx"
import React, { useRef, useEffect, useState } from "react"
import { Reserve, User } from "@prisma/client";

type EventType = Reserve & { user: User }

interface ColorSet {
    bgColor: string,
    hoverColor: string,
    textColor: string,
    timeColor: string,
    groupHoverTextColor: string
}

type EventWithColor = EventType & ColorSet;

export default function DayView({
    date,
    events
}: {
    date: { year: number, month: number, day: number }
    events: Array<EventType>
}) {
    const [weekDay, setWeekDay] = useState<number>(0);
    const [eventsToday, setEventsToday] = useState<Array<EventWithColor>>([]);

    useEffect(() => {
        updateList();
        updateWeekDay();
    }, [date])

    const updateList = async () => {
        // console.log(events)
        const event_today = events.filter((event) => {
            const start = new Date(event.startedAt).getDate();
            const end = new Date(event.endedAt).getDate();
            if (start === date.day || end === date.day) {
                return true;
            }
            return false;
        })
        const event_today_with_color = event_today.map((event, cnt) => ({
            ...event,
            ...colorSet[cnt % 3],
        }))
        setEventsToday(event_today_with_color);
    }

    const updateWeekDay = () => {
        const day = new Date(date.year, date.month - 1, date.day);
        // console.log(date.year, date.month - 1, date.day)
        setWeekDay(day.getDay());
    }

    return (
        <div className="w-full bg-white dark:bg-slate-800 rounded-lg pt-5">
            <div className="text-center text-black dark:text-white">
                {weekInEng(weekDay)} {date.day}
            </div>
            <div className="mt-10">
                <ol className="w-full space-y-5 select-none">
                    {eventsToday.map((event) => (
                        <li className="relative mt-px flex w-full text-black dark:text-white" key={`${event.startedAt} ${event.purpose}`}>
                            <div className={clsx("flex flex-col rounded-lg p-2 text-xs w-full", event.bgColor, `hover:${event.hoverColor}`)}>
                                <p className={clsx("order-1 font-semibold", event.timeColor)}>{event.user.name === "anonymous" ? event.user.student_id : event.user.name}</p>
                                <p className={clsx("order-1 font-semibold", event.textColor)}>{event.purpose}</p>
                                <div className={clsx("flex flex-row justify-between", event.timeColor, `group-hover:${event.groupHoverTextColor}`)}>
                                    <time dateTime="2022-01-12T06:00">{formatTimeOutput(event.startedAt)}</time>
                                    <time dateTime="2022-01-12T06:00">{formatTimeOutput(event.endedAt)}</time>
                                </div>
                            </div>
                        </li>
                    ))}
                    {eventsToday.length === 0 && <li className="text-center text-black dark:text-white">無預約</li>}
                </ol>
            </div>
        </div >
    )
}

const colorSet: Array<ColorSet> = [
    {
        bgColor: "bg-blue-50", hoverColor: "bg-blue-100", textColor: "text-blue-700", timeColor: "text-blue-500", groupHoverTextColor: "text-blue-700"
    }, {
        bgColor: "bg-pink-50", hoverColor: "bg-pink-100", textColor: "text-pink-700", timeColor: "text-pink-500", groupHoverTextColor: "text-pink-700"
    }, {
        bgColor: "bg-gray-100", hoverColor: "bg-gray-200", textColor: "text-gray-700", timeColor: "text-gray-500", groupHoverTextColor: "text-gray-700"
    }
]

const weekInEng = (value: number) => {
    switch (value) {
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        case 0:
            return "Sunday";
        default:
            return "undefined";
    }
}

const formatTimeOutput = (time: Date) => {
    const date = new Date(time)
    return `${paddingZero(((date.getHours() - 1) % 12) + 1)}:${paddingZero(date.getMinutes())} ${date.getHours() >= 12 ? "PM" : "AM"}`
}

const paddingZero = (value: number) => {
    return `0${value}`.slice(-2);
}