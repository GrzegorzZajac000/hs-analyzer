import React from 'react';
import PropTypes from 'prop-types';

const ExpandedComponent = ({ data }) => {
  return (
    <div className='city-expanded'>
      <div>
        <h3>Address</h3>
        <p>
          <a href={`https://explorer.helium.com/hotspots/${data.address}`} target='_blank' rel='noreferrer noopener'>
            {data.address}
          </a>
        </p>
      </div>
      <div>
        <h3>Block height</h3>
        <p>{data.block} / {data.blockchainHeight} = {data.blockchainHeight - data.block} blocks ago</p>
      </div>
      <div>
        <h3>Geocode</h3>
        <p>{data.location}</p>
      </div>
      <div>
        <h3>Owner</h3>
        <p>
          <a href={`https://explorer.helium.com/accounts/${data.owner}`} target='_blank' rel='noreferrer noopener'>
            {data.owner}
          </a>
        </p>
      </div>
      <div>
        <h3>Status</h3>
        <p>{data.status}</p>
      </div>
      <div>
        <h3>Timestamp added</h3>
        <p>{new Date(data.timestamp_added).toISOString().replace('T', ' ').replace('Z', '')}</p>
      </div>
    </div>
  );
}

ExpandedComponent.propTypes = {
  data: PropTypes.object
};

export default ExpandedComponent;
