import React from 'react';
import '../styles/Menu.scss';
import MenuLink from '../../../utilities/MenuLink';
import { Link } from 'react-router-dom';
// import { WindowPlus } from 'react-bootstrap-icons';
import { List } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { BaseComponent } from '../../../utilities';
import Logo from '../../../static/images/normal/logo-white.svg';

class Menu extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      mobileMenuOpen: false
    };

    this.handleHide = this.handleHide.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleHide () {
    this.updateState({ mobileMenuOpen: false });
  }

  handleToggle () {
    this.updateState({ mobileMenuOpen: !this.state.mobileMenuOpen });
  }

  render () {
    return (
      <React.Fragment>
        <nav className={'menu' + (this.state.mobileMenuOpen ? ' mobile-visible' : '')}>
          <Link to='/' className='menu-logo'>
            <img src={Logo} alt='HS-Analyzer' />
            <p className='menu-logo-version'>v0.3.3</p>
          </Link>
          <ul>
            <li>
              <MenuLink to='/' onClick={this.handleHide}>General info</MenuLink>
            </li>
            <li>
              <MenuLink to='/chain-variables' onClick={this.handleHide}>Chain Variables</MenuLink>
            </li>
            <li className={(Number.isInteger(this.props.currentHS) && this.props.currentHS >= 0) ? '' : 'disabled'}>
              <MenuLink to='/activity' onClick={this.handleHide}>Latest activity</MenuLink>
            </li>
            <li className={(Number.isInteger(this.props.currentHS) && this.props.currentHS >= 0) ? '' : 'disabled'}>
              <MenuLink to='/rssi' onClick={this.handleHide}>RSSI / Beacon Analysis</MenuLink>
            </li>
            <li className={(Number.isInteger(this.props.currentHS) && this.props.currentHS >= 0) ? '' : 'disabled'}>
              <MenuLink to='/snr' onClick={this.handleHide}>SNR Data</MenuLink>
            </li>
            <li className={(Number.isInteger(this.props.currentHS) && this.props.currentHS >= 0) ? '' : 'disabled'}>
              <MenuLink to='/city' onClick={this.handleHide}>Your city</MenuLink>
            </li>
            <li className={(Number.isInteger(this.props.currentHS) && this.props.currentHS >= 0) ? '' : 'disabled'}>
              <MenuLink to='/connectivity' onClick={this.handleHide}>Connectivity</MenuLink>
            </li>
            <li>
              <MenuLink to='/donate' onClick={this.handleHide}>Donate</MenuLink>
            </li>
            {/* <li> */}
            {/*  <a href='https://github.com/GrzegorzZajac000/hs-analyzer' target='_blank' rel='noreferrer noopener'>GitHub <WindowPlus size={18} /></a> */}
            {/* </li> */}
          </ul>
        </nav>

        <button className='menu-toggle' onClick={this.handleToggle}>
          <List color='#fff' size={32} />
        </button>
      </React.Fragment>
    );
  }
}

Menu.propTypes = {
  currentHS: PropTypes.number
};

export default Menu;
