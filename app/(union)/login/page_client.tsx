"use client"
import { signIn, getProviders } from "next-auth/react"
import { Button } from "components/Button"
import { useEffect, useState } from "react"

export default function Client() {
    const [providers, setProviders] = useState({});

    useEffect(() => {
        (async () => {
            const res = (await getProviders()) as any;
            setProviders(res);
        })();
    }, []);

    // const providers = await getProviders() ?? [];

    return (
        <>
            {
                Object.values(providers).map((provider: any) => (
                    <Button key={provider.name} onClick={() => {
                        signIn(provider.id)
                    }} variant="primary" className="cursor-pointer">
                        Sign in with {provider.name}
                    </Button>
                ))
            }
        </>
    )
}