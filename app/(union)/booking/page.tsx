"use client"
import { Switch } from '@headlessui/react'
import { Section } from '../../../components/Section'
import { SimpleLayout } from '../../../components/SimpleLayout'
import React, { Dispatch, SetStateAction, useState } from 'react'
import clsx from 'clsx'
import CalendarMonth from '../../../components/calendar/Month'

function SpeakingSection({ children, ...props }: { children: React.ReactNode, title: string }) {
    return (
        <Section {...props}>
            <div className="space-y-16">{children}</div>
        </Section>
    )
}

export default function RoomRenting() {
    const [calendarType, setCalendarType] = useState<boolean>(false);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    return (
        <SimpleLayout
            title="公共空間租借"
            intro="系學會空間出借"
        >
            <div className="space-y-8">
                <SpeakingSection title="MOJO DOJO CASA HOUSE">
                    <OnOffSwitch
                        enable={calendarType}
                        setEnable={setCalendarType}
                        text={calendarType ? "單周顯示" : "整月顯示"}
                    />
                    {calendarType ?
                        <CalendarDetailedView />
                        :
                        <CalendarSeperate />}
                </SpeakingSection>
            </div>
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

function CalendarSeperate() {
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
    const [hoverDate, setHoverDate] = useState<number>(NaN);
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
    const [daysWithEvent, setDaysWithEvent] = useState([1, 2, 4, 8, 9, 13, 16, 22]);
    const [reserve, setReserve] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

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