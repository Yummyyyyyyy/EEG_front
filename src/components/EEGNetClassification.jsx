import React from 'react';

const EEGNetClassification = ({ trueLabel, predictions }) => {
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

  const getMethodColor = (method) => {
    switch (method) {
      case 'original': return '#54a0ff';
      case 'vae': return 'rgb(75, 192, 192)';
      case 'tcn': return 'rgb(255, 159, 64)';
      case 'gan': return 'rgb(255, 99, 132)';
      case 'diffusion': return 'rgb(153, 102, 255)';
      default: return '#999';
    }
  };

  return (
    <div className="eegnet-classification">
      <h4 className="eegnet-title">EEGNet Classification Results</h4>

      <div className="classification-content">
        {/* True Label */}
        <div className="true-label-section">
          <div className="section-header">True Label</div>
          <div className="true-label-box">
            <span className="label-icon-large">{getLabelIcon(trueLabel)}</span>
            <span className="label-text-large">{getLabelText(trueLabel)}</span>
          </div>
        </div>

        {/* Predictions */}
        <div className="predictions-section">
          <div className="section-header">Predicted Labels</div>
          <div className="predictions-grid">
            {predictions.map((pred, index) => (
              <div
                key={index}
                className="prediction-box"
                style={{ borderColor: getMethodColor(pred.method) }}
              >
                <div className="prediction-method" style={{ color: getMethodColor(pred.method) }}>
                  {pred.methodName}
                </div>
                <div className="prediction-result">
                  <span className="prediction-icon">{getLabelIcon(pred.predicted)}</span>
                  <span className="prediction-label">{getLabelText(pred.predicted)}</span>
                </div>
                <div className={`prediction-status ${pred.correct ? 'correct' : 'incorrect'}`}>
                  {pred.correct ? '✓ Correct' : '✗ Incorrect'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EEGNetClassification;
