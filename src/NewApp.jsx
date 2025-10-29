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
import {
  getProcessedEEGData,
  getAugmentationMethods
} from './data/newMockData';
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
  const [eegData, setEegData] = useState(null);
  const [labels, setLabels] = useState(null);

  // Processing options
  const [eogRemoved, setEogRemoved] = useState(false);
  const [miExtracted, setMiExtracted] = useState(false);

  // Augmentation states
  const [activeAugmentations, setActiveAugmentations] = useState([]);
  const [augmentedDatasets, setAugmentedDatasets] = useState([]);

  // Classification results
  const [classificationResults, setClassificationResults] = useState({});

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Handle trial selection from modal
  const handleSelectTrial = (trial) => {
    setSelectedTrial(trial);
    // Don't load data yet - wait for View button click
  };

  // Handle View button click - Load and visualize data
  const handleView = () => {
    if (!selectedTrial) {
      alert('Please select a trial first');
      return;
    }

    setIsLoading(true);

    // Reset all states when viewing new data
    setEogRemoved(false);
    setMiExtracted(false);
    setActiveAugmentations([]);
    setAugmentedDatasets([]);
    setClassificationResults({});

    setTimeout(() => {
      // Generate mock EEG data
      const result = getProcessedEEGData(1, 1, {
        removeEOGFlag: false,
        extractMIFlag: false,
        augmentationMethods: []
      });

      setEegData(result.processed.data);
      setLabels(result.processed.labels);
      setIsLoading(false);
    }, 500);
  };

  // Update data when processing options change
  useEffect(() => {
    if (eegData) {
      const result = getProcessedEEGData(1, 1, {
        removeEOGFlag: eogRemoved,
        extractMIFlag: miExtracted,
        augmentationMethods: activeAugmentations
      });

      setEegData(result.processed.data);
      setLabels(result.processed.labels);
      setAugmentedDatasets(result.augmented);
    }
  }, [eogRemoved, miExtracted]);

  // Update augmented datasets when augmentations change
  useEffect(() => {
    if (eegData && activeAugmentations.length > 0) {
      const methods = getAugmentationMethods();
      const newAugmentedDatasets = activeAugmentations.map(methodId => {
        const method = methods.find(m => m.id === methodId);
        // Generate mock augmented data
        const augData = eegData.map(v => v + (Math.random() - 0.5) * 10);
        return {
          method: methodId,
          data: augData,
          color: method.color
        };
      });
      setAugmentedDatasets(newAugmentedDatasets);

      // Generate mock classification results
      const motionTypes = ['👈 Left Hand', '👉 Right Hand', '🦶 Feet', '👅 Tongue'];
      const newResults = {};
      activeAugmentations.forEach(methodId => {
        newResults[methodId] = {
          predictedClass: motionTypes[Math.floor(Math.random() * motionTypes.length)],
          confidence: 0.7 + Math.random() * 0.25
        };
      });
      setClassificationResults(newResults);
    } else {
      setAugmentedDatasets([]);
      setClassificationResults({});
    }
  }, [activeAugmentations, eegData]);

  // Handle EOG toggle
  const handleToggleEOG = () => {
    setEogRemoved(!eogRemoved);
  };

  // Handle MI toggle
  const handleToggleMI = () => {
    setMiExtracted(!miExtracted);
  };

  // Handle augmentation toggle
  const handleToggleAugmentation = (methodId) => {
    if (activeAugmentations.includes(methodId)) {
      setActiveAugmentations(activeAugmentations.filter(id => id !== methodId));
    } else {
      setActiveAugmentations([...activeAugmentations, methodId]);
    }
  };

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
      />

      {/* Main Content - Two Column Layout */}
      <main className="app-main">
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
                  eegData={eegData}
                  labels={labels}
                  eogRemoved={eogRemoved}
                  onToggleEOG={handleToggleEOG}
                  miExtracted={miExtracted}
                  onToggleMI={handleToggleMI}
                  augmentedDatasets={augmentedDatasets}
                  activeAugmentations={activeAugmentations}
                />
              </div>

              {/* Right Panel - 40% */}
              <div className="column column-right-40">
                <RightPanelNew
                  activeAugmentations={activeAugmentations}
                  onToggleAugmentation={handleToggleAugmentation}
                  hasData={!!eegData}
                  classificationResults={classificationResults}
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
