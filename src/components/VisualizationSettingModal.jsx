const VisualizationSettingModal = ({ isOpen, onClose, visualizationType, onVisualizationTypeChange }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Visualization Setting</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="visualization-options">
            <label className="radio-option">
              <input
                type="radio"
                name="visualizationType"
                value="classic_5"
                checked={visualizationType === 'classic_5'}
                onChange={(e) => onVisualizationTypeChange(e.target.value)}
              />
              <span className="radio-label">5-Channel Classic View</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="visualizationType"
                value="custom"
                checked={visualizationType === 'custom'}
                onChange={(e) => onVisualizationTypeChange(e.target.value)}
                disabled
              />
              <span className="radio-label">Custom Channel Selection (Coming Soon)</span>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn modal-btn-primary" onClick={onClose}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisualizationSettingModal;
