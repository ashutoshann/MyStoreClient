// app/lib/cookie.js
import { cookies } from "next/headers";



export async function setCookies(name, value) {
    // नवीन व्हर्जनमध्ये 'await' करणे अनिवार्य आहे!
    const cookieStore = await cookies(); 
    
    cookieStore.set(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/", 
        maxAge: 60 * 60 * 2, // २ तास
        sameSite: "lax",
    });
}export async function getCookie(name) {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(name);
    return cookie?.value || null;
}