import * as React from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import PropTypes from 'prop-types';

function MenuLink ({ children, to, ...props }) {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <div>
      <Link className={(match ? 'active' : '')} to={to} {...props}>
        {children}
      </Link>
    </div>
  );
}

MenuLink.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  to: PropTypes.string
};

export default MenuLink;
