import { getAugmentationMethods } from '../data/newMockData';

const RightPanelNew = ({
  activeAugmentations,
  onToggleAugmentation,
  hasData,
  classificationResults,
  isAugmenting
}) => {
  const methods = getAugmentationMethods();

  const motionTypeIcons = {
    '👈 Left Hand': '👈',
    '👉 Right Hand': '👉',
    '🦶 Feet': '🦶',
    '👅 Tongue': '👅'
  };

  return (
    <div className="panel right-panel-new">
      <h3 className="panel-title">Augmentation & Classification</h3>

      <div className="panel-content">
        <div className="right-panel-layout">
          {/* Left Side - Augmentation Methods */}
          <div className="augmentation-section">
            <h4 className="section-subtitle">Augmentation Methods</h4>
            <div className="augmentation-buttons-vertical">
              {methods.map(method => {
                const isActive = activeAugmentations.includes(method.id);

                return (
                  <button
                    key={method.id}
                    className={`aug-btn-compact ${isActive ? 'active' : ''}`}
                    onClick={() => onToggleAugmentation(method.id)}
                    disabled={!hasData || isAugmenting}
                    style={{
                      '--method-color': method.color,
                      '--method-color-light': method.color.replace('rgb', 'rgba').replace(')', ', 0.15)')
                    }}
                  >
                    <span className="aug-check">{isActive ? '✓' : ''}</span>
                    <span className="aug-name-compact">{method.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side - Classification Results */}
          <div className="classification-section">
            <h4 className="section-subtitle">Classification Results</h4>
            <div className="classification-results-grid">
              {methods.map(method => {
                const isActive = activeAugmentations.includes(method.id);
                const result = classificationResults?.[method.id];

                return (
                  <div
                    key={method.id}
                    className={`classification-card ${isActive ? 'active' : 'inactive'}`}
                    style={{
                      borderColor: isActive ? method.color : '#e0e0e0'
                    }}
                  >
                    <div className="classification-method" style={{ color: method.color }}>
                      {method.name}
                    </div>
                    {isActive && result ? (
                      <div className="classification-result-content">
                        <div className="result-icon">
                          {motionTypeIcons[result.predictedClass] || '❓'}
                        </div>
                        <div className="result-label">{result.predictedClass}</div>
                        <div className="result-confidence">
                          {(result.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    ) : (
                      <div className="classification-result-content inactive-text">
                        {isActive ? (isAugmenting ? 'Generating...' : 'Awaiting Data') : 'Not Active'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanelNew;
