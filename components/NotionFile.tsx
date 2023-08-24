'use client'
import { pdfjs } from 'react-pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

import { useState } from 'react';

import { Document, Page } from 'react-pdf';


export default function NotionPdf({
    blockId,
    fileSrc,
}: {
    blockId: string,
    fileSrc: string
}) {
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);

    return (
        <div>
            <nav>
                <div onClick={() => { setPage(p => p - 1) }}> Previous </div>
                <div onClick={() => { setPage(p => p + 1) }}> Next </div>
                <div> {`${page}/${totalPage}`} </div>
            </nav>
            <Document file={fileSrc}
                onLoadSuccess={(event) => {
                    setTotalPage(event.numPages)
                }}>
                <Page pageNumber={page} />
            </Document>
        </div>

    )
}