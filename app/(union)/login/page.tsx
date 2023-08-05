// import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../api/auth/[...nextauth]/route";
import Client from "./page_client";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/?" + new URLSearchParams({
            text: "登入成功",
            type: "success"
        }),)
    }

    const providers = await getProviders() ?? [];

    return (<Client providers={providers as { name: string, id: string }[]} />)
}
