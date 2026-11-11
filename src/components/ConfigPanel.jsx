import React from 'react';
import {
  Store,
  Layers,
  Palette,
  Wifi,
  Sparkles,
  Link as LinkIcon,
  HelpCircle
} from 'lucide-react';

const COLOR_PRESETS = [
  { name: 'Warm Amber', color: '#d97706' },
  { name: 'Burgundy Red', color: '#be123c' },
  { name: 'Forest Emerald', color: '#047857' },
  { name: 'Royal Indigo', color: '#4338ca' },
  { name: 'Midnight Charcoal', color: '#1e293b' },
  { name: 'Espresso Brown', color: '#78350f' },
];

export default function ConfigPanel({
  config,
  onChange,
  onResetSampleData,
}) {
  const updateField = (key, value) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <aside className="config-sidebar no-print">
      <div className="sidebar-header">
        <h2>Configuration</h2>
        <button
          type="button"
          className="btn-sample"
          onClick={onResetSampleData}
          title="Load Sample Cafe Data"
        >
          <Sparkles size={14} /> Sample Data
        </button>
      </div>

      <div className="sidebar-sections">
        {/* Section 1: Restaurant Info */}
        <section className="config-group">
          <div className="group-title">
            <Store size={18} />
            <span>Restaurant Details</span>
          </div>

          <div className="form-field">
            <label>Business / Cafe Name</label>
            <input
              type="text"
              value={config.restaurantName}
              placeholder="e.g. The Rustic Bean Cafe"
              onChange={(e) => updateField('restaurantName', e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Tagline / Subtitle</label>
            <input
              type="text"
              value={config.tagline}
              placeholder="e.g. Artisan Coffee & Kitchen"
              onChange={(e) => updateField('tagline', e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>
              Base Menu URL
              <span className="info-tooltip" title="The URL where your digital menu or ordering system lives">
                <HelpCircle size={13} />
              </span>
            </label>
            <div className="input-with-icon">
              <LinkIcon size={14} className="input-icon" />
              <input
                type="text"
                value={config.menuUrl}
                placeholder="https://yourcafe.com/menu"
                onChange={(e) => updateField('menuUrl', e.target.value)}
              />
            </div>
            <span className="field-hint">e.g. https://mycafe.com/menu</span>
          </div>

          <div className="form-field">
            <label>URL Parameter Name</label>
            <input
              type="text"
              value={config.paramName}
              placeholder="table"
              onChange={(e) => updateField('paramName', e.target.value)}
            />
            <span className="field-hint">Generates: ?{config.paramName || 'table'}=4</span>
          </div>
        </section>

        {/* Section 2: Table Generation */}
        <section className="config-group">
          <div className="group-title">
            <Layers size={18} />
            <span>Tables Setup</span>
          </div>

          <div className="segmented-control">
            <button
              type="button"
              className={config.tableMode === 'range' ? 'active' : ''}
              onClick={() => updateField('tableMode', 'range')}
            >
              Number Range
            </button>
            <button
              type="button"
              className={config.tableMode === 'custom' ? 'active' : ''}
              onClick={() => updateField('tableMode', 'custom')}
            >
              Custom Names
            </button>
          </div>

          {config.tableMode === 'range' ? (
            <>
              <div className="form-row">
                <div className="form-field">
                  <label>Prefix</label>
                  <input
                    type="text"
                    value={config.tablePrefix}
                    placeholder="Table"
                    onChange={(e) => updateField('tablePrefix', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>Start #</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={config.startTable}
                    onChange={(e) => updateField('startTable', Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
                <div className="form-field">
                  <label>End #</label>
                  <input
                    type="number"
                    min={config.startTable}
                    max="100"
                    value={config.endTable}
                    onChange={(e) => updateField('endTable', Math.max(config.startTable, parseInt(e.target.value) || config.startTable))}
                  />
                </div>
              </div>
              <span className="field-hint">
                Will create {Math.max(0, config.endTable - config.startTable + 1)} table cards ({config.tablePrefix} {config.startTable} to {config.endTable})
              </span>
            </>
          ) : (
            <div className="form-field">
              <label>Custom Table Names (comma-separated)</label>
              <textarea
                rows="3"
                value={config.customTables}
                placeholder="1, 2, 3, VIP-1, Patio-A, Bar-1"
                onChange={(e) => updateField('customTables', e.target.value)}
              />
              <span className="field-hint">Separate labels with commas</span>
            </div>
          )}
        </section>

        {/* Section 3: Branding & Card Theme */}
        <section className="config-group">
          <div className="group-title">
            <Palette size={18} />
            <span>Theme & Branding</span>
          </div>

          <div className="form-field">
            <label>Card Theme</label>
            <div className="theme-grid">
              {[
                { id: 'modern', name: 'Modern' },
                { id: 'dark', name: 'Luxury Dark' },
                { id: 'kraft', name: 'Rustic Kraft' },
                { id: 'minimal', name: 'Minimalist' },
              ].map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  className={`theme-pill ${config.cardTheme === theme.id ? 'active' : ''}`}
                  onClick={() => updateField('cardTheme', theme.id)}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label>Brand Accent Color</label>
            <div className="color-picker-row">
              <input
                type="color"
                className="color-input"
                value={config.primaryColor}
                onChange={(e) => updateField('primaryColor', e.target.value)}
              />
              <span className="color-hex">{config.primaryColor}</span>
            </div>

            <div className="color-presets">
              {COLOR_PRESETS.map((p) => (
                <button
                  key={p.color}
                  type="button"
                  className="preset-swatch"
                  style={{ backgroundColor: p.color }}
                  title={p.name}
                  onClick={() => updateField('primaryColor', p.color)}
                />
              ))}
            </div>
          </div>

          <div className="form-field">
            <label>Card Instructions Text</label>
            <input
              type="text"
              value={config.instructions}
              placeholder="Scan with phone camera to view menu"
              onChange={(e) => updateField('instructions', e.target.value)}
            />
          </div>
        </section>

        {/* Section 4: Wi-Fi Credentials */}
        <section className="config-group">
          <div className="group-title">
            <Wifi size={18} />
            <span>Table Wi-Fi Badge</span>
          </div>

          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={config.includeWifi}
              onChange={(e) => updateField('includeWifi', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Print Wi-Fi info on card</span>
          </label>

          {config.includeWifi && (
            <>
              <div className="form-field" style={{ marginTop: '0.75rem' }}>
                <label>Wi-Fi Network (SSID)</label>
                <input
                  type="text"
                  value={config.wifiName}
                  placeholder="e.g. RusticBean_Guest"
                  onChange={(e) => updateField('wifiName', e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Wi-Fi Password (Optional)</label>
                <input
                  type="text"
                  value={config.wifiPass}
                  placeholder="e.g. coffee123"
                  onChange={(e) => updateField('wifiPass', e.target.value)}
                />
              </div>
            </>
          )}
        </section>
      </div>
    </aside>
  );
}

