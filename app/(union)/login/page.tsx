// import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders } from "next-auth/react"
import Client from "./page_client";
// import ClientRedirect from "./ClientRedirect"

import { redirect } from "next/navigation"
import { auth } from "@/app/auth";

export default async function LoginPage() {
    const session = await auth()

    if (session) {
        console.log("logged in")
        redirect(`/?${new URLSearchParams({
            text: "登入成功",
            type: "success"
        })}`)
    } else {
        console.log("not logged in")
    }

    const providers = await getProviders() ?? [];

    return (<Client providers={providers as { name: string, id: string }[]} />)
}
