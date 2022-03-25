import React from 'react';

const generateLegend = data => {
  return data.map((dataset, i) => {
    if (!dataset || dataset.label === 'Earnings') {
      return null;
    }

    return (
      <div className='rssi-box-legend-item' key={i}>
        <div className='rssi-box-legend-item-box' style={{ backgroundColor: dataset.backgroundColor }} />
        <div className='rssi-box-legend-item-label'>{dataset.label}</div>
      </div>
    );
  });
};

export default generateLegend;
