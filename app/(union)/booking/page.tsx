"use client"
import { Switch } from '@headlessui/react'
import { Section } from '../../../components/Section'
import { SimpleLayout } from '../../../components/SimpleLayout'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import clsx from 'clsx'
import CalendarMonth from '../../../components/calendar/Month'
import DayView from '../../../components/calendar/DayView'
import { Reserve, User } from '@prisma/client'

import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
// import { timePicker } from "@mui/material"

type EventType = Reserve & { user: User }
type SessionType = ReturnType<typeof useSession>;

interface DateTime {
    year?: number,
    month?: number,
    day?: number,
}

function SpeakingSection({ children, ...props }: { children: React.ReactNode, title: string | Array<string> }) {
    return (
        <Section {...props}>
            <div className="space-y-16">{children}</div>
        </Section>
    )
}

export default function RoomRenting() {
    const [calendarType, setCalendarType] = useState<boolean>(false);
    const [reserve, setReserve] = useState<boolean>(false);
    const [dateSelected, setDateSelected] = useState<DateTime>({});
    // const [loggedIn, setLoggedIn] = useState<boolean>(false);

    return (
        <SessionProvider>

            <SimpleLayout
                title="公共空間租借"
                intro="系學會空間出借"
            >
                <div className="space-y-8">
                    <SpeakingSection title={["MOJO DOJO", "CASA HOUSE"]}>
                        {/* <OnOffSwitch
                        enable={calendarType}
                        setEnable={setCalendarType}
                        text={calendarType ? "單周顯示" : "整月顯示"}
                    /> */}
                        {calendarType ?
                            <CalendarDetailedView />
                            :
                            <CalendarSeperate
                                dateSelected={dateSelected}
                                setDateSelected={setDateSelected}
                                reserve={reserve}
                                setReserve={setReserve}
                            />}
                    </SpeakingSection>
                </div>
                {reserve && <ReservePrompt
                    setReserve={setReserve}
                    dateSelected={dateSelected}
                />}
            </SimpleLayout>
        </SessionProvider>
    )
}

function CalendarDetailedView() {
    return (
        <div>
            Calendar Detailed View
        </div>
    )
}

