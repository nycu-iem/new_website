"use client"
import { signOut } from "next-auth/react"
import { useEffect } from "react";
// import { useRouter } from "next/navigation";

export default function LogoutPage() {
    // const router = useRouter();

    useEffect(() => {
        logoutFunction();
    }, [])

    const logoutFunction = () => {
        signOut({callbackUrl: `/?${new URLSearchParams({
            text: "登出成功",
            type: "success"
        })}`})
    }

    return (
        <>
            <button onClick={() => {
                logoutFunction();
            }}>Logout</button>
        </>
    )
}