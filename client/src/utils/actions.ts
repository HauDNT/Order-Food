"use server"
import { signIn } from "next-auth/react";

export async function authenticate(email: string, password: string) {
    try {
        const response = await signIn("credentials", {
            username: email,
            password: password,
            // callbackUrl: "/",
            redirect: false,
        });

        return response;
    } catch (error) {
        return { "error": "Having bugs in login api" }

        // if (error.cause.err instanceof InvalidLoginError) {
        //     return { "error": "Incorrect username or password" };
        // }
        // else {
        //     throw new Error("Failed to authenticate");
        // }
    }
}