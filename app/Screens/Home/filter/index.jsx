"use client";

import React, { useState, useEffect, Suspense } from 'react'; 
import { useRouter, useSearchParams } from 'next/navigation';
// १. @/ पाथ वापरल्यामुळे फोल्डर कुठेही हलवलं तरी एरर येणार नाही ✅
import Accordion from '@/components/ui/Accordion';
import PriceRangeSilder from '@/components/PriceRangeSilder';
import { objectQueryString } from '@/components/lib/utils';

// २. मुख्य लॉजिकला वेगळं केलं जेणेकरून Suspense वापरता येईल
const FilterContent = ({ productTypes }) => {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const currentParams = Object.fromEntries(searchParamsHook.entries());

  // --- LOCAL STATE (For Smooth Slider) ---
  const [localPrice, setLocalPrice] = useState([
    Number(currentParams.minPrice) || 0,
    Number(currentParams.maxPrice) || 1000
  ]);

  useEffect(() => {
    setLocalPrice([
      Number(currentParams.minPrice) || 0,
      Number(currentParams.maxPrice) || 1000
    ]);
  }, [currentParams.minPrice, currentParams.maxPrice]);

  // --- DATA ARRAYS ---
  const sortByItems = [
    { label: "All", value: "all" },
    { label: "Price: High to Low", value: "-sellPrice" },
    { label: "Price: Low to High", value: "sellPrice" }
  ];

  const ratingItems = [
    { label: "All", value: "all" },
    { label: "1 Star", value: "1" },
    { label: "2 Stars", value: "2" },
    { label: "3 Stars", value: "3" },
    { label: "4 Stars", value: "4" },
    { label: "5 Stars", value: "5" },
  ];

  const availabilityItems = [
    { label: "All", value: "all" },
    { label: "In Stock", value: "instock" },
    { label: "Out of Stock", value: "outofstock" }
  ];

  // --- LOGIC FUNCTIONS ---
  const updateSearchParams = (newParamsArray) => {
    let updatedParams = { ...currentParams };
    newParamsArray.forEach(param => {
      Object.entries(param).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "" || value === "all") {
          delete updatedParams[key];
        } else {
          updatedParams[key] = value;
        }
      });
    });
    const queryString = objectQueryString(updatedParams);
    router.push(`/?${queryString}`, { scroll: false });
  };

  const handleAccordion = (value) => {
    const openAccordion = currentParams.openAccordion?.split(",") || [];
    const newOpenAccordion = openAccordion.includes(value)
      ? openAccordion.filter((item) => item !== value)
      : [...openAccordion, value];
    updateSearchParams([{ openAccordion: newOpenAccordion.join(",") }]);
  };

  const handleChangeFilter = (filterType, value) => {
    updateSearchParams([{ [filterType]: value }]);
  };

  const handlePriceCommit = (value) => {
    updateSearchParams([{ minPrice: value[0] }, { maxPrice: value[1] }]);
  };

  const openAccordion = currentParams.openAccordion?.split(",") || [];

  return (
    <div className='rounded-lg shadow-lg p-5 bg-white h-fit w-full max-w-md'>
      <h1 className='text-2xl mb-6 font-semibold text-gray-800'>Filters</h1>

      <Accordion
        title="Category"
        isOpened={openAccordion.includes("productTypeId")}
        type="productTypeId"
        handleAccordion={handleAccordion}
        items={productTypes}
        selectedValue={currentParams.productTypeId || "all"}
        onChange={(val) => handleChangeFilter("productTypeId", val)}
      />

      <Accordion
        title="Sort By"
        isOpened={openAccordion.includes("sortBy")}
        type="sortBy"
        handleAccordion={handleAccordion}
        items={sortByItems}
        selectedValue={currentParams.sortBy || "all"}
        onChange={(val) => handleChangeFilter("sortBy", val)}
      />

      <Accordion
        title="Price Range"
        isOpened={openAccordion.includes("priceRange")}
        type="priceRange"
        handleAccordion={handleAccordion}
        items={[]}
      >
        <div className="flex flex-col space-y-5 mt-4 px-2">
          <div className='flex justify-between items-center font-bold text-gray-700'>
            <span className="bg-gray-100 px-2 py-1 rounded text-sm">${localPrice[0]}</span>
            <span className="text-gray-400">—</span>
            <span className="bg-gray-100 px-2 py-1 rounded text-sm">${localPrice[1]}</span>
          </div>
          <PriceRangeSilder 
            minvalue={0} 
            maxValue={1000} 
            value={localPrice} 
            handleChange={(val) => setLocalPrice(val)} 
            onAfterChange={handlePriceCommit} 
          />
        </div>
      </Accordion>

      <Accordion
        title="Rating"
        isOpened={openAccordion.includes("rating")}
        type="rating"
        handleAccordion={handleAccordion}
        items={ratingItems}
        selectedValue={currentParams.rating || "all"}
        onChange={(val) => handleChangeFilter("rating", val)}
      />

      <Accordion
        title="Availability"
        isOpened={openAccordion.includes("inStock")}
        type="inStock"
        handleAccordion={handleAccordion}
        items={availabilityItems}
        selectedValue={currentParams.inStock || "all"}
        onChange={(val) => handleChangeFilter("inStock", val)}
      />
    </div>
  );
};

// ३. मुख्य एक्सपोर्टमध्ये Suspense रॅप केला आहे जेणेकरून Vercel बिल्ड एरर येणार नाही ✅
const FilterSection = (props) => {
  return (
    <Suspense fallback={<div className="p-5 text-gray-500">Loading Filters...</div>}>
      <FilterContent {...props} />
    </Suspense>
  );
};

export default FilterSection;