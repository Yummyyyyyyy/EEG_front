import { useState } from 'react';
import { getAugmentationMethods } from '../data/newMockData';
import { downloadAugmentationData } from '../utils/eegApi';

const DownloadSection = ({ selectedMotionType }) => {
  const methods = getAugmentationMethods();
  const motionTypes = [
    { id: 'left', name: '👈 Left Hand' },
    { id: 'right', name: '👉 Right Hand' },
    { id: 'foot', name: '🦶 Feet' },
    { id: 'tongue', name: '👅 Tongue' }
  ];

  const [selectedDataTypes, setSelectedDataTypes] = useState([]);
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [dataCount, setDataCount] = useState(100);
  const [fileType, setFileType] = useState('npz');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDataTypeToggle = (typeId) => {
    if (selectedDataTypes.includes(typeId)) {
      setSelectedDataTypes(selectedDataTypes.filter(id => id !== typeId));
    } else {
      setSelectedDataTypes([...selectedDataTypes, typeId]);
    }
  };

  const handleMethodToggle = (methodId) => {
    if (selectedMethods.includes(methodId)) {
      setSelectedMethods(selectedMethods.filter(id => id !== methodId));
    } else {
      setSelectedMethods([...selectedMethods, methodId]);
    }
  };

  const handleDownload = async () => {
    if (selectedDataTypes.length === 0 || selectedMethods.length === 0) {
      alert('Please select at least one data type and one augmentation method');
      return;
    }

    setIsDownloading(true);
    let successCount = 0;
    let errorCount = 0;
    const totalDownloads = selectedDataTypes.length * selectedMethods.length;

    try {
      for (const dataType of selectedDataTypes) {
        for (const method of selectedMethods) {
          try {
            await downloadAugmentationData({
              motionType: dataType,
              method: method,
              numSamples: dataCount,
              fileType: fileType
            });
            successCount++;

            // Add a small delay between downloads to avoid overwhelming the browser
            if (successCount < totalDownloads) {
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          } catch (error) {
            console.error(`Failed to download ${method} for ${dataType}:`, error);
            errorCount++;
          }
        }
      }

      if (successCount > 0) {
        alert(`Successfully downloaded ${successCount} file(s)${errorCount > 0 ? `, ${errorCount} failed` : ''}`);
      } else {
        alert('All downloads failed. Please check your selections and try again.');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="download-section-bottom">
      <div className="download-container">
        <h3 className="download-title-main">Download Augmented Data</h3>

        <div className="download-grid">
          {/* Data Types Selection */}
          <div className="download-column">
            <h4 className="download-column-title">Select Data Types</h4>
            <div className="checkbox-group">
              {motionTypes.map(type => (
                <label key={type.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedDataTypes.includes(type.id)}
                    onChange={() => handleDataTypeToggle(type.id)}
                    disabled={isDownloading}
                  />
                  <span className="checkbox-label-text">{type.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Augmentation Methods Selection */}
          <div className="download-column">
            <h4 className="download-column-title">Select Augmentation Methods</h4>
            <div className="checkbox-group">
              {methods.map(method => (
                <label key={method.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedMethods.includes(method.id)}
                    onChange={() => handleMethodToggle(method.id)}
                    disabled={isDownloading}
                  />
                  <span
                    className="checkbox-label-text"
                    style={{ color: method.color, fontWeight: 600 }}
                  >
                    {method.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Data Count and Download */}
          <div className="download-column">
            <h4 className="download-column-title">Data Count & Download</h4>
            <div className="download-controls-section">
              <div className="count-input-group">
                <label htmlFor="dataCount">Number of Samples:</label>
                <input
                  id="dataCount"
                  type="number"
                  className="count-input"
                  value={dataCount}
                  onChange={(e) => setDataCount(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="10000"
                  disabled={isDownloading}
                />
              </div>

              <div className="file-type-group" style={{ marginTop: '16px', marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>File Type:</label>
                <div className="file-type-options" style={{ display: 'flex', gap: '12px' }}>
                  <label className="radio-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="fileType"
                      value="npz"
                      checked={fileType === 'npz'}
                      onChange={(e) => setFileType(e.target.value)}
                      disabled={isDownloading}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>NPZ (Complete Data)</span>
                  </label>
                  <label className="radio-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="fileType"
                      value="csv"
                      checked={fileType === 'csv'}
                      onChange={(e) => setFileType(e.target.value)}
                      disabled={isDownloading}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>CSV (Readable)</span>
                  </label>
                </div>
              </div>

              <button
                className="download-btn-large"
                onClick={handleDownload}
                disabled={selectedDataTypes.length === 0 || selectedMethods.length === 0 || isDownloading}
              >
                {isDownloading ? 'Downloading...' : 'Download Files'}
              </button>

              <div className="download-summary">
                <p>
                  <strong>Selected:</strong> {selectedDataTypes.length} data type(s),{' '}
                  {selectedMethods.length} method(s)
                </p>
                <p>
                  <strong>Total files:</strong>{' '}
                  {selectedDataTypes.length * selectedMethods.length}
                </p>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                  {dataCount > 0 && (
                    <>If requested samples exceed available data, zeros will be padded.</>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadSection;
