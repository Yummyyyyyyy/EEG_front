import { Line } from 'react-chartjs-2';
import { getAugmentationMethods } from '../data/newMockData';

const LeftPanelNew = ({
  eegData,
  labels,
  eogRemoved,
  onToggleEOG,
  miExtracted,
  onToggleMI,
  augmentedDatasets,
  activeAugmentations
}) => {
  if (!eegData || !labels) {
    return (
      <div className="panel left-panel-new">
        <h3 className="panel-title">EEG Signals - 5 Channels</h3>
        <div className="panel-content empty">
          <p>No data loaded. Please select a trial and click View.</p>
        </div>
      </div>
    );
  }

  // 5 classic channels for motor imagery - all use the same color
  const channelColor = 'rgb(54, 162, 235)'; // Blue for all real channels
  const channels = [
    { id: 'C3', name: 'C3' },
    { id: 'Cz', name: 'Cz' },
    { id: 'C4', name: 'C4' },
    { id: 'CP1', name: 'CP1' },
    { id: 'CP2', name: 'CP2' }
  ];

  // Get augmentation method colors
  const augMethods = getAugmentationMethods();

  // Create chart options for compact view
  const createChannelOptions = (channelName) => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: channelName,
        font: { size: 11, weight: 'bold' },
        padding: { top: 5, bottom: 5 }
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
        ticks: {
          maxTicksLimit: 5,
          font: { size: 8 }
        },
        grid: { display: false }
      },
      y: {
        display: true,
        ticks: {
          maxTicksLimit: 3,
          font: { size: 8 }
        },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      }
    }
  });

  // Generate mock data for each channel (with slight variations)
  const generateChannelData = (channelIndex) => {
    return eegData.map((value, idx) =>
      value + Math.sin(idx * 0.1 + channelIndex) * 5
    );
  };

  return (
    <div className="panel left-panel-new">
      <h3 className="panel-title">EEG Signals - 5 Channels</h3>

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
          title="Extract Motor Imagery Segment"
        >
          {miExtracted ? '✓' : ''} Extract MI Segment
        </button>
      </div>

      {/* 5 Channel Charts - Compact Display */}
      <div className="panel-content">
        <div className="five-channel-display">
          {channels.map((channel, idx) => {
            const channelData = generateChannelData(idx);

            // Build datasets: 5 channels (same color) + augmented data (different colors)
            const datasets = [
              {
                label: channel.name,
                data: channelData,
                borderColor: channelColor,
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                pointRadius: 0,
                tension: 0.1,
                fill: false
              }
            ];

            // Add augmented datasets - each augmentation method shows as a separate line
            augmentedDatasets.forEach((augData) => {
              const method = augMethods.find(m => m.id === augData.method);
              if (method) {
                // Generate augmented data based on original channel data
                const augChannelData = channelData.map(v => v + (Math.random() - 0.5) * 8);
                datasets.push({
                  label: method.name,
                  data: augChannelData,
                  borderColor: method.color,
                  backgroundColor: 'transparent',
                  borderWidth: 2,
                  borderDash: [5, 3],
                  pointRadius: 0,
                  tension: 0.1,
                  fill: false
                });
              }
            });

            const chartData = {
              labels: labels,
              datasets: datasets
            };

            return (
              <div key={channel.id} className="channel-chart-compact">
                <Line data={chartData} options={createChannelOptions(channel.name)} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeftPanelNew;
