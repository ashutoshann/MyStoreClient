"use server"; // 👈 सर्वात महत्त्वाचं! हे या फाईलला 'Server Action' बनवतं.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";


// कुकी सेट करण्यासाठी छोटे हेल्पर फंक्शन
async function setCookies(name, value) {
    const cookieStore = await cookies();
    cookieStore.set(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 2 * 60 * 60, // २ तास
        sameSite: "lax",
    });
}

export async function registeruser(formData) {
    let success = false;

    try {
        const data = {
            name: formData.get('userName'),
            email: formData.get('email'),
            password: formData.get('password'),
        };

        const response = await fetch(`http://localhost:3001/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            // १. कुकी इथे सेट करा
            await setCookies("cookies_jwt_token", result.token);
            console.log("Success:", result.message);
            success = true; 
        } else {
            // २. alert() इथे टाकू नकोस, फक्त एरर थ्रो कर
            throw new Error(result.message || "Something went wrong");
        }

    } catch (error) {
        console.error("Network Error:", error.message);
        // रिडायरेक्ट 'NEXT_REDIRECT' एरर असेल तर त्याला सोडून द्या
        if (error.message.includes("NEXT_REDIRECT")) throw error;
        return { error: error.message };
    }

    // ३. रिडायरेक्ट नेहमी try/catch च्या बाहेर ठेवा!
    if (success) {
        redirect("/");
    }
}


 // ही ओळ सर्वात वर असणे अनिवार्य आहे


// export async function loginuser(formData) {
//     // १. खात्री कर की तुझ्या फॉर्ममध्ये input चं name 'userName' आहे
//     const email = formData.get('email'); 
//     const password = formData.get('password');

//     console.log("Attempting login for:", email);

//     try {
//         // २. 'localhost' ऐवजी '127.0.0.1' वापरा (सर्वात महत्त्वाचा बदल)
//         const response = await fetch(`http://127.0.0.1:3001/api/auth/login`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Accept": "application/json"
//             },
//             // ३. जर बॅकएंडला 'email' हवं असेल तर इथे 'email' की वापरा
//             body: JSON.stringify({ 
//                 email: email, 
//                 password: password 
//             })
//         });

//         const resData = await response.json();

//         if (!response.ok) {
//             console.log("Backend Error:", resData);
//             const msg = encodeURIComponent(resData.detail || resData.message || "Login Failed");
//             return redirect(`/login?errormessage=${msg}`);
//         }

//         // ✅ टोकन कुकीमध्ये सेव्ह करणे
//         if (resData.token || resData.access_token) {
//             const token = resData.token || resData.access_token;
//             const cookieStore = await cookies(); 
//             cookieStore.set("Jwt_token", token, {
//                 path: '/',
//                 httpOnly: true,
//                 maxAge: 60 * 60 * 2,
//                 sameSite: 'lax'
//             });
//             console.log("✅ Token saved!");
//         }

//     } catch (error) {
//         console.error("❌ Connection Failed:", error.message);
//         return redirect(`/login?errormessage=Connection Refused: Check if Backend is running on 3001`);
//     }

//     redirect('/'); 
// }
export async function loginuser(formData) {
    try {
        const email = formData.get('email');
        const password = formData.get('password');

        const response = await fetch(`http://localhost:3001/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            const cookieStore = await cookies();
            
            // १. टोकन सुरक्षित ठेवा (हे फ्रंटएंडला दिसणार नाही)
            cookieStore.set("cookies_jwt_token", result.token, { httpOnly: true, path: "/" });

            // २. ईमेल कुकी सेट करा (इथे httpOnly: false ठेवावे लागेल!) ✅
            cookieStore.set("email", email, { 
                httpOnly: false, // 👈 हे सगळ्यात महत्त्वाचे आहे!
                path: "/", 
                maxAge: 60 * 60 * 2 // २ तास
            });

            console.log("✅ Token and Email saved for:", email);
        } else {
            return { error: result.message };
        }
    } catch (error) {
        return { error: "Login failed" };
    }

    redirect("/"); // होम पेजवर पाठवा
}
export async function logoutuser() {
    try {
        const cookieStore = await cookies();
        
        // १. कुकीज नष्ट करा
        cookieStore.delete("cookies_jwt_token");
        cookieStore.delete("user_name");
        
        console.log("Server side: Cookies cleared! 🛡️");
    } catch (error) {
        console.error("Logout Error:", error);
    }

    // २. काम झाल्यावर इकडे पाठवा
    redirect("/login");
}
export async function logoutAction() {
    try {
        const cookieStore = await cookies();
        
        // १. कुकीज काढून टाका (Delete the cookies)
        // लक्षात ठेवा: 'httpOnly' कुकीज फक्त इथूनच डिलीट होऊ शकतात
        cookieStore.delete("cookies_jwt_token");
        cookieStore.delete("user_name");
        
        console.log("Server Action: User logged out successfully! 🛡️");

    } catch (error) {
        console.error("Logout error in Server Action:", error);
    }

    // २. युजरला बाहेर काढल्यावर लॉगिन पेजवर पाठवा
    // हे नेहमी try/catch च्या बाहेर ठेवा
    redirect("/login");
}