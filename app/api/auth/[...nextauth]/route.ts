import NextAuth, { AuthOptions } from "next-auth"
// import GithubProvider from "next-auth/providers/github"
// import Providers from "next-auth/providers"

export const authOptions: AuthOptions = {
    // Configure one or more authentication providers
    providers: [
        {
            id: "nycu",
            name: "nycu",
            authorization: {
                url: "",
                params: {
                    scope: "email"
                },
            },
            token: {
                url: "",
                params: {}
            },
            userinfo: {
                url: "",
                params: {}
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
            profile(profile) {
                return {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    image: profile.image
                }
            },
        }
    ],
    session: {
        strategy: "jwt"
    },
    jwt: {
        maxAge: 60 * 60 * 24 * 30,
    },
    pages: {
        signIn: '/login',
        signOut: '/logout',
        error: '/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // (used for check email message)
        // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    debug: process.env.NODE_ENV === "development",
    useSecureCookies: process.env.NODE_ENV === "production",
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }