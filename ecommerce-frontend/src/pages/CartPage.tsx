import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Header } from '../components/Header';
import { FiTrash2 } from 'react-icons/fi';
import '../styles/CartPage.css';
import api from '../services/api';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderSuccess {
  id: string;
  createdAt: string;
  total: number;
  items: OrderItem[];
}

export const CartPage: React.FC = () => {
  const { cartItems, clearCart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const [orderSuccess, setOrderSuccess] = useState<OrderSuccess | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemoveItem = (itemId: string) => {
    setRemovingItemId(itemId);
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovingItemId(null);
    }, 300); // Tempo da animação
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    setOrderSuccess(null);

    const orderItemsPayload = cartItems.map(item => ({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    try {
      const response = await api.post<OrderSuccess>('/orders', {
        items: orderItemsPayload,
      });
      setOrderSuccess(response.data);
      clearCart();
    } catch (err) {
      console.error('Erro ao finalizar pedido:', err);
      setError('Falha ao finalizar o pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page-container">
      <Header onSearch={() => {}} />

      <div className="cart-card glassmorphism-card">
        <div className="cart-header">
          <h2>Seu Carrinho</h2>
        </div>

        {cartItems.length === 0 && !orderSuccess ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <div className="cart-item-list">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className={`cart-item glassmorphism-card ${removingItemId === item.id ? 'removing' : ''}`}
              >
                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>Preço: R$ {item.price.toFixed(2).replace('.', ',')}</p>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn" 
                      onClick={() => decreaseQuantity(item.id)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="item-quantity-display">{item.quantity}</span>
                    <button 
                      className="quantity-btn" 
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button 
                  className="remove-item-btn" 
                  onClick={() => handleRemoveItem(item.id)}
                  aria-label={`Remover ${item.name} do carrinho`}
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <span>Total:</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
        )}

        {cartItems.length > 0 && !loading && !orderSuccess && (
          <button 
            className="checkout-button"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Finalizando...' : 'Finalizar Pedido'}
          </button>
        )}

        {error && <p className="error-message">{error}</p>}

        {orderSuccess && (
          <div className="order-success-message">
            <p>Pedido feito com sucesso!</p>
            <p>Código: <strong>{orderSuccess.id}</strong></p>
            <p>Total: R$ {orderSuccess.total.toFixed(2).replace('.', ',')}</p>
          </div>
        )}
      </div>
    </div>
  );
}; 