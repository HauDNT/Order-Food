import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { InActiveAccountError, InvalidEmailPasswordError } from "./utils/error";
import { sendRequest } from "./utils/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const res = await sendRequest<IBackendRes<ILogin>>({
                    method: "POST",
                    url: "http://localhost:8080/api/v1/auth/login",
                    body: {
                        username: credentials.email,
                        password: credentials.password,
                    }
                });

                if (!res.statusCode) {      // Success won't return a status code
                    return {
                        _id: res.data?.user._id,
                        email: res.data?.user.email,
                        name: res.data?.user.name,
                        access_token: res.data?.access_token,
                    };
                } 
                // Password error - 401
                else if (+res.statusCode === 401) {
                    throw new InvalidEmailPasswordError();
                }
                // Inactive error - 400
                else if (+res.statusCode === 401) {
                    throw new InActiveAccountError();
                }
                else {
                    throw new Error("Internal server error!");
                }
            }
        })
    ],
    pages: {
        signIn: "/auth/login",
    }
})