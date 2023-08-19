import React from 'react';
import MultiRangeSlider from "multi-range-slider-react";
import { Text } from '@chakra-ui/react';

const Slider = ({ label, min, max, onChange, step }) => {
  return (
    <div className="slider-container" width="100%">
      <Text width="200px">{label}</Text>
      <MultiRangeSlider
        min={min}
        width={100}
        max={max}
        step={step}
        minValue={min}
        maxValue={max}
        onInput={(values) => onChange(values)} // Call the onChange prop with the new value
        boxShadow="false"
        label="false"
        border="false"
        ruler="false"
        style={{border:'none', boxShadow:'none'}}
      />
    </div>
  );
};

export default Slider;
