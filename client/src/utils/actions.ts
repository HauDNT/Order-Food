"use server"
import { signIn } from "next-auth/react";

export async function authenticate(email: string, password: string) {
    try {
        const response = await signIn("credentials", {
            email: email,
            password: password,
            // callbackUrl: "/",
            redirect: false,
        });

        return response;
    } catch (error) {
        if ((error as any).type === "InvalidEmailPasswordError") {
            return {
                error: (error as any).type,
                code: 1,
            }
        }
        else if ((error as any).type === "InActiveAccountError") {
            return {
                error: (error as any).type,
                code: 2,
            }
        }
        else {
            return {
                error: "Internal server error!",
                code: 0,
            }
        }
    }
}