// import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import Client from "./page_client";
import ClientRedirect from "./ClientRedirect"

import { redirect } from "next/navigation"

export default async function LoginPage() {
    const session = await getServerSession(authOptions);

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