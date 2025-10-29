import React, { useState } from 'react';
import { getAugmentationMethods } from '../data/newMockData';

const RightPanel = ({ activeAugmentations, onToggleAugmentation, hasData }) => {
  const methods = getAugmentationMethods();

  // State for download counts
  const [downloadCounts, setDownloadCounts] = useState({
    vae: 100,
    tcn: 100,
    gan: 100,
    diffusion: 100
  });

  const handleCountChange = (methodId, value) => {
    setDownloadCounts({
      ...downloadCounts,
      [methodId]: Math.max(1, parseInt(value) || 1)
    });
  };

  const handleDownload = (methodId) => {
    const method = methods.find(m => m.id === methodId);
    const count = downloadCounts[methodId];

    // Create CSV content (currently empty as requested)
    const csvContent = `Method: ${method.name}\nCount: ${count}\n\n(Data will be generated here)`;

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${method.name}_augmented_${count}_samples.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="panel right-panel">
      <h3 className="panel-title">Data Augmentation</h3>

      <div className="panel-content">
        <p className="panel-description">
          Click buttons to overlay augmented data on the middle chart.
          Compare how each method generates data similar to the original.
        </p>

        <div className="augmentation-buttons">
          {methods.map(method => {
            const isActive = activeAugmentations.includes(method.id);

            return (
              <button
                key={method.id}
                className={`aug-btn ${isActive ? 'active' : ''}`}
                onClick={() => onToggleAugmentation(method.id)}
                disabled={!hasData}
                style={{
                  '--method-color': method.color,
                  '--method-color-light': method.color.replace('rgb', 'rgba').replace(')', ', 0.1)')
                }}
              >
                <span className="aug-icon">{isActive ? '✓' : '+'}</span>
                <span className="aug-name">{method.name}</span>
                <div
                  className="aug-indicator"
                  style={{ backgroundColor: method.color }}
                />
              </button>
            );
          })}
        </div>

        {/* Method Descriptions */}
        <div className="method-descriptions">
          <h4 className="desc-title">Method Overview:</h4>
          <div className="desc-list">
            <div className="desc-item">
              <span className="desc-name" style={{ color: methods[0].color }}>VAE:</span>
              <span className="desc-text">Variational Autoencoder - Smooth reconstruction</span>
            </div>
            <div className="desc-item">
              <span className="desc-name" style={{ color: methods[1].color }}>TCN:</span>
              <span className="desc-text">Temporal Conv Network - Preserves temporal structure</span>
            </div>
            <div className="desc-item">
              <span className="desc-name" style={{ color: methods[2].color }}>GAN:</span>
              <span className="desc-text">Generative Adversarial Network - Enhanced features</span>
            </div>
            <div className="desc-item">
              <span className="desc-name" style={{ color: methods[3].color }}>Diffusion:</span>
              <span className="desc-text">Diffusion Model - Gradual denoising process</span>
            </div>
          </div>
        </div>

        {/* Data Download Section */}
        <div className="download-section">
          <h4 className="download-title">Download Augmented Data</h4>
          <p className="download-desc">
            Click a method button above to activate it, then set the number of samples and download.
          </p>

          <div className="download-items">
            {methods.map(method => {
              const isActive = activeAugmentations.includes(method.id);

              return (
                <div key={method.id} className="download-item">
                  <div className="download-item-header">
                    <span
                      className="download-method-name"
                      style={{ color: isActive ? method.color : '#999' }}
                    >
                      {method.name}
                    </span>
                    {isActive && <span className="download-active-badge">Active</span>}
                  </div>

                  {isActive && (
                    <div className="download-controls">
                      <input
                        type="number"
                        className="download-count-input"
                        value={downloadCounts[method.id]}
                        onChange={(e) => handleCountChange(method.id, e.target.value)}
                        min="1"
                        max="10000"
                        placeholder="Count"
                      />
                      <button
                        className="download-btn"
                        onClick={() => handleDownload(method.id)}
                        style={{ backgroundColor: method.color }}
                      >
                        Download CSV
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
