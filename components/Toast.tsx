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
    }, [searchParams, pathname])

    const showAlert = () => {
        const type = searchParams.get('type');
        const text = searchParams.get("text")
        if (type === "success") {
            customToast.success(text as string);
        } else if (type === "error") {
            customToast.error(text as string);
        } else if (type === "info") {
            customToast.info(text as string);
        }
        window.history.replaceState({}, document.title, pathname);
    }

    return (
        <></>
    )
}

export const customToast = {
    success: (text: string) => {
        toast.success(text, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            progress: undefined,
            theme: "light",
        })
    },
    error: (text: string) => {
        toast.error(text, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            progress: undefined,
            theme: "light",
        })
    },
    info: (text: string) => {
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
}