import React from 'react';
import '../styles/NoMatch.scss';
import { useNavigate } from 'react-router';
import { EmojiSmile } from 'react-bootstrap-icons';

function NoMatch () {
  const navigate = useNavigate();

  return (
    <section className='no-match route-section'>
      <h1>404</h1>
      <h2>Something's missing</h2>
      <h3>Don't cry <EmojiSmile size={14} /></h3>

      <button type='button' className='btn btn-decor btn-lg' onClick={() => navigate((-1))}>Go back</button>
    </section>
  );
}

export default NoMatch;
