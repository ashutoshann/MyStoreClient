"use client"; 

import React, { useState } from 'react'
import Image from 'next/image'
import { StarIcon } from '../../components/icon.jsx'
import { useProductContext } from '../../components/layout/ProductContext.jsx'

// १. इथे 'product' ऐवजी 'data' करा कारण page.jsx मधून 'data' येतोय ✅
const Product = ({ product }) => {
  const { addProductToCart, removeProductFromCart, cartItems } = useProductContext();
  const [selectedSize, setSelectedSize] = useState('M');
  const [imgError, setImgError] = useState(false);

  // प्रॉडक्टला सोयीसाठी 'product' व्हेरिएबलमध्ये स्टोअर करूया
  

  // २. जर डेटा आला नसेल तर लोडिंग दाखवा
  if (!product) {
    return (
      <div className="p-20 text-center">
        <p className="text-xl font-bold">प्रॉडक्ट माहिती लोड होत आहे...</p>
        <p className="text-sm text-gray-500">कृपया थोडा वेळ थांबा किंवा रिफ्रेश करा.</p>
      </div>
    );
  }

  const isProductInCart = cartItems?.some((item) => item.id === product.id);
  
  // ३. इमेज पाथ लॉजिक
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"; // तुमचा पोर्ट तपासा
  const finalImgSrc = (imgError || !product?.image) 
    ? "https://placehold.co/400x400?text=No+Image" 
    : product.image.startsWith('http') 
      ? product.image 
      : `${BASE_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}`;

  const handleCartItem = () => {
    if (isProductInCart) {
      removeProductFromCart(product.id)
    } else {
      addProductToCart({
        ...product,
        quantity: 1,
        size: selectedSize
      })
    }
  }

  return (
    <div className="max-w-6xl mx-auto my-10 p-4">
       {/* Debugging साठी हे टर्मिनलमध्ये किंवा कन्सोलमध्ये बघण्यासाठी */}
       {/* {console.log("Product Data in UI:", product)} */}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0 shadow-lg">
        
        {/* इमेज विभाग */}
        <div className="bg-[#F3F4F6] flex items-center justify-center p-12 min-h-[400px]">
          <div className="relative w-full h-[350px] flex items-center justify-center">
            <Image 
              src={finalImgSrc} 
              alt={product?.name || "Product Image"} 
              fill
              className="object-contain p-4"
              priority 
              unoptimized={true}
              onError={() => setImgError(true)}
            />
          </div>
        </div>

        {/* डिटेल्स विभाग */}
        <div className="p-8 flex flex-col relative">
          <div className="absolute top-6 right-8 border border-gray-400 rounded-md px-3 py-1">
            <span className="text-xs font-medium text-gray-800">
                {product?.productType?.name || "General"}
            </span>
          </div>

          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">{product?.name}</h1>
            
            <div className="flex gap-0.5 text-yellow-400 mt-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`w-5 h-5 fill-current ${i < (product?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} />
              ))}
              <span className="text-gray-400 text-sm ml-2">({product?.rating || 0})</span>
            </div>

            <div className="mt-6">
              <p className="text-green-600 text-sm font-semibold">Special Price</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-bold text-gray-900">₹{product?.sellPrice}</span>
                <span className="text-xl text-gray-400 line-through">₹{product?.mrp}</span>
              </div>
              <p className={`text-sm mt-1 ${product?.currentStock > 0 ? 'text-gray-500' : 'text-red-500 font-bold'}`}>
                {product?.currentStock > 0 ? `${product.currentStock} items left` : "Out of Stock"}
              </p>
            </div>

            {/* साइज सिलेक्शन */}
            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Size</h3>
              <div className="flex gap-3">
                {sizeOptions.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => setSelectedSize(size.value)}
                    className={`w-10 h-10 border rounded-md flex items-center justify-center text-sm font-medium transition-all
                      ${selectedSize === size.value 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-900 mb-1">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product?.description || "No description available."}
              </p>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleCartItem}
                disabled={product?.currentStock <= 0}
                className={`flex-1 py-3 rounded-md font-semibold border transition-colors ${
                  isProductInCart 
                  ? 'bg-red-50 border-red-500 text-red-600 hover:bg-red-100' 
                  : product?.currentStock > 0 
                    ? 'bg-white border-gray-900 text-gray-900 hover:bg-gray-50'
                    : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isProductInCart ? "Remove from Cart" : "Add to Cart"}
              </button>
              <button 
                disabled={product?.currentStock <= 0}
                className={`flex-1 py-3 rounded-md font-semibold shadow-md transition-colors ${
                   product?.currentStock > 0 
                   ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                   : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const sizeOptions = [
    { label: "S", value: "S" },
    { label: "M", value: "M" },
    { label: "L", value: "L" }
];

export default Product;