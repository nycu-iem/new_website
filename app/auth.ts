import NextAuth from "next-auth"
import { getStudent } from "@/lib/api"
import { PrismaAdapter } from "@auth/prisma-adapter"

export const { auth, handlers, signIn, signOut } = NextAuth({
    debug: process.env.NODE_ENV === "development",
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
                async request(context: any) {
                    console.log("context")
                    console.log(context)
                    // context contains useful properties to help you make the request.
                    const formData = new URLSearchParams({
                        grant_type: "authorization_code",
                        code: context.query.code as string,
                        client_id: process.env.NYCU_ID as string,
                        client_secret: process.env.NYCU_SECRET as string,
                        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/nycu`,
                    })
                    // console.log(formData)
                    const res = await fetch(`https://id.nycu.edu.tw/o/token/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Accept": "application/json"
                        },
                        body: formData,
                    })
                    const tokens = await res.json();
                    // console.log(tokens)
                    return { tokens }
                }
            },
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
