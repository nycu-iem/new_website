'use client'
import React, { useState } from "react";
import { getStudents } from "lib/api";
// import { fetchStudent } from "./page";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";

export default function ClientSide({
    data,
}: {
    data: any
}) {
    const [input, setInput] = useState<string>("");
    const [searchResult, setSearchResult] = useState<Array<any>>([]);

    return (
        <React.Fragment>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
                className="bg-slate-100 py-10 px-5 rounded-lg">
                <div className="flex flex-row items-center">
                    <label>學號</label>
                    <input className="bg-slate-50 focus:outline-none border border-black rounded-md ml-2 px-1 py-0.5"
                        value={input}
                        onChange={(event) => {
                            setInput(event.target.value)
                            if (event.target.value !== "") {
                                getStudents({ student_id: event.target.value })
                                    .then(res => {
                                        if (event.target.value !== "") {
                                            setSearchResult(res)
                                        }
                                    })
                            } else {
                                setSearchResult([])
                            }
                        }} />
                </div>
            </form>
            <div className="mt-10 py-5 px-10 bg-slate-100 rounded-md">
                {/* {searchResult.length !== 0 && <h2>Result:</h2>} */}
                <div className="grid grid-cols-9 w-full">
                    {searchResult.length !== 0 && <React.Fragment>
                        <div>姓名</div>
                        <div>學號</div>
                        <div>導師</div>
                        <div>性別</div>
                        <div>在系上</div>
                        <div>入學方式</div>
                        <div>畢業級數</div>
                        <div>系學會費</div>
                        <div>備註</div>
                        {searchResult.sort((a, b) => a.student_id - b.student_id).map(student => (<React.Fragment key={student.student_id}>
                            <div>{student.name}</div>
                            <div>{student.student_id}</div>
                            <div>{student.teacher}</div>
                            <div>{student.gender}</div>
                            <div>{student.in_department ? <CheckIcon className="w-4 text-green-500" /> : <XMarkIcon className="w-4 text-red-500" />}</div>
                            <div>{student.enterMethod}</div>
                            <div>{student.graduate_year}</div>
                            <div>{student.union_fee ? <CheckIcon className="w-4 text-green-400" /> : <XMarkIcon className="w-4 text-red-500" />}</div>
                            <div>{student.comment}</div>
                        </React.Fragment>))}
                    </React.Fragment>}
                </div>
                {searchResult.length === 0 && <div>
                    無符合的結果
                </div>}
            </div>
        </React.Fragment>
    )
}