"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react";
import Link from "next/link";
import { customToast } from 'components/Toast'
import clsx from "clsx";
import LoadingCircle from "components/LoadingCircle"

export default function VotingPage() {
    const { data: session, status } = useSession()

    const [nominees, setNominees] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (status !== "loading") {
            // console.log("status got")
            setLoading(true);
            fetch(`/api/voting/25/nominees`)
                .then(res => res.json())
                .then(response => {
                    console.log(response)
                    setNominees(response)
                    setLoading(false)
                })
        }
    }, [status])

    return (
        <main className="max-w-7xl lg:px-8 w-full mx-auto space-y-10">
            <section className="flex flex-col space-y-5 pt-20 px-5">
                <h1 className="text-4xl font-bold text-center">114學年度系學會長選舉</h1>
                <div className="flex flex-col px-10">
                    <h2 className="text-gray-700 dark:text-slate-200">投票說明</h2>

                    <ul className="list-disc pl-5">
                        <li>選舉期間：即日起至 5/13 23:00 <strong>二</strong></li>
                        <li>正副會長公布時間： 5/14 00:00<strong>待定</strong></li>
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
                {loading && <LoadingCircle size="xl" />}
                {nominees.map((nominee: any) => (<NominatedCard
                    key={nominee.id}
                    selected={nominee.selected}
                    selectable={status === "authenticated"}
                    nominee={`${nominee.nominee.name} (${nominee.nominee.year})`}
                    nominator={`${nominee.nominatedBy.name} (${nominee.nominatedBy.year})`}
                    id={nominee.id}
                />))}
            </section>
            {status === "authenticated" &&
                <section className="flex flex-col space-y-3 items-center px-5">
                    <h2>新增候選人</h2>
                    <AddNomineeForm />
                </section>
            }
        </main>
    )
}

const NominatedCard = ({
    ...props
}: {
    selected: boolean
    nominee: string
    nominator: string
    selectable: boolean
    id: string
}) => {

    const updateSelection = async (selection: boolean) => {
        fetch("/api/voting/25/nominees", {
            method: "PUT",
            body: JSON.stringify({
                id: props.id,
                option: selection
            })
        })
            .then(res => res.json())
            .then(response => {
                if (response.message === "You can only vote in maximum 2 person") {
                    customToast.error("最多只能選擇兩位候選人")
                } else {
                    console.log(response)
                    customToast.success("更新成功")

                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                }
            }).catch((error) => {
                customToast.error(error)
            })
    }

    return (
        <div className="bg-white dark:bg-zinc-900 dark:text-slate-200 rounded-lg p-5 shadow-md w-full max-w-[40rem] border">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">{props.nominee}</h3>
                    <p className="text-gray-500">{`提名人：${props.nominator}`}</p>
                </div>
                <div className={clsx("flex flex-row space-x-5 items-center",
                    props.selectable ? "block" : "hidden")
                }>
                    {props.selected &&
                        <div>已選擇</div>
                    }
                    {props.selected ?
                        <button className="cursor-pointer bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                            updateSelection(false)
                        }}>取消</button>
                        :
                        <button className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                            updateSelection(true)
                        }}>選擇</button>
                    }
                </div>
            </div >
        </div >
    )
}

const AddNomineeForm = () => {
    const [nomineeIdInput, setNomineeIdInput] = useState<string>("");
    const [nomineeId, setNomineeId] = useState<string>("");
    const [nomineeName, setNomineeName] = useState<string>("");
    const [nomineeExist, setNomineeExist] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const checkNomineeExist = async () => {
        setLoading(true);
        fetch("/api/voting/25/verify_nominees", {
            method: "POST",
            body: JSON.stringify({
                id: nomineeIdInput
            })
        })
            .then(data => {
                return data.json()
            })
            .then(data => {
                if (data.student_name) {
                    setNomineeExist(true);
                    setNomineeName(data.student_name);
                    setNomineeId(data.student_id);
                    setUsername(data.nominator);
                    customToast.success("學生存在，可以提名")
                } else {
                    if (data.error === "Nominated") {
                        setNomineeExist(false);
                        customToast.error("學生已被提名")
                    } else {
                        setNomineeExist(false);
                        customToast.error("查無此學生，請確認學號是否正確")
                    }
                }
                setLoading(false);
            })
            .catch(err => {
                console.log(err)
                customToast.error("錯誤，請稍後再試")
                setLoading(false)
            })
    }

    const submitNominee = async () => {
        if (!nomineeExist) {
            customToast.error("無法提名，請確認學生是否存在")
        }
        fetch("/api/voting/25/nominees", {
            method: "POST",
            body: JSON.stringify({
                nominee_id: nomineeId,
                nominee_name: nomineeName
            })
        })
            .then(res => (res.json()))
            .then(result => {
                if (result.message === "Student Already Nominated") {
                    customToast.error("學生已被提名")
                } else {
                    console.log(result.message)
                    customToast.success("提名成功")
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                }
            }).catch((error) => {
                customToast.error(error)
            })
    }

    return (
        <div className="bg-whte dark:bg-zinc-900 dark:text-slate-200 rounded-lg p-5 shadow-md w-full max-w-[40rem] border">
            <div className="text-sm py-4">
                輸入任一項資訊，並搜尋
            </div>
            <form className="flex flex-row items-center space-x-10" onSubmit={(e) => {
                e.preventDefault()
                checkNomineeExist();
            }}>
                <div className="flex flex-col space-y-5">
                    <div className="flex flex-row space-x-5">
                        <label htmlFor="name">學號</label>
                        <input type="text"
                            id="name"
                            name="name"
                            className="border outline-none px-2 py-0.5 rounded-md"
                            onChange={(e) => setNomineeIdInput(e.target.value)}
                            value={nomineeIdInput}
                        />
                    </div>
                    {/* <div className="flex flex-row space-x-5">
                        <label htmlFor="name">姓名</label>
                        <input type="text" id="name" name="name" className="border outline-none px-2 py-0.5 rounded-md" />
                    </div> */}
                </div>
                <button className="bg-black dark:bg-slate-800 text-white w-24 h-8 rounded-sm cursor-pointer" type="submit">
                    搜尋
                </button>
            </form>

            {nomineeExist &&
                <div className="pt-5 flex flex-col">
                    <div className="py-5">
                        <h2>{`我將以 ${username} 的身分 提名 ${nomineeId} ${nomineeName} 同學為下一屆系學會會長`}</h2>
                    </div>
                    <button className="bg-orange-700 hover:bg-orange-800 text-white w-24 h-8 rounded-md self-center cursor-pointer" onClick={() => {
                        submitNominee()
                    }}>
                        確認提名
                    </button>
                </div>
            }
        </div>
    )
}