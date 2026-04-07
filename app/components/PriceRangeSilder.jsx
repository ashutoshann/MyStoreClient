"use client";
import Slider from 'rc-slider';
import React from 'react';
import 'rc-slider/assets/index.css';

const PriceRangeSilder = ({ value, minvalue, maxValue, handleChange, onAfterChange }) => {
  return (
    <div className='w-full px-2 py-4'>
        <Slider 
          range 
          min={minvalue} 
          max={maxValue} 
          value={value}
          onChange={handleChange}     // Changes numbers on screen (smooth)
          onAfterChange={onAfterChange} // Updates URL (only when you let go)
          allowCross={false}
          trackStyle={[{ backgroundColor: 'black' }]}
          handleStyle={[
            { borderColor: 'black', backgroundColor: 'white', opacity: 1, boxShadow: 'none' },
            { borderColor: 'black', backgroundColor: 'white', opacity: 1, boxShadow: 'none' }
          ]}
        />
    </div>
  );
};

export default PriceRangeSilder;