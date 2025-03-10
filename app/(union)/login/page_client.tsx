"use client"
import { signIn } from "next-auth/react"
import { Button } from "components/Button"

export default function Client({ providers }: { providers: { name: string, id: string }[] }) {
    return (
        <>
            {
                Object.values(providers).map((provider) => (
                    <Button key={provider.name} onClick={() => {
                        signIn(provider.id)
                    }} variant="primary" className="">
                        Sign in with {provider.name}
                    </Button>
                ))
            }
        </>
    )
}