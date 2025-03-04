'use client'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { ArrowDownTrayIcon } from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";

export default function NotionPdf({
    blockId,
    fileSrc,
    // fileName = "PDF File",
    block,
}: {
    blockId: string,
    fileSrc: string,
    // fileName: string,
    block: any
}) {
    const [fileUrl, setFileUrl] = useState<string>(fileSrc);
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number | undefined>();
    const [width, setWidth] = useState<number>(0);
    const [showDocument, setShowDocument] = useState<boolean>(false);
    const currentPageRef = useRef<HTMLInputElement>(null);
    const re = /\/(.*)\/(.*)\?/gm
    const [documentName, setDocumentName] = useState<string>(decodeURI(re.exec(fileSrc)?.[2] ?? "File"));

    const { data: session, status } = useSession();

    // console.log(block)

    useEffect(() => {
        window.addEventListener('resize', () => {
            setWidth(window.innerWidth);
        })
        setWidth(window.innerWidth);
        return () => {
            window.addEventListener('resize', () => {
                setWidth(window.innerWidth)
            })
        }
    }, [])

    const download = async ({ permission }: { permission?: boolean }) => {
        // TODO: downloads need permission
        // console.log(session)
        // if (!permission) {
        //     if (!(session?.user.union_fee ?? false)) {
        //         toast.error('繳交系學會費以解鎖下載功能', {
        //             position: "top-right",
        //             autoClose: 5000,
        //             hideProgressBar: false,
        //             closeOnClick: true,
        //             pauseOnHover: true,
        //             progress: undefined,
        //             theme: "light",
        //         })
        //         return
        //     }
        // }
        // console.log("prepare to download file")

        const link = document.createElement('a');
        link.setAttribute('download', documentName);
        link.href = fileUrl;
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
    }

    const forwardToPage = () => {
        if (currentPageRef.current) {
            currentPageRef.current.focus();
        }
    }

    return (
        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg self-center shadow-inner w-[60rem] min-w-fit mt-5">
            <div className="px-3 space-x-2 flex flex-row py-2">
                {documentName.endsWith(".pdf") ?
                    <div className='w-full justify-between flex flex-row'>
                        <Switch checked={showDocument}
                            text={documentName}
                            setChecked={setShowDocument} />
                        <div onClick={() => {
                            download({});
                        }} className="cursor-pointer">
                            <ArrowDownTrayIcon
                                className="w-6"
                                aria-label="Download"
                            />
                        </div>
                    </div> :
                    <div className="w-full">
                        <div className="flex flex-row px-3 space-x-2">
                            <div onClick={() => {
                                download({ permission: true });
                            }} className="cursor-pointer">
                                <ArrowDownTrayIcon
                                    className="w-6"
                                    aria-label="Download"
                                />
                            </div>
                            <div className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                {documentName}
                            </div>
                        </div>
                        <div className="w-full text-center">不支援的檔案類型</div>
                    </div>}
            </div>
            {showDocument &&
                <React.Fragment>
                    {/* <nav className='flex flex-row justify-between py-3 px-5 select-none'>
                        <div className='flex flex-row space-x-3'>
                            <div onClick={() => {
                                download({});
                            }} className="cursor-pointer">
                                <ArrowDownTrayIcon
                                    className="w-6"
                                    aria-label="Download"
                                />
                            </div>
                            <div onClick={() => {
                                forwardToPage();
                            }} className="cursor-pointer">
                                <ForwardIcon
                                    className="w-6"
                                    aria-label="Jump"
                                />
                            </div>
                        </div>
                        <div className="flex flex-row">
                            {totalPage && <>
                                <input className="w-16 mr-2 px-1 rounded-md"
                                    ref={currentPageRef}
                                    onChange={() => {
                                        if (currentPageRef.current) {
                                            setPage(parseInt(currentPageRef.current.value))
                                        }
                                    }}
                                    value={page}
                                    type="number" />
                                /
                                <p>{totalPage}</p>
                            </>}
                            {totalPage === undefined && <h2>載入中</h2>}
                        </div>
                        <div className="flex flex-row space-x-3">
                            <div onClick={() => {
                                setPage((previous_page) => {
                                    if (previous_page <= 1) {
                                        return 1;
                                    }
                                    return previous_page - 1;
                                })
                            }} className={clsx(
                                page === 1 ? "text-gray-500 cursor-not-allowed" : " text-black dark:text-white cursor-pointer"
                            )}>
                                <ChevronLeftIcon
                                    className="w-6"
                                    aria-label="Previous"
                                />
                            </div>
                            <div onClick={() => {
                                setPage((previous_page) => {
                                    if (totalPage && (previous_page >= totalPage)) {
                                        return previous_page;
                                    }
                                    return previous_page + 1;
                                })
                            }} className={clsx(
                                page === totalPage ? "text-gray-500 cursor-not-allowed" : "text-black dark:text-white cursor-pointer"
                            )}>
                                <ChevronRightIcon
                                    className="w-6"
                                    aria-label="Next"
                                />
                            </div>
                        </div>
                    </nav> */}
                    <div className='mx-1 pb-2 select-none cursor-default w-full'>
                        <iframe src={fileUrl} className='w-full aspect-[9/16]' />
                    </div>
                </React.Fragment>
            }
        </div>
    )
}

const PDFLoading = () => {
    return (
        <div className='h-full w-full flex flex-row justify-center items-center'>
            <div className=''>
                載入中
            </div>
        </div>
    )
}

const Switch = ({
    checked,
    text,
    setChecked
}: {
    checked: boolean,
    setChecked: Dispatch<SetStateAction<boolean>>
    text: string
}) => {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" checked={checked} onChange={() => {
                setChecked(p => !p)
            }} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{text}</span>
        </label>
    )
}