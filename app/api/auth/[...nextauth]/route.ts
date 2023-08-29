import NextAuth, { AuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "lib/prisma"

export const authOptions: AuthOptions = {
    // Configure one or more authentication providers
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
                async request(context) {
                    // context contains useful properties to help you make the request.
                    const formData = new URLSearchParams({
                        grant_type: "authorization_code",
                        code: context.params.code as string,
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
            profile(profile) {
                console.log("profile");
                console.log(profile);
                return {
                    id: profile.username,
                    student_id: profile.username,
                    email: profile.email,
                    union_fee: false,
                    name: 'anonymous'
                }
            },
            type: "oauth",
            version: "2.0",
            clientId: process.env.NYCU_ID,
            clientSecret: process.env.NYCU_SECRET,
            /**
             * Object containing the settings for the styling of the providers sign-in buttons
            */
            style: {
                logo: "someplace",
                logoDark: "someplace",
                bg: "",
                bgDark: "",
                text: "NYCU Oauth Signin",
                textDark: "NYCU Oauth Signin"
            },
            checks: [],
        }
    ],
    pages: {
        signIn: '/login',
        signOut: '/logout',
        error: '/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // (used for check email message)
        // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    debug: process.env.NODE_ENV === "development",
    useSecureCookies: process.env.NODE_ENV === "production",
    adapter: PrismaAdapter(prisma),
    callbacks: {
        async session({ session, token, user }) {
            session.user.student_id = user.student_id;
            session.user.union_fee = user.union_fee;

            return session
        }
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }