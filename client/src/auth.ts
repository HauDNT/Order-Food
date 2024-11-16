import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { InActiveAccountError, InvalidEmailPasswordError } from "./utils/error";
import { sendRequest } from "./utils/api";
import { IUser } from "./types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                const res = await sendRequest<IBackendRes<ILogin>>({
                    method: "POST",
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
                    body: {
                        username: credentials.username,
                        password: credentials.password,
                    }
                });

                if (res.statusCode === 201) {      // Success won't return a status code
                    return {
                        _id: res.data?.user._id,
                        email: res.data?.user.email,
                        name: res.data?.user.name,
                        access_token: res.data?.access_token,
                    };
                } 
                // Inactive error - 400
                else if (+res.statusCode === 400) {
                    throw new InActiveAccountError();
                }
                // Password error - 401
                else if (+res.statusCode === 401) {
                    throw new InvalidEmailPasswordError();
                }
                else {
                    throw new Error("Internal server error!");
                }
            }
        })
    ],
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.user = (user as IUser);
            };

            return token;
        },
        session({ session, token }) {
            (session.user as IUser) = token.user;
            
            return session;
        },
        authorized: async ({ auth }) => {
            return !!auth;  
            // -> Hàm này sẽ gán giá trị cho auth nếu người dùng đăng nhập
            // !!auth -> Kiểm tra xem biến auth có giá trị hay không? Nếu có thì convert qua boolean
        }
    }
})