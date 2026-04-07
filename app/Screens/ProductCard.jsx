"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { StarIcon } from '../components/icon'
import Button from '@/app/components/ui/Button'
import Link from 'next/link'
import { cn } from "../../app/components/lib/utils.js"

// खालीलपैकी एक जो तुझ्या फोल्डर स्ट्रक्चरला मॅच होईल तोच ठेवा:
import { useProductContext } from '../../app/components/layout/ProductContext' // जर app/context मध्ये असेल तर
// किंवा 
// import { useProductContext } from '@/context/ProductContext' 

const ProductCard = ({ product }) => {
   // ... बाकी कोड सेम राहील  // १. useContext() ऐवजी आपला कस्टम हुक वापरा
  const { addProductToCart, removeProductFromCart, cartItems } = useProductContext();
  
  // cartItems अस्तित्वात आहे की नाही हे तपासा (Safety Check)
  const isProductCart = cartItems?.some((item) => item.id === product.id)
  
  const [imgError, setImgError] = useState(false);

  const handleCartItem = () => {
    if (isProductCart) {
      removeProductFromCart(product.id)
    } else {
      addProductToCart({
        ...product,
        quantity: 1,
        size: 'S' // 'smallSize' ऐवजी स्ट्रिंग वापरा किंवा व्हेरिएबल डिफाइन करा
      })
    }
  }

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

  const imgSrc = imgError || !product?.image 
    ? "https://placehold.co/400x400?text=No+Image" 
    : `${BASE_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}`;

  return (
    <div className='group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden flex flex-col h-full transition-all duration-300'>
      
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
  <h2 className="cursor-pointer hover:text-blue-600">
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
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${product?.currentStocke > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {product?.currentStocke > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
          </span>
        </div>

        <div className='flex gap-2 pt-3 mt-auto'> 
<Button 
    onClick={handleCartItem} 
    // इथून w-full काढून टाकला आणि flex-1 टाकलाय
    className={cn(
      "flex-1 py-2.5 text-[11px] h-10 flex items-center justify-center", 
      isProductCart 
        ? "bg-red-500 hover:bg-red-600 border-none text-white" 
        : "bg-blue-600 hover:bg-blue-700 text-white border-none"
    )}
  >
    {isProductCart ? "Remove" : "Add To Cart"}
  </Button>          <button 
            disabled={product?.currentStocke <= 0}
            className={`flex-1 rounded-xl text-[11px] font-bold py-2 transition-all ${product?.currentStocke > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard;