'use client'
import { Document, Page, pdfjs } from "react-pdf"
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

import { useEffect, useRef, useState } from 'react';
import { ArrowDownTrayIcon, ChevronLeftIcon, ChevronRightIcon, ForwardIcon } from "@heroicons/react/20/solid";
import { clsx } from "clsx"
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

export default function NotionPdf({
    blockId,
    fileSrc,
}: {
    blockId: string,
    fileSrc: string
}) {
    const [fileUrl, setFileUrl] = useState<string>(fileSrc);
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number | undefined>();
    const [width, setWidth] = useState<number>(0);
    const [documentName, setDocumentName] = useState<string>("PDF_file");
    const currentPageRef = useRef<HTMLInputElement>(null);

    const { data: session, status } = useSession();

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

    const download = async () => {
        // TODO: downloads need permission
        // console.log(session)
        if (!(session?.user.union_fee ?? false)) {
            toast.error('繳交系學會費以解鎖下載功能', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
                theme: "light",
            })
            return
        }
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
        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg self-center shadow-inner w-80 min-w-fit mt-5">
            <nav className='flex flex-row justify-between py-3 px-5 select-none'>
                <div className='flex flex-row space-x-3'>
                    <div onClick={() => {
                        download();
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
            </nav>
            <div className='mx-1 pb-2 select-none cursor-default'>
                <Document file={fileUrl}
                    onLoadSuccess={(event) => {
                        setTotalPage(event.numPages)
                        if (event.fingerprints[0]) {
                            setDocumentName(event.fingerprints[0])
                        }
                        // console.log(event)
                    }}
                    onLoadError={() => {
                        // TODO: Update loading error
                    }}
                    loading={<PDFLoading />}
                    className="md:h-[600px] h-[400px]">
                    <Page pageNumber={page}
                        // scale={width > 786 ? 1 : 0.6}
                        height={width > 768 ? 600 : 400}
                        className="cursor-default"
                    />
                </Document>
            </div>
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