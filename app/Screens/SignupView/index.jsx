"use client"; 

import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation'; // १. रिडायरेक्टसाठी हे आवश्यक आहे
import { registeruser } from '../../actions/authAction';

export default function SignUpForm() {
  const router = useRouter(); // २. राउटर इनिशिअलाइज करा

  const handleSubmit = async (e) => {
    e.preventDefault(); // डिफॉल्ट रिफ्रेश थांबवा
    
    // फॉर्म डेटा गोळा करा
    const formData = new FormData(e.currentTarget);
    
    try {
      // ३. तुमची सर्वर अ‍ॅक्शन कॉल करा
      const result = await registeruser(formData);
      
      console.log("Form Submitted! 🚀");

      // ४. जर साइनअप यशस्वी झाले, तर होम पेजवर पाठवा
      if (result) { 
        router.push('/'); // होम पेजचा पाथ इथे द्या
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert("काहीतरी चुकले आहे, पुन्हा प्रयत्न करा!");
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex justify-center items-center font-sans p-4'>
      <div className='w-full max-w-lg shadow-2xl p-10 rounded-2xl bg-white border border-gray-100'>
        <h1 className='text-4xl font-extrabold text-center mb-8 text-gray-900'>
          Client SignUp
        </h1>

        {/* ५. onSubmit फंक्शन वापरा */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          
          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold text-gray-800">
              UserName<span className="text-red-500">*</span>
            </label>
            <input
              type='text'
              placeholder='Enter UserName'
              required
              name='userName'
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold text-gray-800">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type='email'
              placeholder='Enter Email'
              required
              name='email'
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400 transition-all"
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
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400 transition-all"
            />
          </div>

          <button
            type="submit"
            className='w-full bg-[#2248D0] hover:bg-blue-800 text-white font-bold py-4 rounded-lg text-xl shadow-lg transform active:scale-95 transition duration-200'
          >
            Create Account
          </button>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}