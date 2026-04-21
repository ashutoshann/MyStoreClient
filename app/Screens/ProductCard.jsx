"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation' // १. Router इंपोर्ट केला ✅
import { StarIcon } from '@/components/icon.jsx'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { cn } from "@/components//lib/utils.js"
import { useProductContext } from '@/components/layout/ProductContext'

const ProductCard = ({ product }) => {
  const router = useRouter(); // २. Router डिफाइन केला ✅
  const { addProductToCart, removeProductFromCart, cartItems } = useProductContext();
  const [imgError, setImgError] = useState(false);

  // ३. व्हेरिएबलचे नाव नीट तपासा (isProductCart) ✅
  const isProductCart = cartItems?.some((item) => item.id === product.id)
  
  // स्टॉक नाव डेटाबेसनुसार तपासा (मी इथे currentStock वापरले आहे)
  const hasStock = product?.currentStock > 0;

  const handleCartItem = (e) => {
    e.stopPropagation(); // कार्ड क्लिक इव्हेंट थांबवण्यासाठी
    if (isProductCart) {
      removeProductFromCart(product.id)
    } else {
      addProductToCart({
        ...product,
        quantity: 1,
        size: 'S'
      })
    }
  }

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (hasStock) {
      // जर आधीच कार्टमध्ये नसेल, तर ॲड करा
      if (!isProductCart) {
        addProductToCart({
          ...product,
          quantity: 1,
          size: 'S'
        });
      }
      // ४. आता चेकआउट पेजवर जाईल ✅
      router.push(`/checkout?productId=${product.id}`);
    }
  }

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
  const imgSrc = imgError || !product?.image 
    ? "https://placehold.co/400x400?text=No+Image" 
    : `${BASE_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}`;

  return (
    <div className='group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden flex flex-col h-full transition-all duration-300'>
      
      {/* इमेज विभाग */}
      <div className="relative aspect-square w-full bg-[#f3f4f6] p-4 overflow-hidden">
        <Image 
          src={imgSrc} 
          alt={product?.name || "Product"}
          fill
          className='object-contain group-hover:scale-105 transition-transform duration-500' 
          onError={() => setImgError(true)}
          unoptimized
        />
        
        {product?.mrp > product?.sellPrice && (
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md">
            {Math.round(((product.mrp - product.sellPrice) / product.mrp) * 100)}% OFF
          </span>
        )}
      </div>

      <div className='p-4 flex flex-col flex-grow space-y-2'>
        <div>
          <Link href={`/product/${product.id}`}>
            <h2 className="text-sm font-bold cursor-pointer hover:text-blue-600 truncate">
              {product.name}
            </h2>
          </Link>
          <p className='text-[10px] text-gray-400 uppercase font-medium tracking-tighter'>
            {product?.productType?.name || "Category"}
          </p>
        </div>

        <div className='flex items-baseline gap-2'>
          <span className='text-xl font-bold text-gray-900'>₹{product?.sellPrice}</span>
          <span className='text-xs text-gray-400 line-through'>₹{product?.mrp}</span>
        </div>

        <div className='flex justify-between items-center pt-1'>
          <div className='flex gap-0.5 text-yellow-400'>
            {[...Array(5)].map((_, i) => <StarIcon key={i} className="size-3" />)}
          </div>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${hasStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {hasStock ? 'IN STOCK' : 'OUT OF STOCK'}
          </span>
        </div>

        {/* बटन्स विभाग ✅ */}
        <div className='flex gap-2 pt-3 mt-auto'> 
          <Button 
            onClick={handleCartItem} 
            className={cn(
              "flex-1 py-2.5 text-[11px] h-10 flex items-center justify-center border-none transition-all", 
              isProductCart 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            )}
          >
            {isProductCart ? "Remove" : "Add To Cart"}
          </Button>          
          
          <button 
            onClick={handleBuyNow}
            disabled={!hasStock}
            className={`flex-1 py-2.5 rounded-md text-[11px] font-bold shadow-sm transition-all ${
               hasStock 
               ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95' 
               : 'bg-gray-300 text-white cursor-not-allowed'
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard;