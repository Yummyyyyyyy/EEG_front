import { Line } from 'react-chartjs-2';
import { getAugmentationMethods } from '../data/newMockData';

const CHANNEL_CONFIG = [
  { id: 'Fz', name: 'Fz', color: 'rgb(54, 162, 235)' },
  { id: 'C3', name: 'C3', color: 'rgb(255, 99, 132)' },
  { id: 'Cz', name: 'Cz', color: 'rgb(255, 205, 86)' },
  { id: 'C4', name: 'C4', color: 'rgb(75, 192, 192)' },
  { id: 'Pz', name: 'Pz', color: 'rgb(153, 102, 255)' }
];

const REAL_LINE_COLOR = 'rgb(25, 118, 210)';
const DEFAULT_RANGE_MIN = 50;
const DEFAULT_RANGE_MAX = 200;
const PERCENT_THRESHOLD = 5; // 500% difference
const ABS_THRESHOLD_FOR_ZERO = 5;

const LeftPanelNew = ({
  eegData,
  labels,
  eogRemoved,
  onToggleEOG,
  miExtracted,
  onToggleMI,
  augmentedDatasets,
  isLoading,
  isAugmenting
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

  const adjustSeriesLength = (series, length) => {
    if (!Array.isArray(series)) {
      return Array.from({ length }, () => null);
    }
    if (series.length === length) {
      return series.slice();
    }
    if (series.length > length) {
      return series.slice(0, length);
    }
    return series.concat(Array.from({ length: length - series.length }, () => null));
  };

  const smoothValues = (values, windowSize = 5) => {
    const half = Math.floor(windowSize / 2);
    return values.map((value, index) => {
      if (value === null || value === undefined) {
        return value;
      }
      let sum = 0;
      let count = 0;
      for (let offset = -half; offset <= half; offset += 1) {
        const sample = values[index + offset];
        if (sample !== null && sample !== undefined) {
          sum += sample;
          count += 1;
        }
      }
      return count > 0 ? sum / count : value;
    });
  };

  const sanitizeAugmentedValues = (values, realValues, methodId) => {
    if (!Array.isArray(values)) {
      return [];
    }

    const sanitized = values.map((value, idx) => {
      if (value === null || value === undefined || Number.isNaN(value)) {
        return null;
      }
      const realValue = realValues?.[idx];
      if (realValue === undefined || realValue === null) {
        return value;
      }

      const diff = Math.abs(value - realValue);
      const baseline = Math.abs(realValue);

      if (baseline < 1e-3) {
        if (Math.abs(value) > ABS_THRESHOLD_FOR_ZERO) {
          return realValue;
        }
        return value;
      }

      if (diff > PERCENT_THRESHOLD * baseline) {
        return realValue;
      }

      return value;
    });

    if (methodId === 'vae') {
      return sanitized;
    }

    return sanitized;
  };

  const createChannelOptions = (channelName, axisLimits) => ({
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
            return `${context.parsed.y.toFixed(2)} μV`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        ticks: {
          maxTicksLimit: 6,
          font: { size: 8 }
        },
        grid: { display: false }
      },
      y: {
        display: true,
        ticks: {
          maxTicksLimit: 4,
          font: { size: 8 }
        },
        min: axisLimits?.min ?? undefined,
        max: axisLimits?.max ?? undefined,
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      }
    }
  });

  const buildChartLabels = (targetLength) => {
    if (Array.isArray(labels) && labels.length === targetLength && targetLength > 0) {
      return labels;
    }
    return Array.from({ length: targetLength }, (_, index) => index);
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
          disabled={isLoading || isAugmenting}
        >
          {eogRemoved ? '✓' : ''} Remove EOG
        </button>
        <button
          className={`process-btn ${miExtracted ? 'active' : ''}`}
          onClick={onToggleMI}
          title="Extract Motor Imagery Segment"
          disabled={isLoading || isAugmenting}
        >
          {miExtracted ? '✓' : ''} Extract MI Segment
        </button>
      </div>

      {/* 5 Channel Charts - Compact Display */}
      <div className="panel-content">
        <div className="five-channel-display">
          {CHANNEL_CONFIG.map((channel) => {
            const baseValuesRaw = eegData.channels?.[channel.id];
            const baseChannelValues = Array.isArray(baseValuesRaw) ? baseValuesRaw : [];

            const rawAugmentedSeries = augmentedDatasets
              .map((augData) => {
                const methodMeta = augMethods.find((item) => item.id === augData.method);
                const augChannelValues = augData.channels?.[channel.id];

                if (!methodMeta || !Array.isArray(augChannelValues) || augChannelValues.length === 0) {
                  return null;
                }

                const sanitizedValues = sanitizeAugmentedValues(augChannelValues, baseChannelValues, augData.method);

                return {
                  method: augData.method,
                  label: methodMeta.name,
                  color: methodMeta.color,
                  values: sanitizedValues
                };
              })
              .filter(Boolean);

            let targetLength = baseChannelValues.length;
            rawAugmentedSeries.forEach((item) => {
              targetLength = Math.max(targetLength, item.values.length);
            });

            if (targetLength === 0) {
              return (
                <div key={channel.id} className="channel-chart-compact">
                  <div className="chart-placeholder">No data for {channel.name}</div>
                </div>
              );
            }

            const realValues = adjustSeriesLength(baseChannelValues, targetLength);
            const augmentedSeries = rawAugmentedSeries.map((item) => ({
              ...item,
              values: adjustSeriesLength(item.values, targetLength)
            }));

            const chartLabels = buildChartLabels(targetLength);

            const magnitudes = [];
            realValues.forEach((value) => {
              if (typeof value === 'number' && !Number.isNaN(value)) {
                magnitudes.push(Math.abs(value));
              }
            });
            augmentedSeries.forEach((item) => {
              item.values.forEach((value) => {
                if (typeof value === 'number' && !Number.isNaN(value)) {
                  magnitudes.push(Math.abs(value));
                }
              });
            });

            const maxAbs = magnitudes.length > 0 ? Math.max(...magnitudes) : DEFAULT_RANGE_MIN;
            const clamped = Math.min(Math.max(maxAbs * 1.1, DEFAULT_RANGE_MIN), DEFAULT_RANGE_MAX);
            const axisLimits = { min: -clamped, max: clamped };

            const datasets = [];

            if (realValues.some((value) => value !== null && value !== undefined)) {
              datasets.push({
                label: `Real (${channel.name})`,
                data: realValues,
                borderColor: REAL_LINE_COLOR,
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                pointRadius: 0,
                tension: 0.2,
                spanGaps: true
              });
            }

            augmentedSeries.forEach((item) => {
              datasets.push({
                label: `${item.label} (${channel.name})`,
                data: item.values,
                borderColor: item.color || 'rgba(220, 0, 78, 0.8)',
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [6, 3],
                pointRadius: 0,
                tension: 0.15,
                spanGaps: true
              });
            });

            if (datasets.length === 0 || chartLabels.length === 0) {
              return (
                <div key={channel.id} className="channel-chart-compact">
                  <div className="chart-placeholder">No data for {channel.name}</div>
                </div>
              );
            }

            const chartData = {
              labels: chartLabels,
              datasets
            };

            return (
              <div key={channel.id} className="channel-chart-compact">
                <Line data={chartData} options={createChannelOptions(channel.name, axisLimits)} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeftPanelNew;
