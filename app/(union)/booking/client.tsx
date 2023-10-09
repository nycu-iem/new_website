'use client'

import CalendarMonth from 'components/calendar/Month'
import DayView from 'components/calendar/DayView'
import React, { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { Section } from 'components/Section'
import { Reserve, User } from '@prisma/client'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Button } from 'components/Button'
import { Router } from 'next/router'
import clsx from 'clsx'
import { usePathname, useRouter } from 'next/navigation'
import { Switch } from '@headlessui/react'
import { useSession } from 'next-auth/react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useTheme } from 'next-themes'

import { customToast } from 'components/Toast'

type EventType = Reserve & { user: User }
interface DateTime {
    year?: number,
    month?: number,
    day?: number,
}

export default function BookingClientPage({
    thisMonthData,
}: {
    thisMonthData: {
        MojoDojo: {
            events: any
            daysWithEvents: any
        }, CasaHouse: {
            events: any
            daysWithEvents: any
        }
    }
}) {
    const [reserve, setReserve] = useState<"MOJODOJO" | "CASAHOUSE" | undefined>(undefined);
    const [dateSelected, setDateSelected] = useState<DateTime>({});
    const { themes, resolvedTheme, setTheme } = useTheme()
    const otherTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    const [customTheme, setCustomTheme] = useState<any>(
        createTheme({
            palette: {
                mode: otherTheme === 'dark' ? 'dark' : 'light',
            },
        })
    );
    const [mounted, setMounted] = useState<boolean>(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        setCustomTheme(createTheme({
            palette: {
                mode: resolvedTheme === 'dark' ? 'dark' : 'light',
            },
        }))
    }, [themes])

    return (
        <React.Fragment>
            <ThemeProvider theme={customTheme}>
                <div className="space-y-8">
                    <SpeakingSection title={["MOJO DOJO"]} description="系窩">
                        <CalendarSeperate
                            dateSelected={dateSelected}
                            setDateSelected={setDateSelected}
                            reserve={reserve}
                            setReserve={setReserve}
                            defaultData={thisMonthData.MojoDojo}
                            room="MOJODOJO"
                        />
                    </SpeakingSection>
                    <SpeakingSection title={["CASA HOUSE"]} description="系K">
                        <CalendarSeperate
                            dateSelected={dateSelected}
                            setDateSelected={setDateSelected}
                            reserve={reserve}
                            setReserve={setReserve}
                            defaultData={thisMonthData.CasaHouse}
                            room="CASAHOUSE"
                        />
                    </SpeakingSection>
                </div>

                {reserve && <ReservePrompt
                    reserveRoom={reserve}
                    setReserve={setReserve}
                    dateSelected={dateSelected}
                />}
            </ThemeProvider>
        </React.Fragment>
    )
}

