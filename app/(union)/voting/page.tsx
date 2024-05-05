"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function VotingPage() {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const { data: session, status } = useSession()

    return (
        <main className="max-w-7xl lg:px-8 w-full mx-auto space-y-10">
            <section className="flex flex-col space-y-5 pt-20 px-5">
                <h1 className="text-4xl font-bold text-center">113學年度系學會長選舉</h1>
                <div className="flex flex-col">
                    <h2 className="text-gray-700 dark:text-slate-200">投票說明</h2>

                    <ul className="list-disc pl-5">
                        <li>選舉期間：即日起至 5/20 23:00</li>
                        <li>正副會長公布時間：即日起至 5/21 00:00</li>
                        <li>每人 2 票、提名以及選舉皆於此頁面</li>
                        <li>於選舉時間結束之際皆可更改意願</li>
                        <li>提名人將顯示於頁面上</li>
                        <li>選舉人為陽明交通大學工業工程與管理學系全體在籍學生</li>
                        <li>所有統計結果以伺服器紀錄為主</li>
                        <li>任何試圖攻擊本系統紀錄將視為廢票處理</li>
                    </ul>
                </div>
            </section>
            <section className="flex flex-col items-center">
                <div>您正在以 {session?.user.name ?? "訪客"} 身分訪問此頁面</div>
                {status === "unauthenticated" &&
                    <Link href="/login" className="bg-blue-700 hover:bg-blue-600 text-white w-20 h-8 rounded-md flex items-center justify-center">立即登入</Link>
                }
            </section>
            <section className="flex flex-col space-y-2 items-center px-5">
                <NominatedCard selected={false} />
                <NominatedCard selected={true} />
            </section>
            <section className="flex flex-col space-y-3 items-center px-5">
                <h2>新增候選人</h2>
                <AddNomineeForm />
            </section>
        </main>
    )
}

const NominatedCard = ({
    ...props
}: {
    selected: boolean
}) => {
    const [selected, setSelected] = useState<boolean>(props.selected);

    return (
        <div className="bg-white dark:bg-zinc-900 dark:text-slate-200 rounded-lg p-5 shadow-md w-full max-w-[40rem]">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">王小明</h3>
                    <p className="text-gray-500">提名人：陳大明</p>
                </div>
                <div className="flex flex-row space-x-5 items-center">
                    {props.selected &&
                        <div>已選擇</div>
                    }
                    {props.selected ?
                        <button className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded">放棄</button>
                        :
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">選擇</button>
                    }
                </div>
            </div>
        </div>
    )
}

const AddNomineeForm = () => {
    const [nomineeId, setNomineeId] = useState<string>("");
    const [nomineeName, setNomineeName] = useState<string>("");
    const [nomineeExist, setNomineeExist] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");

    const checkNomineeExist = async () => {

    }

    const submitNominee = async () => {

    }

    return (
        <div className="bg-whte dark:bg-zinc-900 dark:text-slate-200 rounded-lg p-5 shadow-md w-full max-w-[40rem]">
            <div className="text-sm py-4">
                輸入任一項資訊，並搜尋
            </div>
            <div className="flex flex-row items-center space-x-10">
                <div className="flex flex-col space-y-5">
                    <div className="flex flex-row space-x-5">
                        <label htmlFor="name">學號</label>
                        <input type="text" id="name" name="name" className="border outline-none px-2 py-0.5 rounded-md" />
                    </div>
                    <div className="flex flex-row space-x-5">
                        <label htmlFor="name">姓名</label>
                        <input type="text" id="name" name="name" className="border outline-none px-2 py-0.5 rounded-md" />
                    </div>
                </div>
                <button className="bg-black text-white w-24 h-8 rounded-sm">
                    搜尋
                </button>
            </div>

            {nomineeExist &&
                <div className="pt-5 flex flex-col">
                    <div className="py-5">
                        <h2>我將以 鄭弘煒 的身分 提名 111704011 鄭弘煒 同學為下一屆系學會會長</h2>
                    </div>
                    <button className="bg-orange-700 hover:bg-orange-800 text-white w-24 h-8 rounded-md self-center">
                        確認提名
                    </button>
                </div>
            }
        </div>
    )
}