import React from 'react';
import '../styles/Menu.scss';

class Menu extends React.Component {
  render () {
    return (
      <nav className='menu'>
        <ul>
          <li>Config</li>
          <li>General info</li>
          <li>Latest activity</li>
          <li>RSSI</li>
          <li>SNR</li>
          <li>Donate</li>
          <li>GitHub</li>
        </ul>
      </nav>
    );
  }
}

export default Menu;
