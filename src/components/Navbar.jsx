import React from 'react'
import { Link } from 'react-router-dom';
const Navbar = () => {

  return (
    <div>
    <nav className="navbar">
      <div className="logo">Operational Research</div>
      <ul className='nav-links'>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='about'>About</Link>
        </li>
      </ul>
    </nav>
    </div>
  );
}

export default Navbar
