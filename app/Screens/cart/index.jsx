"use client";

import React from 'react';
import Image from 'next/image';
import { StarIcon, MinusIcon, PlusIcon, DeleteIcon } from '../../components/icon.jsx';
import { useProductContext } from '../../../app/components/layout/ProductContext.jsx'
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // ✅ हे वापरा
const Cart = () => {
    const { 
        cartItems, 
        removeProductFromCart, 
        increaseQuantity, 
        decreaseQuantity 
    } = useProductContext();

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

    const totalAmount = cartItems?.reduce((acc, item) => {
        return acc + (Number(item.sellPrice) * (item.quantity || 1));
    }, 0) || 0;
    const  router = useRouter();
    const handleCheckOut = () =>{
        router.push("/checkout")
    }

    return (
        <div className="p-8 bg-[#f3f4f6] min-h-screen font-sans text-black">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold">Shopping Cart</h1>
                    <p className="text-gray-500 font-medium">{cartItems.length} Items</p>
                </div>

                <div className="flex flex-col lg:flex-row items-start gap-8">
                    
                    {/* १. डावी बाजू: प्रॉडक्ट लिस्ट */}
                    <div className="flex-1 w-full space-y-6">
                        {cartItems && cartItems.length > 0 ? (
                            cartItems.map((item) => {
                                const imgSrc = item.image 
                                    ? `${BASE_URL}${item.image.startsWith('/') ? '' : '/'}${item.image}`
                                    : "https://placehold.co/400x400?text=No+Image";

                                return (
                                    <div key={item.id} className="bg-white rounded-2xl overflow-hidden flex shadow-sm p-5 border border-gray-100">
                                        {/* Image Section */}
                                        <div className="w-48 h-48 bg-[#f9f9f9] flex items-center justify-center rounded-xl overflow-hidden p-4">
                                            <Image
                                                className="mix-blend-multiply object-contain"
                                                src={imgSrc}
                                                alt={item.name}
                                                width={160}
                                                height={160}
                                                unoptimized={true}
                                            />
                                        </div>

                                        {/* Details Section */}
                                        <div className="flex-1 ml-8 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
                                                    <div className="flex items-center gap-1 text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <StarIcon key={i} className="w-4 h-4 fill-current" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 bg-gray-50 uppercase">
                                                    {item.productType?.name || "Premium"}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-400 line-through text-lg">₹{item.mrp}</span>
                                                <span className="text-2xl font-extrabold text-black">₹{item.sellPrice}</span>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-8">
                                                    <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 gap-4 border border-gray-200">
                                                        <button onClick={() => decreaseQuantity(item.id)} className="hover:text-red-600 transition-colors">
                                                            <MinusIcon className="w-5 h-5" />
                                                        </button>
                                                        <span className="font-bold text-lg">{item.quantity || 1}</span>
                                                        <button onClick={() => increaseQuantity(item.id)} className="hover:text-blue-600 transition-colors">
                                                            <PlusIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-sm text-gray-500 uppercase">Size:</span>
                                                        <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-black text-white text-xs font-bold">
                                                            {item.size || 'M'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={() => removeProductFromCart(item.id)}
                                                    className="flex items-center gap-2 bg-[#ef4444] hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
                                                >
                                                    <DeleteIcon className="w-5 h-5" />
                                                    <span>Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col justify-center items-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-400">Your cart is empty</h2>
                                <Link href="/" className="mt-4 text-blue-600 font-bold hover:underline">Continue Shopping</Link>
                            </div>
                        )}
                    </div>

                    {/* २. उजवी बाजू: Order Summary (This will be Sticky) */}
                    <aside className="w-full lg:w-96 sticky top-10 self-start">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                                <h2 className="text-xl font-extrabold text-gray-900">Order Summary</h2>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                {/* आयटम लिस्ट */}
                                <div className="max-h-60 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex justify-between items-start text-sm">
                                            <div className="flex flex-col">
                                                <span className="text-gray-800 font-medium truncate w-40">{item.name}</span>
                                                <span className="text-gray-400 text-xs">(x{item.quantity || 1})</span>
                                            </div>
                                            <span className="font-bold text-gray-900">₹{(item.sellPrice * (item.quantity || 1)).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="pt-4 border-t border-gray-100 space-y-4">
                                    <div className="flex justify-between items-center text-gray-600">
                                        <span className="text-sm">Subtotal</span>
                                        <span className="font-bold text-gray-900">₹{totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-green-600">
                                        <span className="text-sm">Shipping</span>
                                        <span className="font-bold text-sm">FREE</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-gray-100">
                                        <span className="font-extrabold text-gray-900 text-xl">Total Amount</span>
                                        <span className="font-extrabold text-blue-600 text-2xl">₹{totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button 
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:bg-gray-300"
                                    disabled={cartItems.length === 0} onClick={handleCheckOut}
                                >
                                    Proceed to Checkout
                                </button>
                                <p className="text-[10px] text-center text-gray-400 mt-4 uppercase tracking-widest font-bold">
                                    Secure SSL Encrypted Checkout
                                </p>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
};

export default Cart;