

import React, { useEffect, useState, useCallback } from 'react';
import { Header, type Filters } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { FilterPanel } from '../components/FilterPanel';
import { FiFilter } from 'react-icons/fi';
import api from '../services/api';
import '../styles/HomePage.css';


interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  origin: 'Brasil' | 'Europa';
}

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');

  const fetchProducts = useCallback(async (filters: Filters = {}) => {
    setLoading(true);
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== '' && value != null && value !== undefined)
    );

    try {
      const response = await api.get('/products', {
        params: activeFilters,
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Falha ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (searchTerm: string) => {
    setHasSearched(true);
    setCurrentSearch(searchTerm);
    fetchProducts({ search: searchTerm });
  };

  const handleApplyFilters = (filters: Filters) => {
    fetchProducts({ ...filters, search: currentSearch });
  };

  return (
    <div className="homepage-container">
      <Header onSearch={handleSearch} />

      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      {hasSearched && products.length > 0 && (
        <div className="filter-button-container">
          <button 
            className="filter-button glassmorphism-card"
            onClick={() => setIsFilterPanelOpen(true)}
          >
            <FiFilter size={20} />
            <span>Filtrar Resultados</span>
          </button>
        </div>
      )}

      <main className="product-grid">
        {loading ? (
          <p>Carregando produtos...</p>
        ) : products.length === 0 ? (
          <p>Nenhum produto encontrado</p>
        ) : (
          products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
            />
          ))
        )}
      </main>
    </div>
  );
};