function CalendarSeperate({
    reserve,
    setReserve,
    setDateSelected,
    defaultData,
    room,
}: {
    reserve: "MOJODOJO" | "CASAHOUSE" | undefined,
    setReserve: Dispatch<SetStateAction<"MOJODOJO" | "CASAHOUSE" | undefined>>,
    dateSelected: DateTime,
    setDateSelected: Dispatch<SetStateAction<DateTime>>,
    defaultData: {
        events: Array<EventType>
        daysWithEvents: Array<number>
    },
    room: "MOJODOJO" | "CASAHOUSE"
}) {
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
    const [hoverDate, setHoverDate] = useState<number>(NaN);
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
    const [loading, setLoading] = useState<boolean>(false);
    const [daysWithEvent, setDaysWithEvent] = useState<Array<number>>(defaultData?.daysWithEvents ?? []);
    const [events, setEvents] = useState<Array<EventType>>(defaultData?.events ?? []);
    const [reload, setReload] = useState<boolean>(false);

    const fetchAPI = async () => {
        setLoading(true)
        try {
            if (room === "MOJODOJO") {
                const res = await fetch(`/api/mojodojo/${selectedYear}/${selectedMonth}`, {
                    method: "GET"
                })
                const result: Array<EventType> = await res.json();
                // console.log(result);
                setEvents(result);
                let days: Set<number> = new Set();
                result.map(e => {
                    const a = new Date(e.startedAt).getDate();
                    const b = new Date(e.endedAt).getDate();
                    days.add(a);
                    days.add(b);
                })
                setDaysWithEvent(Array.from(days.values()));
            } else if (room === "CASAHOUSE") {
                const res = await fetch(`/api/casahouse/${selectedYear}/${selectedMonth}`, {
                    method: "GET"
                })
                const result: Array<EventType> = await res.json();
                // console.log(result);
                setEvents(result);
                let days: Set<number> = new Set();
                result.map(e => {
                    const a = new Date(e.startedAt).getDate();
                    const b = new Date(e.endedAt).getDate();
                    days.add(a);
                    days.add(b);
                })
                setDaysWithEvent(Array.from(days.values()));
            }

        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchAPI();
    }, [selectedMonth, selectedYear, reserve, reload])

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
                room={room}
            />
            <div className="mt-8 pl-5 flex flex-row justify-center md:w-80">
                <DayView date={{
                    year: selectedYear,
                    month: selectedMonth,
                    day: isNaN(hoverDate) ? selectedDay : hoverDate,
                }}
                    events={events}
                    setReload={setReload}
                />
            </div>
        </div>
    )
}

function SpeakingSection({ children, ...props }: { children: React.ReactNode, title: string | Array<string>, description?: string }) {
    return (
        <Section {...props}>
            <div className="space-y-16">{children}</div>
        </Section>
    )
}

function ReservePrompt({
    setReserve,
    reserveRoom,
    dateSelected,
}: {
    setReserve: Dispatch<SetStateAction<"MOJODOJO" | "CASAHOUSE" | undefined>>,
    reserveRoom?: "MOJODOJO" | "CASAHOUSE",
    dateSelected: DateTime,
}) {
    const session = useSession();
    const router = useRouter()
    const [timeStarted, setTimeStarted] = useState<Date>(new Date(2023, 0, 0, 0, 0));
    const [timeEnded, setTimeEnded] = useState<Date>(new Date(2023, 0, 0, 0, 0));
    const [purpose, setPurpose] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const pathname = usePathname();
    if (session.status === "unauthenticated") {
        localStorage.setItem('redirect_to', pathname)
        router.push(`/login?${new URLSearchParams({
            text: "請先登入",
            type: "info"
        })}`)
        return <></>
    }

    const reserve = async () => {
        setLoading(true)
        try {
            const start_time = new Date((dateSelected.year ?? 0), (dateSelected.month ?? 1) - 1, dateSelected.day, timeStarted.getHours(), timeStarted.getMinutes())
            const end_time = new Date((dateSelected.year ?? 0), (dateSelected.month ?? 1) - 1,
                (timeEnded.getMinutes() + timeEnded.getHours() * 60 - timeStarted.getHours() * 60 - timeStarted.getMinutes()) < 0 ? (dateSelected.day ?? 0) + 1 : dateSelected.day, timeEnded.getHours(), timeEnded.getMinutes())

            const res = await fetch(`/api/${reserveRoom === "CASAHOUSE" ? "casahouse" : "mojodojo"}/reserve`, {
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
            customToast.success(`預約成功`)
        } catch (err) {
            console.log(err)
            customToast.error(`預約失敗-${err}`);
        }
        setLoading(false)
        setReserve(undefined)
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className='w-screen h-screen z-50 bg-black fixed top-0 left-0 bg-opacity-70 flex flex-row justify-center items-center backdrop-blur-sm'
                onClick={() => { setReserve(undefined) }}
            >
                <div className="bg-white dark:bg-slate-800 rounded-lg max-w-3xl w-[90%] z-50 px-5 py-3 flex flex-col text-black dark:text-gray-50"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            租借空間
                        </div>
                        <div>
                            {reserveRoom}
                        </div>
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
                                required
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
                    }} type="submit">
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