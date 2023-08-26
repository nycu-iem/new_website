'use client'
import { Document, Page, pdfjs } from "react-pdf"
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

import { useEffect, useState } from 'react';

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

    return (
        <div className="bg-slate-100 rounded-lg self-center shadow-inner w-80 min-w-fit">
            <nav className='flex flex-row justify-between py-3 px-5'>
                <div onClick={() => { setPage(p => p - 1) }}
                    className='cursor-pointer'> Previous </div>
                <div> {`${page}/${totalPage ?? "載入中"}`} </div>
                <div onClick={() => { setPage(p => p + 1) }}
                    className='cursor-pointer'> Next </div>
            </nav>
            <div className='mx-1 pb-2'>
                <Document file={fileUrl}
                    onLoadSuccess={(event) => {
                        setTotalPage(event.numPages)
                    }}
                    onLoadError={() => {
                        // TODO: Update loading error
                    }}
                    loading={<PDFLoading />}>
                    <Page pageNumber={page}
                        scale={width > 786 ? 1 : 0.6}
                    />
                </Document>
            </div>
        </div>

    )
}

const PDFLoading = () => {
    return (
        <div className='h-full w-full flex flex-row justify-center'>
            <div className='self-center'>
                載入中
            </div>
        </div>
    )
}