import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                let user = null;

                // Call backend to verify user
                user = {
                    _id: "123",
                    username: "123",
                    email: "123",
                    isVerify: true,
                    type: "123",
                    role: "123",
                };

                if (!user) throw new Error("User not found!");

                return user;
            }
        })
    ],
    pages: {
        signIn: "/auth/login",
    }
})