import React from 'react';
import { Line } from 'react-chartjs-2';
import { getAugmentationMethods } from '../data/newMockData';
import EEGNetClassification from './EEGNetClassification';

const MiddlePanel = ({
  processedData,
  augmentedDatasets,
  labels,
  subject,
  channel,
  eogRemoved,
  onToggleEOG,
  miExtracted,
  onToggleMI,
  activeAugmentations,
  eegnetPredictions,
  trueLabel,
  enableClassification
}) => {
  const augMethods = getAugmentationMethods();

  if (!processedData || !labels) {
    return (
      <div className="panel middle-panel">
        <h3 className="panel-title">Processed EEG & Augmentation Overlay</h3>
        <div className="panel-content empty">
          <p>No data loaded. Please select subject and channel, then click "View Data".</p>
        </div>
      </div>
    );
  }

  // Build datasets for the chart
  const datasets = [
    // Processed data (base line)
    {
      label: `Processed Data${eogRemoved ? ' (EOG Removed)' : ''}${miExtracted ? ' (MI Segment)' : ''}`,
      data: processedData,
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.1)',
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 3,
      tension: 0.1,
      fill: false
    }
  ];

  // Add augmented datasets
  augmentedDatasets.forEach(({ method, data: augData }) => {
    const methodInfo = augMethods.find(m => m.id === method);
    if (methodInfo) {
      datasets.push({
        label: `${methodInfo.name} Augmented`,
        data: augData,
        borderColor: methodInfo.color,
        backgroundColor: methodInfo.color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        tension: 0.1,
        fill: false,
        borderDash: [5, 5] // Dashed line for augmented data
      });
    }
  });

  const chartData = {
    labels: labels,
    datasets: datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { size: 11 },
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: `Subject ${subject} - Channel ${channel} (Comparison View)`,
        font: {
          size: 14,
          weight: 'bold'
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} μV`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time (seconds)',
          font: { size: 11 }
        },
        ticks: {
          maxTicksLimit: 10,
          font: { size: 10 }
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Amplitude (μV)',
          font: { size: 11 }
        },
        ticks: {
          font: { size: 10 }
        }
      }
    }
  };

  return (
    <div className="panel middle-panel">
      <h3 className="panel-title">Processed EEG & Augmentation Overlay</h3>

      {/* Processing Controls */}
      <div className="processing-controls">
        <button
          className={`process-btn ${eogRemoved ? 'active' : ''}`}
          onClick={onToggleEOG}
          title="Remove Eye Movement Artifacts"
        >
          {eogRemoved ? '✓' : ''} Remove EOG
        </button>
        <button
          className={`process-btn ${miExtracted ? 'active' : ''}`}
          onClick={onToggleMI}
          title="Extract Motor Imagery Segment (50%-75%)"
        >
          {miExtracted ? '✓' : ''} Extract MI Segment
        </button>
      </div>

      {/* Chart */}
      <div className="panel-content">
        <div className="chart-wrapper">
          <Line data={chartData} options={options} />
        </div>

        {/* Status Info */}
        <div className="panel-info">
          <span className="info-badge">Samples: {processedData.length}</span>
          <span className="info-badge">
            Augmentations Active: {activeAugmentations.length}
          </span>
          {eogRemoved && <span className="info-badge status">EOG Removed</span>}
          {miExtracted && <span className="info-badge status">MI Segment</span>}
        </div>

        {/* EEGNet Classification Results - Only show when classification is enabled */}
        {enableClassification && eegnetPredictions && trueLabel && (
          <EEGNetClassification
            trueLabel={trueLabel}
            predictions={eegnetPredictions}
          />
        )}
      </div>
    </div>
  );
};

export default MiddlePanel;
