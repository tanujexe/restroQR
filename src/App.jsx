import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ConfigPanel from './components/ConfigPanel';
import TableTentCard from './components/TableTentCard';
import CustomerMenuModal from './components/CustomerMenuModal';
import KitchenOrderFeed from './components/KitchenOrderFeed';
import { Coffee, Info, Printer, Sparkles } from 'lucide-react';
import './App.css';

const DEFAULT_CONFIG = {
  restaurantName: 'The Rustic Bean Cafe',
  tagline: 'Artisan Coffee & Kitchen',
  menuUrl: 'https://rusticbean.com/menu',
  paramName: 'table',
  tableMode: 'range',
  tablePrefix: 'Table',
  startTable: 1,
  endTable: 6,
  customTables: '1, 2, 3, VIP-1, Patio-A, Bar-1',
  cardTheme: 'modern',
  primaryColor: '#d97706',
  instructions: 'Scan with phone camera to view menu & order',
  includeWifi: true,
  wifiName: 'RusticBean_Guest',
  wifiPass: 'coffeetime',
};

export default function App() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'mockup' | 'kitchen'
  const [selectedMockupIndex, setSelectedMockupIndex] = useState(0);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [scannedTableLabel, setScannedTableLabel] = useState('1');
  const [orders, setOrders] = useState([
    {
      id: 1,
      table: 'Table 2',
      items: [
        { name: 'Vanilla Bean Oat Latte', price: 5.25 },
        { name: 'Almond Croissant', price: 4.75 },
      ],
      total: 10.00,
      time: '10:45 PM',
    },
  ]);

  const handleSimulateScan = (label) => {
    setScannedTableLabel(label);
    setScanModalOpen(true);
  };

  const handleOrderSubmit = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Switch to kitchen view so owner immediately sees the incoming order!
    setViewMode('kitchen');
  };

  const handleCompleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleClearAllOrders = () => {
    setOrders([]);
  };

  // Compute table list based on range or custom names
  const tableList = useMemo(() => {
    if (config.tableMode === 'range') {
      const list = [];
      const start = Math.max(1, parseInt(config.startTable) || 1);
      const end = Math.max(start, parseInt(config.endTable) || start);
      for (let i = start; i <= end; i++) {
        list.push({ id: `range-${i}`, label: `${i}` });
      }
      return list;
    } else {
      const parts = (config.customTables || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      return parts.map((label, idx) => ({ id: `custom-${idx}-${label}`, label }));
    }
  }, [config.tableMode, config.startTable, config.endTable, config.customTables]);

  const handleResetSampleData = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const handlePrint = () => {
    window.print();
  };

  const activeMockupTable = tableList[selectedMockupIndex] || tableList[0] || { id: '0', label: '1' };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Header
        tableCount={tableList.length}
        orderCount={orders.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onPrint={handlePrint}
      />

      {/* Main App Body */}
      <div className="app-body">
        {/* Left Sidebar Configuration */}
        <ConfigPanel
          config={config}
          onChange={setConfig}
          onResetSampleData={handleResetSampleData}
        />

        {/* Right Main Preview Area */}
        <main className="preview-area">
          {/* Informative Banner */}
          <div className="preview-top-bar no-print">
            <div className="bar-info">
              <span className="badge-live">LIVE PREVIEW</span>
              <span>
                Generated <strong>{tableList.length}</strong> table cards for{' '}
                <em>{config.restaurantName || 'Restaurant'}</em>
              </span>
            </div>
            <div className="bar-actions">
              <span className="print-hint">
                <Printer size={14} /> Tip: Click <strong>Print Stands</strong> to preview A4/Letter print sheets with cut lines.
              </span>
            </div>
          </div>

          {/* Mode 1: All Cards Grid */}
          {viewMode === 'grid' && (
            <div className="cards-grid">
              {tableList.length === 0 ? (
                <div className="empty-state">
                  <Coffee size={40} />
                  <p>No tables configured. Please enter a valid number range or custom names in the sidebar.</p>
                </div>
              ) : (
                tableList.map((table) => (
                  <TableTentCard
                    key={table.id}
                    table={table}
                    config={config}
                    onSimulateScan={handleSimulateScan}
                  />
                ))
              )}
            </div>
          )}

          {/* Mode 2: Realistic Table Stand Mockup */}
          {viewMode === 'mockup' && (
            <div className="mockup-stage-wrapper no-print">
              <div className="mockup-controls">
                <label>Select Table to Preview Stand:</label>
                <select
                  value={selectedMockupIndex}
                  onChange={(e) => setSelectedMockupIndex(Number(e.target.value))}
                >
                  {tableList.map((t, idx) => (
                    <option key={t.id} value={idx}>
                      {config.tablePrefix} {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3D Realistic Table Surface & Stand */}
              <div className="wooden-table-surface">
                <div className="acrylic-stand-base">
                  <TableTentCard
                    table={activeMockupTable}
                    config={config}
                    standaloneMockup={true}
                    onSimulateScan={handleSimulateScan}
                  />
                </div>
              </div>

              <div className="mockup-footnote">
                <Info size={14} />
                <span>Simulating an acrylic table tent stand on a cafe dining table.</span>
              </div>
            </div>
          )}

          {/* Mode 3: Live Kitchen Orders Feed */}
          {viewMode === 'kitchen' && (
            <KitchenOrderFeed
              orders={orders}
              onCompleteOrder={handleCompleteOrder}
              onClearAll={handleClearAllOrders}
            />
          )}
        </main>
      </div>

      {/* Customer Mobile Order Simulator Modal */}
      <CustomerMenuModal
        isOpen={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
        tableLabel={scannedTableLabel}
        config={config}
        onOrderSubmit={handleOrderSubmit}
      />

      {/* Printable Sheet View - Only visible when printing (Ctrl+P / window.print()) */}
      <div className="print-sheet-container print-only">
        <div className="print-page-header">
          <h2>{config.restaurantName} - Digital Menu QR Table Stands</h2>
          <p>Cut along the dashed lines and place in acrylic table holders or fold as tent cards.</p>
        </div>
        <div className="print-grid">
          {tableList.map((table) => (
            <TableTentCard
              key={`print-${table.id}`}
              table={table}
              config={config}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
