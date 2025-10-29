import React from 'react';

const DataList = ({ trials, enableClassification, selectedTrial, onSelectTrial }) => {
  const getLabelIcon = (label) => {
    switch (label) {
      case 'left': return '👈';
      case 'right': return '👉';
      case 'foot': return '🦶';
      case 'tongue': return '👅';
      default: return '❓';
    }
  };

  const getLabelText = (label) => {
    switch (label) {
      case 'left': return 'Left Hand';
      case 'right': return 'Right Hand';
      case 'foot': return 'Foot';
      case 'tongue': return 'Tongue';
      default: return 'Unknown';
    }
  };

  return (
    <div className="data-list">
      <div className="data-list-header">
        <h4>Trial List</h4>
        <span className="trial-count">{trials.length} trials</span>
      </div>

      <div className="data-list-items">
        {trials.map((trial) => (
          <div
            key={trial.id}
            className={`data-item ${selectedTrial === trial.id ? 'selected' : ''}`}
            onClick={() => onSelectTrial(trial.id)}
          >
            <div className="data-item-number">#{trial.id}</div>

            {enableClassification && (
              <div className="data-item-label">
                <span className="label-icon">{getLabelIcon(trial.label)}</span>
                <span className="label-text">{getLabelText(trial.label)}</span>
              </div>
            )}

            <div className="data-item-arrow">›</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataList;
