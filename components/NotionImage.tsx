import Image from "next/image"

import { useState } from "react"

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

    return (
        <Image
            src={imageSrc}
            alt={alt}
            unoptimized={process.env.NODE_ENV !== "production"}
            onError={async () => {
                fetch(`/api/image/${blockId}`)
                    .then(res => {
                        return res.json();
                    }).then(res => {
                        setImageSrc(res.imageSrc);
                    })
            }}
            className={className}
            fill
        />
    )
}