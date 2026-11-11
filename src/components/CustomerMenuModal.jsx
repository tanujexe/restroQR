import React, { useState } from 'react';
import { X, Smartphone, Utensils, Coffee, ShoppingBag, CheckCircle2, ChevronRight } from 'lucide-react';

const SAMPLE_MENU = [
  { id: 1, name: 'Espresso Romano', category: 'Coffee', price: 3.50, desc: 'Double espresso served with a fresh twist of lemon peel.' },
  { id: 2, name: 'Vanilla Bean Oat Latte', category: 'Coffee', price: 5.25, desc: 'House-made Madagascar vanilla syrup with silky steamed oat milk.' },
  { id: 3, name: 'Avocado Tartine', category: 'Food', price: 9.50, desc: 'Sourdough toast, smashed avocado, chili flakes, poached egg.' },
  { id: 4, name: 'Truffle Mushroom Panini', category: 'Food', price: 11.00, desc: 'Roasted wild mushrooms, fontina cheese, arugula, truffle aioli.' },
  { id: 5, name: 'Almond Croissant', category: 'Bakery', price: 4.75, desc: 'Twice-baked butter croissant filled with rich almond frangipane.' },
];

export default function CustomerMenuModal({
  isOpen,
  onClose,
  tableLabel,
  config,
  onOrderSubmit,
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isOpen) return null;

  const categories = ['All', 'Coffee', 'Food', 'Bakery'];
  const filteredItems = selectedCategory === 'All'
    ? SAMPLE_MENU
    : SAMPLE_MENU.filter((item) => item.category === selectedCategory);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePlaceOrder = () => {
    if (onOrderSubmit) {
      onOrderSubmit({
        id: Date.now(),
        table: `${config.tablePrefix} ${tableLabel}`,
        items: [...cart],
        total: cartTotal,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
    }
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      setCart([]);
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="phone-modal-wrapper" onClick={(e) => e.stopPropagation()}>
        <button className="btn-close-modal" onClick={onClose} title="Close Preview">
          <X size={20} />
        </button>

        {/* Realistic Mobile Frame */}
        <div className="mobile-frame">
          <div className="mobile-notch">
            <span className="notch-speaker"></span>
            <span className="notch-camera"></span>
          </div>

          <div className="mobile-screen">
            {/* Mobile Header */}
            <div className="mobile-top-bar" style={{ backgroundColor: config.primaryColor }}>
              <div className="mobile-restaurant-meta">
                <span className="mobile-app-label">DIGITAL MENU & ORDER</span>
                <h4 className="mobile-restaurant-title">{config.restaurantName || 'Cafe Menu'}</h4>
                <div className="mobile-table-tag">
                  📍 {config.tablePrefix} {tableLabel}
                </div>
              </div>
            </div>

            {orderPlaced ? (
              <div className="order-success-screen">
                <CheckCircle2 size={56} color="#10b981" />
                <h3>Order Received!</h3>
                <p>
                  Sent to the kitchen for <strong>{config.tablePrefix} {tableLabel}</strong>.
                </p>
                <span className="sub-hint">Your server will deliver it shortly.</span>
              </div>
            ) : (
              <>
                {/* Category Pills */}
                <div className="mobile-categories">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`mobile-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                      style={selectedCategory === cat ? { backgroundColor: config.primaryColor } : {}}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Items List */}
                <div className="mobile-items-list">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="mobile-item-card">
                      <div className="item-text">
                        <h5>{item.name}</h5>
                        <p className="item-desc">{item.desc}</p>
                        <span className="item-price">${item.price.toFixed(2)}</span>
                      </div>
                      <button
                        className="btn-add-item"
                        style={{ color: config.primaryColor, borderColor: config.primaryColor }}
                        onClick={() => addToCart(item)}
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>

                {/* Floating Cart / Order Bar */}
                {cart.length > 0 && (
                  <div className="mobile-bottom-cart">
                    <div className="cart-summary">
                      <ShoppingBag size={18} />
                      <span>{cart.length} item{cart.length > 1 ? 's' : ''} • ${cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                      className="btn-checkout"
                      style={{ backgroundColor: config.primaryColor }}
                      onClick={handlePlaceOrder}
                    >
                      <span>Send to Kitchen</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

