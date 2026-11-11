import React from 'react';
import { QrCode, Printer, Eye, Grid, ChefHat } from 'lucide-react';

export default function Header({
  tableCount,
  orderCount = 0,
  viewMode,
  setViewMode,
  onPrint,
}) {
  return (
    <header className="app-header no-print">
      <div className="header-left">
        <div className="app-logo">
          <QrCode size={24} />
        </div>
        <div>
          <h1 className="app-title">QRMenu Studio</h1>
          <p className="app-subtitle">Restaurant Table QR & Stand Generator</p>
        </div>
      </div>

      <div className="header-right">
        {/* View Switcher */}
        <div className="segmented-control mini">
          <button
            type="button"
            className={viewMode === 'grid' ? 'active' : ''}
            onClick={() => setViewMode('grid')}
            title="Grid View (All Tables)"
          >
            <Grid size={15} />
            <span>Grid ({tableCount})</span>
          </button>
          <button
            type="button"
            className={viewMode === 'mockup' ? 'active' : ''}
            onClick={() => setViewMode('mockup')}
            title="Table Stand Realistic Preview"
          >
            <Eye size={15} />
            <span>Mockup</span>
          </button>
          <button
            type="button"
            className={viewMode === 'kitchen' ? 'active' : ''}
            onClick={() => setViewMode('kitchen')}
            title="Live Kitchen Orders Display"
          >
            <ChefHat size={15} />
            <span>Kitchen Orders {orderCount > 0 && <span className="order-pill-badge">{orderCount}</span>}</span>
          </button>
        </div>

        {/* Print Button */}
        <button
          type="button"
          className="btn-print"
          onClick={onPrint}
        >
          <Printer size={16} />
          <span>Print Stands</span>
        </button>
      </div>
    </header>
  );
}

