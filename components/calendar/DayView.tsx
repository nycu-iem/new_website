import clsx from "clsx"
import React, { useRef, useEffect, useState } from "react"
import { Reserve, User } from "@prisma/client";
import { CheckCircleIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { customToast } from "../Toast";
import { Dispatch, SetStateAction } from "react";
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
    events,
    // setReserve,
    setReload
}: {
    date: { year: number, month: number, day: number }
    events: Array<EventType>
    // setReserve: Dispatch<SetStateAction<"MOJODOJO" | "CASAHOUSE" | undefined>>,
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    const [weekDay, setWeekDay] = useState<number>(0);
    const [eventsToday, setEventsToday] = useState<Array<EventWithColor>>([]);
    const { data } = useSession();
    const [eventEdit, setEventEdit] = useState<string>("");
    const [updatedEventName, setUpdatedEventName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        updateList();
        updateWeekDay();
    }, [date])

    const updateList = async () => {
        const event_today = events.filter((event) => {
            const start = new Date(event.startedAt).getDate();
            const end = new Date(event.endedAt).getDate();
            if (start === date.day || end === date.day) {
                return true;
            }
            return false;
        }).sort((a, b) => ((a.startedAt > b.startedAt ? 1 : -1)))
        const event_today_with_color = event_today.map((event, cnt) => ({
            ...event,
            ...colorSet[cnt % 3],
        }))
        setEventsToday(event_today_with_color);
    }

    const updateWeekDay = () => {
        const day = new Date(date.year, date.month - 1, date.day);
        setWeekDay(day.getDay());
    }

    const removeEvent = async (id: string) => {
        if (loading) {
            return;
        }
        setLoading(true)
        const confirm = await Swal.fire({
            title: '確定要刪除活動？',
            text: "如果刪錯需要重新預約",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '刪除'
        })

        if (confirm.isConfirmed) {
            try {
                const res = await fetch(`/api/reserve/remove`, {
                    method: "POST",
                    body: JSON.stringify({
                        id
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                })
                const result = await res.json();
                if (res.status === 200) {
                    customToast.success("刪除成功")
                } else {
                    customToast.error(`刪除失敗-${result.message}`)
                }

            } catch (err) {
                console.log(err)
                customToast.error(`刪除失敗-${err}`)
            }
            setReload(r => (!r))
        }
        setLoading(false)
    }

    const submitEditEvent = async () => {
        if (loading) {
            return;
        }

        setLoading(true)
        try {
            const res = await fetch('/api/reserve/edit', {
                method: "POST",
                body: JSON.stringify({
                    id: eventEdit,
                    new_title: updatedEventName,
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
            const result = await res.json();
            if (res.status === 200) {
                customToast.success("更新成功");
            } else {
                customToast.error(`更新失敗-${result.message}`)
            }
        } catch (err) {
            console.log(err);
            customToast.error(`更新失敗-${err}`)
        }
        setReload(r => (!r))
        setLoading(false)
        setEventEdit("")
        setUpdatedEventName("")
    }

    return (
        <div className="w-full bg-white dark:bg-inherit rounded-lg pt-5">
            <div className="text-center text-black dark:text-white">
                {date.day ?
                    `${weekInEng(weekDay)} ${date.day}` :
                    "未指定日期"
                }
            </div>
            <div className="mt-10">
                <ol className="w-full space-y-5 select-none overflow-y-auto h-[22rem]">
                    {eventsToday.map((event) => (
                        <li className="relative mt-px flex w-full text-black dark:text-white relative" key={event.id}>
                            <div className={clsx("flex flex-col rounded-lg p-2 text-xs w-full", event.bgColor, `hover:${event.hoverColor}`)}>
                                <p className={clsx("order-1 font-semibold", event.timeColor)}>{event.user.name === "anonymous" ? event.user.student_id : event.user.name}</p>
                                {event.id === eventEdit ? <form onSubmit={(event) => {
                                    event.preventDefault();
                                    submitEditEvent();
                                }} className="order-1">
                                    <div className="flex flex-row bg-gray-50 w-40 rounded-md ring mt-2 h-6 dark:bg-gray-700">
                                        <input type="text"
                                            value={updatedEventName}
                                            onChange={(event) => { setUpdatedEventName(event.target.value) }}
                                            className="rounded-md px-2 py-0.5 bg-gray-50 outline-none w-36 dark:bg-gray-700"
                                        />
                                        {loading ?
                                            <p>loading...</p>
                                            :
                                            <CheckCircleIcon className="w-6 bg-gray-50 rounded-md cursor-pointer dark:bg-gray-700" onClick={() => {
                                                submitEditEvent();
                                            }} />
                                        }
                                    </div>
                                </form> :
                                    <p className={clsx("order-1 font-semibold", event.textColor)}>{event.purpose}</p>
                                }

                                <div className={clsx("flex flex-row justify-between", event.timeColor, `group-hover:${event.groupHoverTextColor}`)}>
                                    <time dateTime="2022-01-12T06:00">{formatTimeOutput(event.startedAt)}</time>
                                    <time dateTime="2022-01-12T06:00">{formatTimeOutput(event.endedAt)}</time>
                                </div>
                                {event.user.student_id === data?.user.student_id &&
                                    <div className="bottom-3 right-3 absolute flex flex-row space-x-3">
                                        <PencilSquareIcon className="w-6 cursor-pointer hover:scale-125" onClick={() => {
                                            if (eventEdit === event.id) {
                                                setEventEdit("");
                                                setUpdatedEventName("");
                                            } else {
                                                setEventEdit(event.id);
                                                setUpdatedEventName(event.purpose);
                                            }
                                        }} />
                                        <TrashIcon className="w-6 cursor-pointer hover:scale-125" onClick={() => {
                                            removeEvent(event.id);
                                        }} />
                                    </div>
                                }
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
        bgColor: "bg-blue-50 dark:bg-blue-900", hoverColor: "bg-blue-100", textColor: "text-blue-700 dark:text-white", timeColor: "text-blue-500 dark:text-white", groupHoverTextColor: "text-blue-700"
    }, {
        bgColor: "bg-pink-50 dark:bg-pink-900", hoverColor: "bg-pink-100", textColor: "text-pink-700 dark:text-white", timeColor: "text-pink-500 dark:text-white", groupHoverTextColor: "text-pink-700"
    }, {
        bgColor: "bg-gray-100 dark:bg-emerald-900", hoverColor: "bg-gray-200", textColor: "text-gray-700 dark:text-white", timeColor: "text-gray-500 dark:text-white", groupHoverTextColor: "text-gray-700"
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