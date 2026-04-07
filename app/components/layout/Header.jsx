"use client";

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react'; 
import { SearchIcon, CartIcon, UserIcon } from '@/app/components/icon';
import Input from '../../components/ui/input';
import { useProductContext } from '../layout/ProductContext';
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Cookies from 'js-cookie'; 
import { logoutAction } from "../../actions/authAction";

const Header = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const { cartItems } = useProductContext();

  // --- १. स्टेट मॅनेजमेंट ---
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // --- २. लॉगिन आणि ईमेल तपासणे (Auth Logic) ---
// Header.jsx मध्ये useEffect तपासा
useEffect(() => {
    // कुकीजमधून 'email' वाचा
    const savedEmail = Cookies.get('email'); 
    console.log("Header checking cookie:", savedEmail); // हे कन्सोलमध्ये तपासा

    if (savedEmail) {
      setIsLoggedIn(true);
      setEmail(savedEmail);
    } else {
      setIsLoggedIn(false);
      setEmail("");
    }
}, [pathname]); // प्रत्येक पेज बदलल्यावर (redirect झाल्यावर) हे चालेल
  // --- ३. सर्च लॉजिक (Debounce Search) ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // जर सर्च बॉक्स रिकामा असेल आणि आपण होम पेजवर नसू, तर सर्च करू नका
      if (!searchTerm.trim() && pathname !== "/") return;

      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm.trim()) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      params.delete("page");

      // कोणत्याही पेजवरून सर्च केला तरी होमवर रिडायरेक्ट करणे ✅
      router.push(`/?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // --- ४. लॉगआउट फंक्शन ---
  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      await logoutAction(); 
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className='navbar bg-white shadow-sm py-4 sticky top-0 z-50'>
      <div className="container mx-auto flex justify-between items-center px-4">
        
        {/* लोगोच्या जागी ईमेल दाखवणे */}
        <Link href="/">
          <h1 className='text-lg font-bold text-blue-600 lowercase max-w-[220px] truncate' title={email}>
            {isLoggedIn && email ? email : "My Estore"}
          </h1>
        </Link>
        
        {/* सर्च बार (Working ✅) */}
        <div className='relative w-full max-w-lg mx-4'>
          <SearchIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <Input
            className='pl-10 w-full rounded-full border-gray-200 focus:ring-2 focus:ring-blue-500'
            placeholder="Search Product...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className='flex items-center gap-6'>
          {/* कार्ट आयकॉन */}
          <Link href="/cart" className='relative'>
            <CartIcon />
            {cartItems?.length > 0 && (
              <span className='absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm'>
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* युजर सेक्शन आणि लॉगआउट */}
          <div className='relative' ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)} 
              className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition-all border border-transparent hover:border-gray-200"
            >
              {isLoggedIn && email ? (
                <div className="bg-blue-600 text-white w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                  {email.charAt(0).toUpperCase()}
                </div>
              ) : (
                <div className="p-2 bg-gray-50 rounded-full"><UserIcon /></div>
              )}
            </button>

            {dropdownOpen && (
              <div className='absolute right-0 mt-3 w-60 bg-white border border-gray-100 shadow-2xl rounded-xl py-2 z-50 overflow-hidden'>
                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-50 bg-gray-50">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Profile</p>
                      <p className="text-xs font-semibold text-gray-900 truncate lowercase">{email}</p>
                    </div>
                    <Link href="/orders" onClick={() => setDropdownOpen(false)} className='block px-4 py-2 text-gray-700 hover:bg-blue-50'>My Orders</Link>
                    <button 
                      onClick={handleLogout} 
                      className='w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-bold border-t border-gray-50'
                    >
                      Logout 👋
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className='block px-4 py-2 text-gray-700 hover:bg-blue-50' onClick={() => setDropdownOpen(false)}>Login</Link>
                    <Link href="/sign-up" className='block px-4 py-2 text-gray-700 hover:bg-blue-50' onClick={() => setDropdownOpen(false)}>Register</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;