import { Line } from 'react-chartjs-2';
import { getAugmentationMethods } from '../data/newMockData';

const CHANNEL_CONFIG = [
  { id: 'Fz', name: 'Fz', color: 'rgb(54, 162, 235)' },
  { id: 'C3', name: 'C3', color: 'rgb(255, 99, 132)' },
  { id: 'Cz', name: 'Cz', color: 'rgb(255, 205, 86)' },
  { id: 'C4', name: 'C4', color: 'rgb(75, 192, 192)' },
  { id: 'Pz', name: 'Pz', color: 'rgb(153, 102, 255)' }
];

const LeftPanelNew = ({
  eegData,
  labels,
  eogRemoved,
  onToggleEOG,
  miExtracted,
  onToggleMI,
  augmentedDatasets,
  isLoading
}) => {
  const hasData = Boolean(
    eegData?.channels &&
      Object.values(eegData.channels).some((channelValues) => channelValues?.length)
  );

  if (!hasData) {
    return (
      <div className="panel left-panel-new">
        <h3 className="panel-title">EEG Signals - 5 Channels</h3>
        <div className="panel-content empty">
          <p>No data loaded. Please select a trial and click View.</p>
        </div>
      </div>
    );
  }

  const augMethods = getAugmentationMethods();

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
          label: function (context) {
            return `${context.parsed.y.toFixed(4)} μV`;
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

  const buildChartLabels = (channelValues) => {
    if (Array.isArray(labels) && labels.length === channelValues.length) {
      return labels;
    }
    return channelValues.map((_, index) => index);
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
          disabled={isLoading}
        >
          {eogRemoved ? '✓' : ''} Remove EOG
        </button>
        <button
          className={`process-btn ${miExtracted ? 'active' : ''}`}
          onClick={onToggleMI}
          title="Extract Motor Imagery Segment"
          disabled={isLoading}
        >
          {miExtracted ? '✓' : ''} Extract MI Segment
        </button>
      </div>

      {/* 5 Channel Charts - Compact Display */}
      <div className="panel-content">
        <div className="five-channel-display">
          {CHANNEL_CONFIG.map((channel) => {
            const channelValues = eegData.channels?.[channel.id] ?? [];
            const chartLabels = buildChartLabels(channelValues);

            const datasets = [
              {
                label: channel.name,
                data: channelValues,
                borderColor: channel.color,
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                pointRadius: 0,
                tension: 0.1,
                fill: false
              }
            ];

            augmentedDatasets.forEach((augData) => {
              const method = augMethods.find((item) => item.id === augData.method);
              if (method) {
                const augChannelData = channelValues.map(
                  (value) => value + (Math.random() - 0.5) * 5
                );
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
              labels: chartLabels,
              datasets
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
