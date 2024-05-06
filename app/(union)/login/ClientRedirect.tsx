"use client"

import { useRouter } from "next/navigation";

export default function ClientRedirect() {
    const router = useRouter();
    try {
        const redirect_url = localStorage.getItem('redirect_to');
        console.log(redirect_url)
        localStorage.removeItem("redirect_to");
        if (redirect_url) {
            router.push(`${redirect_url}?${new URLSearchParams({
                text: "登入成功",
                type: "success"
            })}`)
        }
        return;
    } catch (err) {
        console.log("localStorage NOT Available")

        router.push("/?" + new URLSearchParams({
            text: "登入成功",
            type: "success"
        }))
    }

    return (<></>)
}