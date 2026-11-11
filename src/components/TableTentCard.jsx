import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { Utensils, Wifi, Download, Copy, Check, ExternalLink, Smartphone } from 'lucide-react';
import { buildTableUrl, downloadCardAsPng, downloadCardAsSvg } from '../utils/qrHelper';

export default function TableTentCard({
  table,
  config,
  standaloneMockup = false,
  onSimulateScan,
}) {
  const [copied, setCopied] = useState(false);
  const cardId = `table-card-${table.id}`;
  const targetUrl = buildTableUrl(config.menuUrl, config.paramName, table.label);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`table-tent-container ${standaloneMockup ? 'mockup-view' : ''}`}>
      {/* Printable Card */}
      <div
        id={cardId}
        className={`table-tent-card theme-${config.cardTheme}`}
        style={{
          '--primary-color': config.primaryColor,
        }}
      >
        <div className="card-fold-marker top">
          <span className="fold-text">✂️ Fold or Cut Line</span>
        </div>

        <div className="card-content">
          {/* Brand Header */}
          <div className="brand-header">
            <div className="brand-icon-wrapper" style={{ backgroundColor: `${config.primaryColor}18`, color: config.primaryColor }}>
              <Utensils size={20} />
            </div>
            <h3 className="restaurant-name">{config.restaurantName || 'Restaurant Name'}</h3>
            {config.tagline && <p className="tagline">{config.tagline}</p>}
          </div>

          <div className="card-divider" />

          {/* Table Number Badge */}
          <div className="table-badge-wrapper">
            <span className="table-badge" style={{ borderColor: config.primaryColor, color: config.primaryColor }}>
              {config.tablePrefix} {table.label}
            </span>
          </div>

          {/* QR Code Container */}
          <div className="qr-box">
            <div className="qr-wrapper">
              <QRCode
                value={targetUrl}
                size={160}
                level="M"
                fgColor={config.cardTheme === 'dark' ? '#0f172a' : config.primaryColor}
                bgColor="#ffffff"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="instruction-section">
            <p className="instruction-text">{config.instructions}</p>
          </div>

          {/* Optional Wi-Fi Details */}
          {config.includeWifi && (
            <div className="wifi-badge">
              <div className="wifi-header">
                <Wifi size={14} className="wifi-icon" />
                <span>Free Guest Wi-Fi</span>
              </div>
              <div className="wifi-details">
                <span><strong>Network:</strong> {config.wifiName || 'Guest-WiFi'}</span>
                {config.wifiPass && <span><strong>Pass:</strong> {config.wifiPass}</span>}
              </div>
            </div>
          )}

          {/* URL Tag preview */}
          <div className="url-preview-tag">
            <span>{targetUrl}</span>
          </div>
        </div>

        <div className="card-fold-marker bottom">
          <span className="fold-text">✂️ Fold or Cut Line</span>
        </div>
      </div>

      {/* Non-Printable Action Bar */}
      <div className="card-actions no-print">
        {onSimulateScan && (
          <button
            className="btn-action highlight"
            title="Simulate scanning this QR code as a customer"
            onClick={() => onSimulateScan(table.label)}
          >
            <Smartphone size={15} /> Test Scan
          </button>
        )}
        <button
          className="btn-action"
          title="Download PNG QR code"
          onClick={() => downloadCardAsPng(cardId, `${config.restaurantName || 'restaurant'}-table-${table.label}.png`)}
        >
          <Download size={15} /> PNG
        </button>
        <button
          className="btn-action"
          title="Download SVG QR code"
          onClick={() => downloadCardAsSvg(cardId, `${config.restaurantName || 'restaurant'}-table-${table.label}.svg`)}
        >
          SVG
        </button>
        <button
          className="btn-action"
          title="Copy Link"
          onClick={handleCopyLink}
        >
          {copied ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
        </button>
      </div>
    </div>
  );
}

