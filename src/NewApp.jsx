import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import Toolbar from './components/Toolbar';
import VisualizationSettingModal from './components/VisualizationSettingModal';
import SelectTrialModal from './components/SelectTrialModal';
import LeftPanelNew from './components/LeftPanelNew';
import RightPanelNew from './components/RightPanelNew';
import DownloadSection from './components/DownloadSection';
import { fetchTrialEEGData, generateAugmentedData } from './utils/eegApi';
import './NewApp.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RANDOM_MOTION_LABELS = ['👈 Left Hand', '👉 Right Hand', '🦶 Feet', '👅 Tongue'];

function NewApp() {
  // Mode and selection states
  const [mode, setMode] = useState('local');
  const [selectedMotionType, setSelectedMotionType] = useState('left_hand');
  const [visualizationType, setVisualizationType] = useState('classic_5');

  // Modal states
  const [showVisualizationModal, setShowVisualizationModal] = useState(false);
  const [showSelectTrialModal, setShowSelectTrialModal] = useState(false);

  // Trial states
  const [selectedTrial, setSelectedTrial] = useState(null);

  // Data states
  const [processedEEG, setProcessedEEG] = useState(null);
  const [labels, setLabels] = useState([]);
  const [error, setError] = useState(null);

  // Processing options
  const [eogRemoved, setEogRemoved] = useState(false);
  const [miExtracted, setMiExtracted] = useState(false);

  // Augmentation states
  const [activeAugmentations, setActiveAugmentations] = useState([]);
  const [augmentedDatasets, setAugmentedDatasets] = useState([]);

  // Classification results
  const [classificationResults, setClassificationResults] = useState({});
  const [augmentationError, setAugmentationError] = useState(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [isAugmenting, setIsAugmenting] = useState(false);

  const loadTrialData = async ({ trialId, removeEOGFlag, extractMIFlag }) => {
    if (!trialId) {
      return;
    }

    setIsAugmenting(false);
    setIsLoading(true);
    setError(null);
    setAugmentationError(null);

    try {
      const data = await fetchTrialEEGData(trialId, {
        removeEOG: removeEOGFlag,
        extractMI: extractMIFlag
      });

      setProcessedEEG(data?.processed ?? null);
      setLabels(data?.processed?.labels ?? []);
    } catch (err) {
      console.error('Failed to load EEG data', err);
      setProcessedEEG(null);
      setLabels([]);
      setError(err.message || 'Failed to load EEG data from the server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle trial selection from modal
  const handleSelectTrial = (trial) => {
    setSelectedTrial(trial);
  };

  // Handle View button click - Load and visualize data
  const handleView = () => {
    if (!selectedTrial) {
      alert('Please select a trial first');
      return;
    }

    // Reset all states when viewing new data
    setEogRemoved(false);
    setMiExtracted(false);
    setActiveAugmentations([]);
    setAugmentedDatasets([]);
    setClassificationResults({});
    setAugmentationError(null);

    loadTrialData({
      trialId: selectedTrial.id,
      removeEOGFlag: false,
      extractMIFlag: false
    });
  };

  // Update augmented datasets when augmentation selection changes
  useEffect(() => {
    const fetchAugmentedData = async () => {
      if (!processedEEG || !selectedTrial || activeAugmentations.length === 0) {
        setAugmentedDatasets([]);
        setClassificationResults({});
        setAugmentationError(null);
        return;
      }

      const supportedMethods = ['tcn', 'gan', 'vae', 'diffusion'];
      const methodsToRequest = activeAugmentations.filter((method) => supportedMethods.includes(method));

      if (methodsToRequest.length === 0) {
        setAugmentedDatasets([]);
        setClassificationResults({});
        setAugmentationError(null);
        return;
      }

      const currentTrialId = selectedTrial.id;
      setIsAugmenting(true);
      setAugmentedDatasets([]);
      setClassificationResults({});

      try {
        const data = await generateAugmentedData(
          currentTrialId,
          methodsToRequest,
          processedEEG
        );

        if (!selectedTrial || selectedTrial.id !== currentTrialId) {
          return;
        }

        const datasets = methodsToRequest
          .map((methodId) => data?.[methodId])
          .filter(Boolean)
          .map((item) => ({
            method: item.method,
            channels: item.channels
          }));

        setAugmentedDatasets(datasets);

        const newResults = {};
        methodsToRequest.forEach((methodId) => {
          newResults[methodId] = {
            predictedClass:
              RANDOM_MOTION_LABELS[Math.floor(Math.random() * RANDOM_MOTION_LABELS.length)],
            confidence: 0.7 + Math.random() * 0.25
          };
        });
        setClassificationResults(newResults);
        setAugmentationError(null);
      } catch (err) {
        console.error('Failed to generate augmented data', err);
        setAugmentedDatasets([]);
        setClassificationResults({});
        setAugmentationError(err.message || 'Failed to generate augmented EEG data.');
      } finally {
        setIsAugmenting(false);
      }
    };

    fetchAugmentedData();
  }, [activeAugmentations, processedEEG, selectedTrial]);

  // Handle EOG toggle
  const handleToggleEOG = () => {
    const nextValue = !eogRemoved;
    setEogRemoved(nextValue);

    if (!selectedTrial || isLoading) {
      return;
    }

    loadTrialData({
      trialId: selectedTrial.id,
      removeEOGFlag: nextValue,
      extractMIFlag: miExtracted
    });
  };

  // Handle MI toggle
  const handleToggleMI = () => {
    const nextValue = !miExtracted;
    setMiExtracted(nextValue);

    if (!selectedTrial || isLoading) {
      return;
    }

    loadTrialData({
      trialId: selectedTrial.id,
      removeEOGFlag: eogRemoved,
      extractMIFlag: nextValue
    });
  };

  // Handle augmentation toggle
  const handleToggleAugmentation = (methodId) => {
    setActiveAugmentations((prev) =>
      prev.includes(methodId)
        ? prev.filter((id) => id !== methodId)
        : [...prev, methodId]
    );
  };

  const combinedError = error || augmentationError;

  return (
    <div className="new-app">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">Motor Imagery EEG Data Processing & Augmentation System</h1>
        <p className="app-subtitle">Advanced Brain-Computer Interface Signal Analysis Platform</p>
      </header>

      {/* Toolbar */}
      <Toolbar
        mode={mode}
        onModeChange={setMode}
        selectedMotionType={selectedMotionType}
        onMotionTypeChange={setSelectedMotionType}
        onVisualizationSettingClick={() => setShowVisualizationModal(true)}
        onSelectTrialClick={() => setShowSelectTrialModal(true)}
        onView={handleView}
      />

      {/* Modals */}
      <VisualizationSettingModal
        isOpen={showVisualizationModal}
        onClose={() => setShowVisualizationModal(false)}
        visualizationType={visualizationType}
        onVisualizationTypeChange={setVisualizationType}
      />

      <SelectTrialModal
        isOpen={showSelectTrialModal}
        onClose={() => setShowSelectTrialModal(false)}
        onSelectTrial={handleSelectTrial}
        selectedMotionType={selectedMotionType}
      />

      {/* Main Content - Two Column Layout */}
      <main className="app-main">
        {combinedError && (
          <div className="error-banner">
            {combinedError}
          </div>
        )}
        {isLoading ? (
          <div className="loading-overlay">
            <div className="spinner-large"></div>
            <p>Loading and processing EEG data...</p>
          </div>
        ) : (
          <>
            <div className="two-column-layout">
              {/* Left Panel - 60% */}
              <div className="column column-left-60">
                <LeftPanelNew
                  eegData={processedEEG}
                  labels={labels}
                  eogRemoved={eogRemoved}
                  onToggleEOG={handleToggleEOG}
                  miExtracted={miExtracted}
                  onToggleMI={handleToggleMI}
                  augmentedDatasets={augmentedDatasets}
                  isLoading={isLoading}
                  isAugmenting={isAugmenting}
                />
              </div>

              {/* Right Panel - 40% */}
              <div className="column column-right-40">
                <RightPanelNew
                  activeAugmentations={activeAugmentations}
                  onToggleAugmentation={handleToggleAugmentation}
                  hasData={!!processedEEG}
                  classificationResults={classificationResults}
                  isAugmenting={isAugmenting}
                />
              </div>
            </div>

            {/* Bottom Download Section */}
            <DownloadSection selectedMotionType={selectedMotionType} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Motor Imagery EEG Processing System © 2024 | Developed for Advanced BCI Research</p>
      </footer>
    </div>
  );
}

export default NewApp;
