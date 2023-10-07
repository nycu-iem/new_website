// import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../api/auth/[...nextauth]/route";
import Client from "./page_client";
import ClientRedirect from "./ClientRedirect"

export default async function LoginPage() {
    const session = await getServerSession(authOptions);

    if (session) {
        return <ClientRedirect />
    }

    const providers = await getProviders() ?? [];

    return (<Client providers={providers as { name: string, id: string }[]} />)
}
