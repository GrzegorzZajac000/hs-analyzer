import React from 'react';
import '../styles/Menu.scss';
import MenuLink from '../../../utilities/MenuLink';
import { Link } from 'react-router-dom';
// import { WindowPlus } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';

class Menu extends React.Component {
  render () {
    return (
      <nav className='menu'>
        <Link to='/' className='menu-logo'>
          <p>HS Analyzer</p>
          <p className='menu-logo-version'>Beta v0.2.0</p>
        </Link>
        <ul>
          <li>
            <MenuLink to='/'>General info</MenuLink>
          </li>
          <li>
            <MenuLink to='/config'>Check your hotspot</MenuLink>
          </li>
          {/* <li className={!this.props.hsInfo.address ? 'disabled' : ''}> */}
          {/*  <MenuLink to='/connectivity'>Connectivity</MenuLink> */}
          {/* </li> */}
          <li className={!this.props.hsInfo.address ? 'disabled' : ''}>
            <MenuLink to='/activity'>Latest activity</MenuLink>
          </li>
          <li className={!this.props.hsInfo.address ? 'disabled' : ''}>
            <MenuLink to='/rssi'>RSSI</MenuLink>
          </li>
          <li className={!this.props.hsInfo.address ? 'disabled' : ''}>
            <MenuLink to='/snr'>SNR</MenuLink>
          </li>
          <li>
            <MenuLink to='/donate'>Donate</MenuLink>
          </li>
          {/* <li> */}
          {/*  <a href='https://github.com/GrzegorzZajac000/hs-analyzer' target='_blank' rel='noreferrer noopener'>GitHub <WindowPlus size={18} /></a> */}
          {/* </li> */}
        </ul>
      </nav>
    );
  }
}

Menu.propTypes = {
  hsInfo: PropTypes.object
};

export default Menu;
