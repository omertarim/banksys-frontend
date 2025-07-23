import React from 'react';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-logo">BankSys</div>
      <ul className="navbar-menu">
        <li>Mevduat</li>
        <li>Yatırım</li>
        <li>Krediler</li>
        <li>Kartlar</li>
        <li>Dijital Bankacılık</li>
        <li>Sigorta</li>
        <li>Ödemeler</li>
      </ul>
      <div className="navbar-actions">
        <button className="btn-outline" onClick={() => navigate('/login-customer')}>Giriş Yap</button>
        <button className="btn-primary" onClick={() => navigate('/register-customer')}>Müşteri Ol</button>
      </div>
    </nav>
  );
};

export default NavBar; 