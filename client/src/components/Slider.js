// Slider.js
import React from 'react';
import MultiRangeSlider from "multi-range-slider-react";

const Slider = ({ label, min, max, onChange, step }) => {
  return (
    <div className="slider-container">
      <label>{label}</label>
      <MultiRangeSlider
        min={0}
        max={max}
        step={step}
        minValue={min}
        maxValue={max}
        onInput={(values) => onChange(values)} // Call the onChange prop with the new value
      />
    </div>
  );
};

export default Slider;
