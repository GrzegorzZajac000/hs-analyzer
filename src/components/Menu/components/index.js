import React from 'react';
import '../styles/Menu.scss';
import { Link } from 'react-router-dom';

class Menu extends React.Component {
  render () {
    return (
      <nav className='menu'>
        <ul>
          <li>
            <Link to='/'>Config</Link>
          </li>
          <li>
            <Link to='/info'>General info</Link>
          </li>
          <li>
            <Link to='/connectivity'>Connectivity</Link>
          </li>
          <li>
            <Link to='/activity'>Latest activity</Link>
          </li>
          <li>
            <Link to='/rssi'>RSSI</Link>
          </li>
          <li>
            <Link to='/snr'>SNR</Link>
          </li>
          <li>
            <Link to='/donate'>Donate</Link>
          </li>
          <li>
            <a href='https://github.com/GrzegorzZajac000/hs-analyzer' target='_blank' rel='noreferrer noopener'>GitHub</a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Menu;
