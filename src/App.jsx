import React, { useState, useEffect } from 'react';
import EEGChart from './components/EEGChart';
import ChannelSelector from './components/ChannelSelector';
import AugmentMethodSelector from './components/AugmentMethodSelector';
import ClassificationResult from './components/ClassificationResult';
import { getMockEEGData, getChannels, getAugmentMethods } from './data/mockData';
import './App.css';

function App() {
  const [selectedChannel, setSelectedChannel] = useState(1);
  const [selectedMethods, setSelectedMethods] = useState(['none']); // 改为数组支持多选
  const [eegDatasets, setEegDatasets] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const channels = getChannels();
  const methods = getAugmentMethods();

  // 加载EEG数据 - 为每个选中的方法生成数据
  useEffect(() => {
    setIsLoading(true);

    // 模拟数据加载延迟
    const timer = setTimeout(() => {
      const datasets = selectedMethods.map(method => {
        return getMockEEGData(selectedChannel, method);
      });
      setEegDatasets(datasets);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedChannel, selectedMethods]);

  const handleChannelChange = (channelId) => {
    setSelectedChannel(channelId);
  };

  const handleMethodChange = (methodIds) => {
    setSelectedMethods(methodIds);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Motor Imagery EEG Data Visualization System</h1>
        <p className="app-subtitle">Brain-Computer Interface Motor Imagery Signal Analysis Platform</p>
      </header>

      <main className="app-main">
        <div className="controls-section">
          <ChannelSelector
            channels={channels}
            selectedChannel={selectedChannel}
            onChannelChange={handleChannelChange}
          />

          <AugmentMethodSelector
            methods={methods}
            selectedMethods={selectedMethods}
            onMethodChange={handleMethodChange}
          />
        </div>

        <div className="content-section">
          <div className="chart-container">
            <div className="card">
              {isLoading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Loading data...</p>
                </div>
              ) : eegDatasets ? (
                <EEGChart
                  datasets={eegDatasets}
                  selectedMethods={selectedMethods}
                  channel={selectedChannel}
                />
              ) : (
                <div className="no-data">No data available</div>
              )}
            </div>
          </div>

          <div className="result-container">
            <div className="card">
              {isLoading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Analyzing...</p>
                </div>
              ) : eegDatasets && eegDatasets.length > 0 ? (
                <div className="multi-classification-results">
                  {eegDatasets.map((data, index) => (
                    <div key={index} className="classification-section">
                      <h4 className="method-title">
                        {methods.find(m => m.id === selectedMethods[index])?.name}
                      </h4>
                      <ClassificationResult classification={data.classification} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">No results available</div>
              )}
            </div>
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h4>System Guide</h4>
            <ul>
              <li><strong>Channel Selection:</strong> Select different EEG channels to view corresponding brain signals</li>
              <li><strong>Multi-Method Comparison:</strong> Select multiple augmentation methods simultaneously for overlay comparison</li>
              <li><strong>Original Data:</strong> Raw EEG signals without processing</li>
              <li><strong>GAN Augmentation:</strong> Uses Generative Adversarial Network to enhance signal features and improve classification accuracy</li>
              <li><strong>VAE Augmentation:</strong> Uses Variational Autoencoder to smooth signals and enhance features</li>
              <li><strong>Classification Results:</strong> Identifies motor imagery types based on signal features (Left Hand, Right Hand, Foot)</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Motor Imagery EEG Visualization System © 2024</p>
      </footer>
    </div>
  );
}

export default App;
