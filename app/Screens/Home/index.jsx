import React from 'react'
import FilterSection from './filter/index'
import ProductCard from '../ProductCard'

// ✅ इकडे 'products' (Plural) लिहा
const HomeScreens = ({ products, productTypes }) => {
  return (
    <div className='p-5'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
        <div className='col-span-1'>
          <FilterSection productTypes={productTypes} />
        </div>

        <div className='col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {/* ✅ 'products' मॅप करणे */}
          {products && products.length > 0 ? (
            products.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))
          ) : (
            <div className="col-span-3 text-center py-20 font-bold text-gray-500">
              सध्या कोणतेही सक्रिय प्रॉडक्ट्स उपलब्ध नाहीत.
            </div>
          )} 
      
        </div>
      </div>
    </div>
  )
}
export default HomeScreens;