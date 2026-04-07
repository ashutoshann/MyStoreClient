"use client";

import React from 'react';
import { cn } from '../lib/utils'; // तुमच्या utils पाथनुसार बदला

const Accordion = ({ 
  title, 
  items = [], 
  selectedValue, 
  onChange, 
  type, 
  isOpened, 
  handleAccordion,
  children 
}) => {
  return (
    <div className='border-b border-gray-200 py-3'>
      {/* --- Accordion Header (टायटल आणि टॉगल बटण) --- */}
      <button 
        type="button"
        onClick={() => handleAccordion(type)} 
        className="flex justify-between items-center w-full font-bold text-left py-2 hover:text-blue-600 transition-colors"
      >
        <span className="capitalize text-gray-800">{title}</span>
        <span className="text-xl text-gray-500">
            {isOpened ? '−' : '+'}
        </span>
      </button>

      {/* --- Accordion Content (जेव्हा isOpened 'true' असेल तेव्हाच दिसेल) --- */}
      {isOpened && (
        <div className="pt-3 pb-2 flex flex-wrap gap-2 animate-in fade-in duration-300">
          
          {/* १. जर आयटम्स असतील तर ते 'Checkboxes' म्हणून दाखवा */}
          {items && items.length > 0 && items.map((item, index) => {
            // सुरक्षिततेसाठी ID तयार करणे
            const inputId = `${type}-${item.value || index}`;
            
            return (
              <div key={index} className='flex items-center'>
                <input 
                  type='checkbox' 
                  id={inputId} 
                  className='hidden peer' 
                  // IMP: दोन्हीला String मध्ये बदलून तुलना केल्याने '1' === 1 चा घोळ होत नाही
                  checked={String(selectedValue) === String(item.value)} 
                  onChange={() => onChange(item.value)} 
                />
                <label 
                  htmlFor={inputId} 
                  className={cn(
                    'px-4 py-1.5 border rounded-full cursor-pointer transition-all text-sm font-medium',
                    'border-gray-300 text-gray-600 hover:border-black',
                    'peer-checked:bg-black peer-checked:text-white peer-checked:border-black'
                  )}
                >
                  {item.label}
                </label>
              </div>
            );
          })}

          {/* २. जर काही 'Custom Children' (उदा. Price Slider) असतील तर ते इथे दिसतील */}
          {children && <div className="w-full">{children}</div>}
          
        </div>
      )}
    </div>
  );
};

export default Accordion;