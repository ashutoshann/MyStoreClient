"use client"
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // हे ॲड कर
import { loginuser } from "../../actions/authAction";

const Login = () => {
    // URL मधून एरर मेसेज वाचण्यासाठी
    const searchParams = useSearchParams();
    const errorMessage = searchParams.get("errormessage");

    return (
        <div className='h-screen bg-gray-100 flex justify-center items-center font-sans'>
            <div className='w-full max-w-lg shadow-xl p-12 rounded-xl bg-white border border-gray-200'>

                <h1 className='text-4xl font-bold text-center mb-10 text-gray-900'>Client Login</h1>

                {/* ✅ जर एरर असेल तर इथे लाल बॉक्समध्ये दिसेल */}
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-center animate-pulse">
                        ⚠️ {errorMessage}
                    </div>
                )}

                <form action={loginuser} className='flex flex-col gap-8'>
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-semibold text-gray-800">
                            UserEmail<span className="text-red-500">*</span>
                        </label>
                        <input
                            type='text'
                            placeholder='email'
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400"
                            name='email' // खात्री कर की तुझ्या बॅकएंडला 'userName'च हवाय (की email?)
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-semibold text-gray-800">
                            Password<span className="text-red-500">*</span>
                        </label>
                        <input
                            type='password'
                            placeholder='Enter your password'
                            required
                            minLength={8}
                            name='password'
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400"
                        />
                    </div>

                    <button
                        type="submit"
                        className='w-full bg-[#2248D0] hover:bg-blue-800 text-white font-bold py-4 rounded-lg text-xl transition duration-200'
                    >
                        Submit
                    </button>
                    
                    <Link href="sign-up" className="text-blue-600 font-semibold hover:underline text-center">
                            Don't have account? Please signup
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default Login;