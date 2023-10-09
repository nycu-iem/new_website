'use client'

import Image from "next/image"

import React, { Dispatch, SetStateAction, useState } from "react"

export default function NotionImage({
    src,
    alt,
    blockId,
    className,
    fill,
}: {
    src: string,
    alt: string,
    blockId: string,
    className?: string,
    fill?: boolean
}) {
    const [imageSrc, setImageSrc] = useState<string>(src);
    const [showImage, setShowImage] = useState<boolean>(false);

    return (
        <React.Fragment>
            <Image
                src={imageSrc}
                alt={alt}
                unoptimized={process.env.NODE_ENV !== "production"}
                onError={async () => {
                    fetch(`/api/image/${blockId}`)
                        .then(res => {
                            // console.log(res)
                            return res.json();
                        }).then(res => {
                            setImageSrc(res.imageSrc);
                        })
                }}
                className={className}
                fill
                onClick={() => {
                    setShowImage(true)
                }}
            />
            {showImage &&
                <DetailImage
                    image={imageSrc}
                    showImage={showImage}
                    setShowImage={setShowImage}
                />
            }
        </React.Fragment>
    )
}

const DetailImage = ({
    image,
    showImage,
    setShowImage
}: {
    image: string,
    showImage: boolean
    setShowImage: Dispatch<SetStateAction<boolean>>
}) => {
    return (
        <div className="w-screen h-screen z-50 fixed bg-black top-0 left-0 bg-opacity-70 backdrop-blur-sm flex flex-row justify-center items-center" onClick={() => {
            setShowImage(false)
        }}>
            <div className="relative w-[calc(100vw-5rem)] h-[calc(100vh-5rem)]">
                <Image
                    fill
                    src={image}
                    alt="image"
                    className="object-contain"
                // onClick={(event) => {
                //     event.stopPropagation();
                // }} 
                />
            </div>
        </div>
    )
}