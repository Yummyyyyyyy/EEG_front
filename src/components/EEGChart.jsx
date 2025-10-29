import React from 'react';
import { Line } from 'react-chartjs-2';
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

// 注册Chart.js组件
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

const EEGChart = ({ datasets, selectedMethods, channel }) => {
  // 为不同的增强方法分配颜色
  const methodColors = {
    'none': {
      border: 'rgb(75, 192, 192)',
      background: 'rgba(75, 192, 192, 0.1)'
    },
    'GAN': {
      border: 'rgb(255, 99, 132)',
      background: 'rgba(255, 99, 132, 0.1)'
    },
    'VAE': {
      border: 'rgb(54, 162, 235)',
      background: 'rgba(54, 162, 235, 0.1)'
    }
  };

  // Get method display name
  const getMethodName = (methodId) => {
    switch (methodId) {
      case 'none':
        return 'Original Data';
      case 'GAN':
        return 'GAN Augmented';
      case 'VAE':
        return 'VAE Augmented';
      default:
        return methodId;
    }
  };

  // 构建多个数据集用于叠加显示
  const chartDatasets = datasets.map((dataset, index) => {
    const methodId = selectedMethods[index];
    const colors = methodColors[methodId] || methodColors['none'];

    return {
      label: `通道 ${channel} - ${getMethodName(methodId)}`,
      data: dataset.data,
      borderColor: colors.border,
      backgroundColor: colors.background,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.1,
      fill: false // 多条线叠加时不填充，避免遮挡
    };
  });

  const chartData = {
    labels: datasets[0]?.labels || [],
    datasets: chartDatasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: `Motor Imagery EEG Waveform - Channel ${channel} (${selectedMethods.length} Methods Comparison)`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            const methodName = getMethodName(selectedMethods[context.datasetIndex]);
            return `${methodName}: ${context.parsed.y.toFixed(2)} μV`;
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
          font: {
            size: 12
          }
        },
        ticks: {
          maxTicksLimit: 10,
          font: {
            size: 10
          }
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Amplitude (μV)',
          font: {
            size: 12
          }
        },
        ticks: {
          font: {
            size: 10
          }
        }
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default EEGChart;
