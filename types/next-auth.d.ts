import NextAuth from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            name: string,
            email: string,
            image: string,
            student_id: string,
            union_fee: boolean
        }
    }

    interface User {
        id: string,
        student_id: string,
        email: string,
        image?: string,
        name: string,
        union_fee: boolean,
    }
}