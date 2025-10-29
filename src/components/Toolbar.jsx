import React from 'react';

const Toolbar = ({
  mode,
  onModeChange,
  selectedMotionType,
  onMotionTypeChange,
  onVisualizationSettingClick,
  onSelectTrialClick,
  onView
}) => {
  const motionTypes = [
    { id: 'left_hand', name: '👈 Left Hand', icon: '👈' },
    { id: 'right_hand', name: '👉 Right Hand', icon: '👉' },
    { id: 'feet', name: '🦶 Feet', icon: '🦶' },
    { id: 'tongue', name: '👅 Tongue', icon: '👅' }
  ];

  return (
    <div className="toolbar">
      {/* Mode Toggle */}
      <div className="toolbar-section mode-toggle">
        <label className="mode-label">Mode:</label>
        <div className="toggle-switch">
          <button
            className={`toggle-btn ${mode === 'local' ? 'active' : ''}`}
            onClick={() => onModeChange('local')}
          >
            Local Mode
          </button>
          <button
            className={`toggle-btn ${mode === 'upload' ? 'active' : ''}`}
            onClick={() => onModeChange('upload')}
          >
            Upload Mode
          </button>
        </div>
      </div>

      {/* Local Mode Controls */}
      {mode === 'local' && (
        <>
          {/* Motion Type Selector */}
          <div className="toolbar-section">
            <label className="toolbar-label">Select Motion Type:</label>
            <select
              className="toolbar-select"
              value={selectedMotionType}
              onChange={(e) => onMotionTypeChange(e.target.value)}
            >
              {motionTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Visualization Setting Button */}
          <div className="toolbar-section">
            <button className="toolbar-btn" onClick={onVisualizationSettingClick}>
              Visualization Setting
            </button>
          </div>

          {/* Select Trial Button */}
          <div className="toolbar-section">
            <button className="toolbar-btn" onClick={onSelectTrialClick}>
              Select Trial
            </button>
          </div>

          {/* View Button */}
          <div className="toolbar-section">
            <button className="view-btn" onClick={onView}>
              View
            </button>
          </div>
        </>
      )}

      {/* Upload Mode Controls (placeholder) */}
      {mode === 'upload' && (
        <div className="toolbar-section upload-section">
          <label className="toolbar-label">Upload EEG File:</label>
          <input
            type="file"
            className="file-input"
            accept=".edf,.csv,.mat"
            disabled
          />
          <span className="upload-hint">(Coming soon)</span>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
