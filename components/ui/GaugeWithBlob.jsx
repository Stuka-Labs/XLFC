import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Helper function to create an arc path for a given start and end angle
const createArcPath = (startAngle, endAngle, radius, strokeWidth) => {
  const start = polarToCartesian(radius, radius, radius - strokeWidth / 2, endAngle);
  const end = polarToCartesian(radius, radius, radius - strokeWidth / 2, startAngle);

  const arcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return `
    M ${start.x},${start.y} 
    A ${radius - strokeWidth / 2},${radius - strokeWidth / 2} 0 ${arcFlag} 0 ${end.x},${end.y}
  `;
};

// Helper function to convert polar coordinates to Cartesian (for arc)
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
};

const GaugeWithBlob = ({ width, height, strokeWidth, sections }) => {
  const radius = width / 2;

  return (
    <View>
      <Svg
        width={width}
        height={height / 2}
        viewBox={`0 0 ${width} ${height / 2}`}
      >
        {sections.map(({ startAngle, endAngle, color }, index) => (
          <Path
            key={index}
            d={createArcPath(startAngle, endAngle, radius, strokeWidth)}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"  // This makes the arc edges rounded
          />
        ))}
      </Svg>
    </View>
  );
};

export default GaugeWithBlob;