function CalendarSeperate({
    reserve,
    setReserve,
    dateSelected,
    setDateSelected,
}: {
    reserve: boolean,
    setReserve: Dispatch<SetStateAction<boolean>>,
    dateSelected: DateTime,
    setDateSelected: Dispatch<SetStateAction<DateTime>>,
}) {
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
    const [hoverDate, setHoverDate] = useState<number>(NaN);
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
    const [daysWithEvent, setDaysWithEvent] = useState<Array<number>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [events, setEvents] = useState<Array<EventType>>([]);

    const fetchAPI = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/casahouse/${selectedYear}/${selectedMonth}`, {
                method: "GET"
            })
            const result: Array<EventType> = await res.json();
            console.log(result);
            setEvents(result);
            let days: Set<number> = new Set();
            result.map(e => {
                const a = new Date(e.startedAt).getDate();
                const b = new Date(e.endedAt).getDate();
                days.add(a);
                days.add(b);
            })
            setDaysWithEvent(Array.from(days.values()));
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchAPI();
    }, [selectedMonth, selectedYear,reserve])

    useEffect(() => {
        setDateSelected({
            year: selectedYear,
            month: selectedMonth,
            day: selectedDay,
        })
    }, [selectedDay, selectedMonth, selectedYear])

    const toggleMonth = (val: 1 | -1) => {
        const month = selectedMonth;

        if (month + val > 12) {
            setSelectedMonth(1);
            setSelectedYear(e => e + 1);
        } else if (month + val < 1) {
            setSelectedMonth(12);
            setSelectedYear(e => e - 1);
        } else {
            setSelectedMonth(month + val);
        }
        setSelectedDay(NaN)
    }

    return (
        <div className='flex lg:flex-row flex-col lg:justify-between lg:py-10'>
            <CalendarMonth
                calendarName="Hello"
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                hoverDate={hoverDate}
                setHoverDate={setHoverDate}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                rentedDays={daysWithEvent}
                loading={loading}
                toggleMonth={toggleMonth}
                setReserve={setReserve}
            />
            <div className="mt-8 pl-5 flex flex-row justify-center md:w-80">
                <DayView date={{
                    year: selectedYear,
                    month: selectedMonth,
                    day: isNaN(hoverDate) ? selectedDay : hoverDate,
                }}
                    events={events}
                />
            </div>
        </div>
    )
}

function OnOffSwitch(
    {
        enable,
        setEnable,
        text
    }: {
        enable: boolean,
        setEnable: Dispatch<SetStateAction<boolean>>,
        text?: string
    }
) {
    return (
        <div className="flex flex-row space-x-5">
            <Switch
                id={`${text}-switch`}
                className={clsx(
                    "relative inline-flex h-6 w-11 items-center rounded-full",
                    enable ? "bg-blue-600" : "bg-green-600"
                )}
                checked={enable}
                onChange={() => { setEnable(e => !e) }}>
                <span className="sr-only">Enable notifications</span>
                <span className={clsx(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition",
                    enable ? "translate-x-6" : "translate-x-1"
                )} />
            </Switch>
            {text && <h2>{text}</h2>}
        </div>
    )
}

import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Button } from '../../../components/Button'
import { Router } from 'next/router'

function ReservePrompt({
    setReserve,
    dateSelected,
}: {
    setReserve: Dispatch<SetStateAction<boolean>>,
    dateSelected: DateTime,
}) {
    const session = useSession();
    const router = useRouter()

    if (session.status === "unauthenticated") {
        router.push(`/login?${new URLSearchParams({
            text: "請先登入",
            type: "info"
        })}`)
        return <></>
    }
    const [timeStarted, setTimeStarted] = useState<Date>(new Date(2023, 0, 0, 0, 0));
    const [timeEnded, setTimeEnded] = useState<Date>(new Date(2023, 0, 0, 0, 0));
    const [purpose, setPurpose] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const reserve = async () => {
        setLoading(true)
        try {
            const start_time = new Date((dateSelected.year ?? 0), (dateSelected.month ?? 1) - 1, dateSelected.day, timeStarted.getHours(), timeStarted.getMinutes())
            const end_time = new Date((dateSelected.year ?? 0), (dateSelected.month ?? 1) - 1,
                (timeEnded.getMinutes() + timeEnded.getHours() * 60 - timeStarted.getHours() * 60 - timeStarted.getMinutes()) < 0 ? (dateSelected.day ?? 0) + 1 : dateSelected.day, timeEnded.getHours(), timeEnded.getMinutes())

            const res = await fetch(`/api/casahouse/reserve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }, body: JSON.stringify({
                    start_time,
                    end_time,
                    purpose
                })
            })
            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.error)
            }
            router.push(`/booking?${new URLSearchParams({
                text: "預約成功",
                type: "success"
            })}`)
        } catch (err) {
            console.log(err)
            router.push(`/booking?${new URLSearchParams({
                text: `預約失敗-${err}`,
                type: "error"
            })}`)
        }
        setLoading(false)
        setReserve(false)
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className='w-screen h-screen z-50 bg-black fixed top-0 left-0 bg-opacity-70 flex flex-row justify-center items-center '
                onClick={() => { setReserve(false) }}
            >
                <div className="bg-white rounded-lg max-w-3xl w-[90%] z-50 px-5 py-3 flex flex-col"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            起始日
                        </div>
                        <div>
                            {`${dateSelected.year} ${dateSelected.month} ${dateSelected.day}`}
                        </div>
                        <div className='flex flex-col justify-center'>
                            事由
                        </div>
                        <div>
                            <input value={purpose} type="text"
                                onChange={(e) => { setPurpose(e.target.value) }}
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                            />
                        </div>
                        <div className='flex flex-col justify-center'>
                            開始時間
                        </div>
                        <div>
                            <TimePicker
                                label="開始時間"
                                value={timeStarted}
                                onChange={(event) => {
                                    if (event)
                                        setTimeStarted(event);
                                }} />
                        </div>
                        <div className='flex flex-col justify-center'>
                            結束時間
                        </div>
                        <div>
                            <TimePicker
                                label="結束時間"
                                value={timeEnded}
                                onChange={(event) => {
                                    if (event)
                                        setTimeEnded(event);
                                }} />
                        </div>
                        <div className='col-span-2'>
                            租借時長: {getMinutes(timeEnded.getMinutes() + timeEnded.getHours() * 60 - timeStarted.getHours() * 60 - timeStarted.getMinutes())}
                            {/* {timeStarted.toISOString()}
                            {timeEnded.toISOString()} */}
                        </div>
                    </div>
                    <Button className={clsx(
                        'w-20 mt-5 self-end',
                        loading && "cursor-not-allowed"
                    )} variant='primary' onClick={() => {
                        if (!loading) {
                            reserve();
                        }
                    }}>
                        預約
                    </Button>
                </div>
            </div>
        </LocalizationProvider>
    )
}

const getMinutes = (value: number) => {
    if (value < 0) {
        return `${(value + 1440) / 60}時${paddingZero((value + 1440) % 60)}分 (註: 至隔天)`
    }
    return (Math.floor(value / 60) === 0) ? `${value}分鐘` : `${value / 60}時${paddingZero(value % 60)}分`
}

const paddingZero = (value: string | number) => {
    return `0${value}`.slice(-2);
}