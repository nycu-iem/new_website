"use client"
import { signIn } from "next-auth/react"

export default function Client({ providers }: { providers: { name: string, id: string }[] }) {
    return (
        <>
            {
                Object.values(providers).map((provider) => (
                    <div key={provider.name}>
                        <button onClick={() => signIn(provider.id)}>
                            Sign in with {provider.name}
                        </button>
                    </div>
                ))
            }
        </>
    )
}