import React from 'react';
import { Line } from 'react-chartjs-2';
import DataList from './DataList';

const LeftPanel = ({
  mode,
  trials,
  enableClassification,
  selectedTrial,
  onSelectTrial,
  data,
  labels,
  subject,
  channel
}) => {
  // Mode 1: Show trial list
  if (mode === 'list') {
    if (!trials || trials.length === 0) {
      return (
        <div className="panel left-panel">
          <h3 className="panel-title">Trial Selection</h3>
          <div className="panel-content empty">
            <p>No data loaded. Please select subject and channel, then click "View Data".</p>
          </div>
        </div>
      );
    }

    return (
      <div className="panel left-panel">
        <h3 className="panel-title">Trial Selection</h3>
        <div className="panel-content">
          <DataList
            trials={trials}
            enableClassification={enableClassification}
            selectedTrial={selectedTrial}
            onSelectTrial={onSelectTrial}
          />
        </div>
      </div>
    );
  }

  // Mode 2: Show EEG visualization
  if (!data || !labels) {
    return (
      <div className="panel left-panel">
        <h3 className="panel-title">Original EEG Data</h3>
        <div className="panel-content empty">
          <p>Select a trial to view EEG data</p>
        </div>
      </div>
    );
  }

  // Split data into 4 segments for 4 rows
  const segmentSize = Math.ceil(data.length / 4);
  const segments = [
    { data: data.slice(0, segmentSize), labels: labels.slice(0, segmentSize), index: 1 },
    { data: data.slice(segmentSize, segmentSize * 2), labels: labels.slice(segmentSize, segmentSize * 2), index: 2 },
    { data: data.slice(segmentSize * 2, segmentSize * 3), labels: labels.slice(segmentSize * 2, segmentSize * 3), index: 3 },
    { data: data.slice(segmentSize * 3), labels: labels.slice(segmentSize * 3), index: 4 }
  ];

  const createChartData = (segment) => ({
    labels: segment.labels,
    datasets: [
      {
        label: `Segment ${segment.index}`,
        data: segment.data,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 2,
        tension: 0.1,
        fill: true
      }
    ]
  });

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
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.parsed.y.toFixed(2)} μV`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: false
        },
        ticks: {
          maxTicksLimit: 6,
          font: { size: 8 }
        }
      },
      y: {
        display: true,
        title: {
          display: false
        },
        ticks: {
          font: { size: 8 }
        }
      }
    }
  };

  return (
    <div className="panel left-panel">
      <h3 className="panel-title">Original EEG Data</h3>
      <div className="panel-content left-panel-scroll">
        {segments.map((segment) => (
          <div key={segment.index} className="left-chart-segment">
            <div className="segment-label">Segment {segment.index}</div>
            <div className="segment-chart">
              <Line data={createChartData(segment)} options={options} />
            </div>
          </div>
        ))}
        <div className="panel-info">
          <span className="info-badge">Subject: {subject}</span>
          <span className="info-badge">Channel: {channel}</span>
          <span className="info-badge">Total: {data.length} samples</span>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
