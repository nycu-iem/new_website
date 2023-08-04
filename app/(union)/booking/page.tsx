"use client"
import { Switch } from '@headlessui/react'
import { Section } from '../../../components/Section'
import { SimpleLayout } from '../../../components/SimpleLayout'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import clsx from 'clsx'
import CalendarMonth from '../../../components/calendar/Month'

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
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    return (
        <SimpleLayout
            title="公共空間租借"
            intro="系學會空間出借"
        >
            <div className="space-y-8">
                <SpeakingSection title={["MOJO DOJO", "CASA HOUSE"]}>
                    <OnOffSwitch
                        enable={calendarType}
                        setEnable={setCalendarType}
                        text={calendarType ? "單周顯示" : "整月顯示"}
                    />
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
            {reserve && <div
                className='w-screen h-screen z-50 bg-black fixed top-0 left-0 bg-opacity-70 flex flex-row justify-center items-center '
                onClick={() => { setReserve(false) }}
            >
                <div className="bg-white rounded-lg max-w-3xl w-full z-50 px-5 py-3"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}>
                    <div>

                    </div>
                    <div>
                        選擇日期
                    </div>
                    <div>
                        選擇開始時間
                    </div>
                    <div>
                        預計租借時長
                    </div>
                </div>
            </div>}
        </SimpleLayout>
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
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
    const [hoverDate, setHoverDate] = useState<number>(NaN);
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
    const [daysWithEvent, setDaysWithEvent] = useState<Array<number>>([]);
    // const [reserve, setReserve] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchAPI = async () => {
        setLoading(true)
        setDaysWithEvent([])
        setTimeout(() => {
            setDaysWithEvent([1, 2, 4, 8, 9, 13, 16, 21]);
            setLoading(false)
        }, 1000)
    }

    useEffect(() => {
        fetchAPI();
    }, [selectedMonth, selectedYear])

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
        <div className='flex lg:flex-row flex-col lg:justify-between'>
            <CalendarMonth
                calendarName="Hello"
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                hoverDate={hoverDate}
                setHoverDate={setHoverDate}
                selectedMonth={selectedMonth + 1}
                selectedYear={selectedYear}
                rentedDays={daysWithEvent}
                loading={loading}
                toggleMonth={toggleMonth}
                setReserve={setReserve}
            />
            <div className="w-80 mt-8 pl-5">
                Day: {isNaN(hoverDate) ? selectedDay : hoverDate}
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