import { useEffect, useMemo, useState } from 'react';
import { fetchTrials } from '../utils/eegApi';

const MOTION_TYPE_FROM_TOOLBAR = {
  left_hand: 'left',
  right_hand: 'right',
  feet: 'foot',
  tongue: 'tongue'
};

const MOTION_TYPE_OPTIONS = [
  { value: 'all', label: 'All Motions' },
  { value: 'left', label: '👈 Left Hand' },
  { value: 'right', label: '👉 Right Hand' },
  { value: 'foot', label: '🦶 Feet' },
  { value: 'tongue', label: '👅 Tongue' }
];

const buildMotionLabel = (motionType) => {
  const option = MOTION_TYPE_OPTIONS.find((item) => item.value === motionType);
  return option ? option.label : motionType;
};

const SUBJECT_OPTIONS = Array.from({ length: 9 }, (_, index) => index + 1);

const SelectTrialModal = ({ isOpen, onClose, onSelectTrial, selectedMotionType }) => {
  const [selectedSubject, setSelectedSubject] = useState(1);
  const [trialIndexFilter, setTrialIndexFilter] = useState('all');
  const [motionFilter, setMotionFilter] = useState('all');
  const [allTrials, setAllTrials] = useState([]);
  const [selectedTrialId, setSelectedTrialId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSelectedTrialId(null);
    setTrialIndexFilter('all');
    setSelectedSubject(1);
    const mappedMotion = MOTION_TYPE_FROM_TOOLBAR[selectedMotionType] ?? 'all';
    setMotionFilter(mappedMotion);
  }, [isOpen, selectedMotionType]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isCancelled = false;

    const loadTrials = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const trials = await fetchTrials();
        if (!isCancelled) {
          setAllTrials(trials);
        }
      } catch (err) {
        if (!isCancelled) {
          setAllTrials([]);
          setError(err.message || 'Failed to load trial list from the server.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadTrials();

    return () => {
      isCancelled = true;
    };
  }, [isOpen]);

  const trialsForSubject = useMemo(
    () => allTrials.filter((trial) => trial.subject === selectedSubject),
    [allTrials, selectedSubject]
  );

  const trialsForMotion = useMemo(() => {
    if (motionFilter === 'all') {
      return trialsForSubject;
    }
    return trialsForSubject.filter((trial) => trial.motionType === motionFilter);
  }, [trialsForSubject, motionFilter]);

  const availableTrialIndexes = useMemo(() => {
    const unique = new Set(trialsForMotion.map((trial) => trial.trialIndex));
    return Array.from(unique).sort((a, b) => a - b);
  }, [trialsForMotion]);

  const filteredTrials = useMemo(() => {
    if (trialIndexFilter === 'all') {
      return trialsForMotion;
    }
    const targetIndex = Number(trialIndexFilter);
    return trialsForMotion.filter((trial) => trial.trialIndex === targetIndex);
  }, [trialsForMotion, trialIndexFilter]);

  if (!isOpen) {
    return null;
  }

  const handleTrialClick = (trial) => {
    setSelectedTrialId(trial.id);
  };

  const handleConfirm = () => {
    const selectedTrial = allTrials.find((trial) => trial.id === selectedTrialId);
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
                {SUBJECT_OPTIONS.map((subject) => (
                  <option key={subject} value={subject}>
                    Subject {subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Motion Type:</label>
              <select
                className="filter-select"
                value={motionFilter}
                onChange={(e) => setMotionFilter(e.target.value)}
              >
                {MOTION_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Trial Index:</label>
              <select
                className="filter-select"
                value={trialIndexFilter}
                onChange={(e) => setTrialIndexFilter(e.target.value)}
              >
                <option value="all">All Trials</option>
                {availableTrialIndexes.map((index) => (
                  <option key={index} value={String(index)}>
                    Trial {index}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="trial-status">Loading trials...</div>
          ) : error ? (
            <div className="trial-status error">{error}</div>
          ) : filteredTrials.length === 0 ? (
            <div className="trial-status">No trials match the current filters.</div>
          ) : (
            <>
              {/* Trial Table */}
              <div className="trial-table-container">
                <table className="trial-table">
                  <thead>
                    <tr>
                      <th>Trial ID</th>
                      <th>Subject</th>
                      <th>Trial Index</th>
                      <th>Motion Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrials.map((trial) => (
                      <tr
                        key={trial.id}
                        className={selectedTrialId === trial.id ? 'selected' : ''}
                        onClick={() => handleTrialClick(trial)}
                      >
                        <td>{trial.id}</td>
                        <td>{trial.subject}</td>
                        <td>{trial.trialIndex}</td>
                        <td>{buildMotionLabel(trial.motionType)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Show filtered trials in scrollable table */}
              <div className="all-trials-section">
                <h4>Trials for Selected Subject &amp; Motion</h4>
                <div className="trial-table-container scrollable">
                  <table className="trial-table">
                    <thead>
                      <tr>
                        <th>Trial ID</th>
                        <th>Subject</th>
                        <th>Trial Index</th>
                        <th>Motion Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trialsForMotion.map((trial) => (
                        <tr
                          key={trial.id}
                          className={selectedTrialId === trial.id ? 'selected' : ''}
                          onClick={() => handleTrialClick(trial)}
                        >
                          <td>{trial.id}</td>
                          <td>{trial.subject}</td>
                          <td>{trial.trialIndex}</td>
                          <td>{buildMotionLabel(trial.motionType)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
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
