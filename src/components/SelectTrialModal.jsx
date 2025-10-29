import { useState } from 'react';

const SelectTrialModal = ({ isOpen, onClose, onSelectTrial }) => {
  const [selectedSubject, setSelectedSubject] = useState(1);
  const [selectedTrialIndex, setSelectedTrialIndex] = useState(1);

  // Mock trial data
  const generateMockTrials = () => {
    const motionTypes = ['👈 Left Hand', '👉 Right Hand', '🦶 Feet', '👅 Tongue'];
    const trials = [];

    for (let subject = 1; subject <= 9; subject++) {
      for (let trial = 1; trial <= 30; trial++) {
        trials.push({
          id: `S${subject}T${trial}`,
          subject: subject,
          trialIndex: trial,
          motionType: motionTypes[Math.floor(Math.random() * motionTypes.length)]
        });
      }
    }

    return trials;
  };

  const [allTrials] = useState(generateMockTrials());
  const [selectedTrialId, setSelectedTrialId] = useState(null);

  if (!isOpen) return null;

  // Filter trials based on dropdown selections
  const filteredTrials = allTrials.filter(
    trial => trial.subject === selectedSubject && trial.trialIndex === selectedTrialIndex
  );

  const handleTrialClick = (trial) => {
    setSelectedTrialId(trial.id);
  };

  const handleConfirm = () => {
    const selectedTrial = allTrials.find(t => t.id === selectedTrialId);
    if (selectedTrial) {
      onSelectTrial(selectedTrial);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select Trial</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Dropdowns */}
          <div className="trial-filters">
            <div className="filter-group">
              <label>Subject:</label>
              <select
                className="filter-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(Number(e.target.value))}
              >
                {Array.from({ length: 9 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>Subject {num}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Trial Index:</label>
              <select
                className="filter-select"
                value={selectedTrialIndex}
                onChange={(e) => setSelectedTrialIndex(Number(e.target.value))}
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>Trial {num}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Trial Table */}
          <div className="trial-table-container">
            <table className="trial-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Trial Index</th>
                  <th>Motion Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrials.length > 0 ? (
                  filteredTrials.map(trial => (
                    <tr
                      key={trial.id}
                      className={selectedTrialId === trial.id ? 'selected' : ''}
                      onClick={() => handleTrialClick(trial)}
                    >
                      <td>{trial.subject}</td>
                      <td>{trial.trialIndex}</td>
                      <td>{trial.motionType}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="no-data">No matching trials</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Show all trials in scrollable table */}
          <div className="all-trials-section">
            <h4>All Trials</h4>
            <div className="trial-table-container scrollable">
              <table className="trial-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Trial Index</th>
                    <th>Motion Type</th>
                  </tr>
                </thead>
                <tbody>
                  {allTrials.map(trial => (
                    <tr
                      key={trial.id}
                      className={selectedTrialId === trial.id ? 'selected' : ''}
                      onClick={() => handleTrialClick(trial)}
                    >
                      <td>{trial.subject}</td>
                      <td>{trial.trialIndex}</td>
                      <td>{trial.motionType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-btn modal-btn-primary"
            onClick={handleConfirm}
            disabled={!selectedTrialId}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectTrialModal;
