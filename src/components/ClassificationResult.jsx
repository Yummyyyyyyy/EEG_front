import React from 'react';

const ClassificationResult = ({ classification }) => {
  // Find the prediction with highest probability
  const predictions = [
    { label: 'Left Hand', value: parseFloat(classification.left), icon: '👈' },
    { label: 'Right Hand', value: parseFloat(classification.right), icon: '👉' },
    { label: 'Foot', value: parseFloat(classification.foot), icon: '🦶' }
  ];

  const maxPrediction = predictions.reduce((max, pred) =>
    pred.value > max.value ? pred : max
  );

  return (
    <div className="classification-container">
      <h3 className="classification-title">Classification Result</h3>

      <div className="prediction-winner">
        <div className="winner-icon">{maxPrediction.icon}</div>
        <div className="winner-label">{maxPrediction.label}</div>
        <div className="winner-confidence">{maxPrediction.value.toFixed(2)}%</div>
      </div>

      <div className="predictions-list">
        {predictions.map((pred, index) => (
          <div key={index} className="prediction-item">
            <div className="prediction-header">
              <span className="prediction-icon">{pred.icon}</span>
              <span className="prediction-label">{pred.label}</span>
              <span className="prediction-value">{pred.value.toFixed(2)}%</span>
            </div>
            <div className="prediction-bar-container">
              <div
                className="prediction-bar"
                style={{
                  width: `${pred.value}%`,
                  backgroundColor: pred === maxPrediction ? '#4CAF50' : '#2196F3'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="classification-info">
        <p className="info-text">
          Motor imagery type identified based on EEG signal feature analysis
        </p>
      </div>
    </div>
  );
};

export default ClassificationResult;
