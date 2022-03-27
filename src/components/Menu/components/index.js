import React from 'react';
import '../styles/Menu.scss';
import MenuLink from '../../../utilities/MenuLink';
import { Link } from 'react-router-dom';
// import { WindowPlus } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { BaseComponent } from '../../../utilities';

class Menu extends BaseComponent {
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
            <MenuLink to='/chain-variables'>Chain Variables</MenuLink>
          </li>
          <li className={(Number.isInteger(this.props.currentHS) && this.props.currentHS >= 0) ? '' : 'disabled'}>
            <MenuLink to='/activity'>Latest activity</MenuLink>
          </li>
          <li className={(Number.isInteger(this.props.currentHS) && this.props.currentHS >= 0) ? '' : 'disabled'}>
            <MenuLink to='/rssi'>RSSI / Beacon Analysis</MenuLink>
          </li>
          <li className={(Number.isInteger(this.props.currentHS) && this.props.currentHS >= 0) ? '' : 'disabled'}>
            <MenuLink to='/snr'>SNR Data</MenuLink>
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
  currentHS: PropTypes.number
};

export default Menu;
