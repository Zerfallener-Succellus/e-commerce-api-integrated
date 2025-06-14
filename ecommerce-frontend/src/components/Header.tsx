import React, { useState } from 'react';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import './Header.css';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export interface Filters {
  search?: string;
  origin?: 'Brasil' | 'Europa' | '';
  minPrice?: number;
  maxPrice?: number;
}

type HeaderProps = {
  onSearch: (searchTerm: string) => void;
};

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    setShowSearch(false);
  };

  return (
    <header className="app-header glassmorphism-card">
      <div className="header-left">
        <FiSearch 
          size={24} 
          onClick={() => setShowSearch(true)} 
          className={`header-icon ${showSearch ? 'hidden' : ''}`} 
        />
        <form onSubmit={handleSearch} className={`search-form ${showSearch ? 'visible' : ''}`}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar produtos..."
            className="search-input"
            autoFocus
          />
          <button type="submit" className="search-button">
            <FiSearch size={20} />
          </button>
        </form>
      </div>
      <Link to="/" className="header-title-link">
        <h1 className="header-title">DevCommerce</h1>
      </Link>
      <div className="header-right">
        <Link to="/cart" className="cart-icon-wrapper">
          <FiShoppingCart size={24} className="header-icon" />
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </Link>
      </div>
    </header>
  );
};