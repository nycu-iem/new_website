"use client"

import { useEffect } from "react"
import { toast } from "react-toastify"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

export default function Client() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {
        showAlert();
    }, [searchParams,pathname])

    const showAlert = () => {
        const type = searchParams.get('type');
        const text = searchParams.get("text")
        if (type === "success") {
            toast.success(text, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
                theme: "light",
            })
        } else if (type === "error") {
            toast.error(text, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
                theme: "light",
            })
        } else if (type === "info") {
            toast.info(text, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
                theme: "light",
            })
        }
        // router.replace(pathname, { shallow: false });
        window.history.replaceState({}, document.title, pathname);
    }

    return (
        <></>
    )
}