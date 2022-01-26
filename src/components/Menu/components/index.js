import React from 'react';
import '../styles/Menu.scss';
import MenuLink from '../../../utilities/MenuLink';

class Menu extends React.Component {
  render () {
    console.log(this.props);

    return (
      <nav className='menu'>
        <ul>
          <li>
            <MenuLink to='/'>Config</MenuLink>
          </li>
          <li>
            <MenuLink to='/info'>General info</MenuLink>
          </li>
          <li>
            <MenuLink to='/connectivity'>Connectivity</MenuLink>
          </li>
          <li>
            <MenuLink to='/activity'>Latest activity</MenuLink>
          </li>
          <li>
            <MenuLink to='/rssi'>RSSI</MenuLink>
          </li>
          <li>
            <MenuLink to='/snr'>SNR</MenuLink>
          </li>
          <li>
            <MenuLink to='/donate'>Donate</MenuLink>
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
