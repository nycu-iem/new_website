"use client"
import { signIn } from "next-auth/react"

export default function Client({ providers, ...props }: { providers: { name: string, id: string }[] }) {
    console.log("providers: ")
    console.log(providers);
    console.log(props)
    return (
        <>
            {/* {
                Object.values(providers).map((provider) => (
                    <div key={provider.name}>
                        <button onClick={() => signIn(provider.id)}>
                            Sign in with {provider.name}
                        </button>
                    </div>
                ))
            } */}
            Hola
        </>
    )
}