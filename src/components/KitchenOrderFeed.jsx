import React from 'react';
import { ChefHat, CheckCircle2, Clock, Trash2, Smartphone } from 'lucide-react';

export default function KitchenOrderFeed({
  orders,
  onCompleteOrder,
  onClearAll,
}) {
  return (
    <div className="kitchen-feed-container no-print">
      <div className="kitchen-feed-header">
        <div className="k-header-left">
          <div className="chef-icon-box">
            <ChefHat size={22} />
          </div>
          <div>
            <h3>Live Kitchen Display Screen (KDS)</h3>
            <p>Orders placed via table QR codes automatically appear here in real time.</p>
          </div>
        </div>

        {orders.length > 0 && (
          <button className="btn-clear-orders" onClick={onClearAll}>
            <Trash2 size={14} /> Clear All
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="kitchen-empty-state">
          <div className="empty-bubble">
            <ChefHat size={48} color="#94a3b8" />
          </div>
          <h4>No incoming orders right now</h4>
          <p>
            Go back to the <strong>Grid View</strong> and click <strong>"Test Scan"</strong> on any table (e.g. Table 3 or 4) to place a test order!
          </p>
        </div>
      ) : (
        <div className="kitchen-tickets-grid">
          {orders.map((order) => (
            <div key={order.id} className="kitchen-ticket">
              <div className="ticket-header">
                <span className="ticket-table-badge">{order.table}</span>
                <span className="ticket-time">
                  <Clock size={12} /> {order.time}
                </span>
              </div>

              <div className="ticket-items">
                {order.items.map((item, idx) => (
                  <div key={`${order.id}-${idx}`} className="ticket-item-row">
                    <span className="item-qty">1x</span>
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="ticket-footer">
                <div className="ticket-total">
                  <span>Total:</span>
                  <strong>${order.total.toFixed(2)}</strong>
                </div>
                <button
                  className="btn-ticket-ready"
                  onClick={() => onCompleteOrder(order.id)}
                >
                  <CheckCircle2 size={15} /> Ready to Serve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

