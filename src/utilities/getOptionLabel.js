import React from 'react';
import Flag from 'react-world-flags';

const getOptionLabel = data => {
  if (!data.data) {
    return data.label;
  }

  return (
    <React.Fragment>
      <Flag className='flag' code={data.data.geocode.short_country} height={16} />
      <span>{data.label}</span>
    </React.Fragment>
  );
}

export default getOptionLabel;
