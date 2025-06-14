import React from 'react';
import './ProductCard.css';
import { useCart } from '../context/CartContext';


interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  origin: 'Brasil' | 'Europa';
}

type ProductCardProps = {
  product: Product;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart(); 
   return (
    <div className="product-card glassmorphism-card">
      <img src={product.imageUrl} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">R$ {product.price.toFixed(2)}</p>
        <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};