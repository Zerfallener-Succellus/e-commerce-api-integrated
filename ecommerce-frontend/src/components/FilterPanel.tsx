import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import './FilterPanel.css';
import type { Filters } from './Header';

type FilterPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Filters) => void;
};

export const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [origin, setOrigin] = useState<'Brasil' | 'Europa' | ''>('');

  const handleApply = () => {
    onApplyFilters({
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      origin: origin,
    });
    onClose();
  };

  return (
    <>
      <div className={`filter-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`filter-panel glassmorphism-card ${isOpen ? 'open' : ''}`}>
        <div className="panel-header">
          <h2>Filtrar e Organizar</h2>
          <FiX size={24} onClick={onClose} className="close-icon" />
        </div>
        <div className="filter-group">
          <label>Origem</label>
          <select value={origin} onChange={(e) => setOrigin(e.target.value as 'Brasil' | 'Europa' | '')}>
            <option value="">Todas</option>
            <option value="Brasil">Brasil</option>
            <option value="Europa">Europa</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Preço</label>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Mínimo"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Máximo"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
        <button className="apply-filters-btn" onClick={handleApply}>
          Aplicar Filtros
        </button>
      </div>
    </>
  );
};