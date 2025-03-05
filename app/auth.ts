import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "lib/prisma"
import { getStudent } from "@/lib/api"

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        {
            id: "nycu",
            name: "nycu",
            authorization: {
                url: "https://id.nycu.edu.tw/o/authorize/",
                params: {
                    response_type: "code",
                    client_id: process.env.NYCU_ID,
                    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/nycu`,
                    scope: `profile`,
                },
            },
            token: {
                url: "https://id.nycu.edu.tw/o/token/",
                params: {
                    grant_type: "authorization_code",
                    client_id: process.env.NYCU_ID,
                    client_secret: process.env.NYCU_SECRET,
                    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/nycu`,
                },
                type: "form",
            },
            // token: {
            //     async request(context) {
            //         // context contains useful properties to help you make the request.
            //         const formData = new URLSearchParams({
            //             grant_type: "authorization_code",
            //             code: context.params.code as string,
            //             client_id: process.env.NYCU_ID as string,
            //             client_secret: process.env.NYCU_SECRET as string,
            //             redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/nycu`,
            //         })
            //         // console.log(formData)
            //         const res = await fetch(`https://id.nycu.edu.tw/o/token/`, {
            //             method: "POST",
            //             headers: {
            //                 "Content-Type": "application/x-www-form-urlencoded",
            //                 "Accept": "application/json"
            //             },
            //             body: formData,
            //         })
            //         const tokens = await res.json();
            //         // console.log(tokens)
            //         return { tokens }
            //     }
            // },
            userinfo: {
                url: "https://id.nycu.edu.tw/api/profile/"
            },
            async profile(profile) {
                try {
                    const student = await getStudent({ student_id: profile.username });

                    if (student) {
                        return {
                            id: profile.username,
                            student_id: profile.username,
                            email: profile.email,
                            union_fee: student.union_fee,
                            name: student.name
                        }
                    }
                } catch (err) {
                    console.log(err)
                }

                return {
                    id: profile.username,
                    student_id: profile.username,
                    email: profile.email,
                    union_fee: false,
                    name: 'anonymous'
                }
            },
            type: "oauth",
            // version: "2.0",
            clientId: process.env.NYCU_ID,
            clientSecret: process.env.NYCU_SECRET,
            /**
             * Object containing the settings for the styling of the providers sign-in buttons
            */
            style: {
                logo: "someplace",
                // logoDark: "someplace",
                bg: "",
                // bgDark: "",
                text: "NYCU Oauth Signin",
                // textDark: "NYCU Oauth Signin"
            },
            checks: [],
            allowDangerousEmailAccountLinking: true,
        }
    ],
})
