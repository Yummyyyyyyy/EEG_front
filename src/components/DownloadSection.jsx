import { useState } from 'react';
import { getAugmentationMethods } from '../data/newMockData';

const DownloadSection = ({ selectedMotionType }) => {
  const methods = getAugmentationMethods();
  const motionTypes = [
    { id: 'left_hand', name: '👈 Left Hand' },
    { id: 'right_hand', name: '👉 Right Hand' },
    { id: 'feet', name: '🦶 Feet' },
    { id: 'tongue', name: '👅 Tongue' }
  ];

  const [selectedDataTypes, setSelectedDataTypes] = useState([]);
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [dataCount, setDataCount] = useState(100);

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

  const handleDownload = () => {
    if (selectedDataTypes.length === 0 || selectedMethods.length === 0) {
      alert('Please select at least one data type and one augmentation method');
      return;
    }

    // Create CSV content
    let csvContent = 'Data Type,Augmentation Method,Sample Count\n';
    selectedDataTypes.forEach(dataType => {
      const typeName = motionTypes.find(t => t.id === dataType)?.name || dataType;
      selectedMethods.forEach(method => {
        const methodName = methods.find(m => m.id === method)?.name || method;
        csvContent += `${typeName},${methodName},${dataCount}\n`;
      });
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `augmented_eeg_data_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
                />
              </div>

              <button
                className="download-btn-large"
                onClick={handleDownload}
                disabled={selectedDataTypes.length === 0 || selectedMethods.length === 0}
              >
                Download CSV
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadSection;
