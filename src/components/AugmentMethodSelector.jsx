import React from 'react';

const AugmentMethodSelector = ({ methods, selectedMethods, onMethodChange }) => {
  const handleMethodToggle = (methodId) => {
    if (selectedMethods.includes(methodId)) {
      // 如果已选中，则取消选择（但至少保留一个）
      if (selectedMethods.length > 1) {
        onMethodChange(selectedMethods.filter(id => id !== methodId));
      }
    } else {
      // 如果未选中，则添加到选择列表
      onMethodChange([...selectedMethods, methodId]);
    }
  };

  return (
    <div className="selector-container">
      <label className="selector-label">Augmentation Method (Multi-select for Comparison):</label>
      <div className="method-buttons">
        {methods.map(method => (
          <button
            key={method.id}
            className={`method-button ${selectedMethods.includes(method.id) ? 'active' : ''}`}
            onClick={() => handleMethodToggle(method.id)}
          >
            <span className="method-name">{method.name}</span>
            {selectedMethods.includes(method.id) && (
              <span className="checkmark">✓</span>
            )}
          </button>
        ))}
      </div>
      <p className="method-hint">
        {selectedMethods.length} method{selectedMethods.length > 1 ? 's' : ''} selected - Click to toggle
      </p>
    </div>
  );
};

export default AugmentMethodSelector;
