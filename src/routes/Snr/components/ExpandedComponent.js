import { GetTimeAgo } from '../../../utilities';
import React from 'react';
import PropTypes from 'prop-types';

const ExpandedComponent = ({ data }) => {
  const rows = data.witnesses.map((w, i) => {
    const d = w.timestamp.toString().length <= 10 ? w.timestamp * 1000 : w.timestamp / 1000000;

    return (
      <tr key={i}>
        <td>{w.frequency ? w.frequency.toFixed(2) : '???'} MHz</td>
        <td>{w.channel}</td>
        <td>{w.signal}</td>
        <td>{w.snr ? w.snr.toFixed(2) : '???'}</td>
        <td>{(w.signal && w.snr) ? (w.signal - w.snr).toFixed(2) : '???'}</td>
        <td>{GetTimeAgo(d)}</td>
      </tr>
    );
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Frequency</th>
          <th>Channel</th>
          <th>Signal</th>
          <th>SNR</th>
          <th>Noise</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}

ExpandedComponent.propTypes = {
  data: PropTypes.object
};

export default ExpandedComponent;
