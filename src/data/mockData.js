// 生成模拟EEG数据的工具函数

// 简单的伪随机数生成器（使用种子确保可重现）
const seededRandom = (seed) => {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};

// 生成基础EEG信号（使用多个正弦波叠加模拟真实EEG）
const generateBaseEEGSignal = (length, frequency, amplitude, phase = 0, seed = 12345) => {
  const signal = [];
  const random = seededRandom(seed);

  for (let i = 0; i < length; i++) {
    // 混合多个频率成分来模拟真实EEG信号
    const alpha = amplitude * Math.sin(2 * Math.PI * frequency * i / 250 + phase); // Alpha波段 (8-13 Hz)
    const beta = (amplitude * 0.5) * Math.sin(2 * Math.PI * (frequency * 2) * i / 250 + phase); // Beta波段
    const noise = (random() - 0.5) * amplitude * 0.3; // 添加可重现的噪声
    signal.push(alpha + beta + noise);
  }
  return signal;
};

// 为不同的运动想象任务生成特征化的EEG数据
const generateMotorImageryEEG = (channel, task, length = 1000, seed = 12345) => {
  let frequency, amplitude, phase;

  // 根据通道和任务类型设置不同的参数
  switch (task) {
    case 'left':
      frequency = 10 + channel * 0.5; // 左手运动想象
      amplitude = 50 + channel * 5;
      phase = Math.PI / 4;
      break;
    case 'right':
      frequency = 12 + channel * 0.5; // 右手运动想象
      amplitude = 45 + channel * 4;
      phase = Math.PI / 3;
      break;
    case 'foot':
      frequency = 8 + channel * 0.5; // 脚部运动想象
      amplitude = 40 + channel * 3;
      phase = Math.PI / 6;
      break;
    default:
      frequency = 10;
      amplitude = 50;
      phase = 0;
  }

  return generateBaseEEGSignal(length, frequency, amplitude, phase, seed);
};

// 模拟GAN数据增强效果
const applyGANAugmentation = (originalData) => {
  return originalData.map(value => {
    // GAN增强：增加信号幅度，减少噪声，使特征更明显
    const enhanced = value * 1.3;
    const smoothed = enhanced + (Math.random() - 0.5) * 5; // 减少噪声
    return smoothed;
  });
};

// 模拟VAE数据增强效果
const applyVAEAugmentation = (originalData) => {
  return originalData.map((value, index) => {
    // VAE增强：平滑信号，保持整体分布
    const smoothWindow = 3;
    let sum = value;
    let count = 1;

    for (let i = 1; i <= smoothWindow; i++) {
      if (index - i >= 0) {
        sum += originalData[index - i];
        count++;
      }
      if (index + i < originalData.length) {
        sum += originalData[index + i];
        count++;
      }
    }

    const smoothed = sum / count;
    return smoothed * 1.15 + (Math.random() - 0.5) * 3;
  });
};

// 生成分类结果（基于数据特征模拟分类概率）
const generateClassificationResult = (data, augmentMethod) => {
  // 计算信号特征
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  const amplitude = Math.max(...data) - Math.min(...data);

  // 基于特征生成分类概率
  let leftProb, rightProb, footProb;

  if (augmentMethod === 'GAN') {
    // GAN增强后的分类结果（较高置信度）
    if (amplitude > 200) {
      rightProb = 0.75 + Math.random() * 0.15;
      leftProb = 0.15 + Math.random() * 0.05;
      footProb = 0.05 + Math.random() * 0.05;
    } else if (amplitude > 150) {
      leftProb = 0.72 + Math.random() * 0.15;
      rightProb = 0.18 + Math.random() * 0.05;
      footProb = 0.05 + Math.random() * 0.05;
    } else {
      footProb = 0.70 + Math.random() * 0.15;
      leftProb = 0.15 + Math.random() * 0.08;
      rightProb = 0.10 + Math.random() * 0.07;
    }
  } else if (augmentMethod === 'VAE') {
    // VAE增强后的分类结果（中等置信度）
    if (amplitude > 200) {
      rightProb = 0.65 + Math.random() * 0.15;
      leftProb = 0.20 + Math.random() * 0.08;
      footProb = 0.10 + Math.random() * 0.07;
    } else if (amplitude > 150) {
      leftProb = 0.68 + Math.random() * 0.12;
      rightProb = 0.20 + Math.random() * 0.08;
      footProb = 0.08 + Math.random() * 0.05;
    } else {
      footProb = 0.62 + Math.random() * 0.15;
      leftProb = 0.22 + Math.random() * 0.08;
      rightProb = 0.12 + Math.random() * 0.08;
    }
  } else {
    // 原始数据分类结果（较低置信度）
    if (amplitude > 200) {
      rightProb = 0.50 + Math.random() * 0.15;
      leftProb = 0.30 + Math.random() * 0.10;
      footProb = 0.15 + Math.random() * 0.10;
    } else if (amplitude > 150) {
      leftProb = 0.52 + Math.random() * 0.15;
      rightProb = 0.28 + Math.random() * 0.10;
      footProb = 0.15 + Math.random() * 0.10;
    } else {
      footProb = 0.48 + Math.random() * 0.15;
      leftProb = 0.30 + Math.random() * 0.10;
      rightProb = 0.18 + Math.random() * 0.10;
    }
  }

  // 归一化概率
  const total = leftProb + rightProb + footProb;
  leftProb = (leftProb / total) * 100;
  rightProb = (rightProb / total) * 100;
  footProb = (footProb / total) * 100;

  return {
    left: leftProb.toFixed(2),
    right: rightProb.toFixed(2),
    foot: footProb.toFixed(2)
  };
};

// 导出函数
export const getMockEEGData = (channel, augmentMethod = 'none') => {
  // 根据通道选择一个任务类型来生成数据
  const tasks = ['left', 'right', 'foot'];
  const taskType = tasks[channel % 3];

  // 使用通道号作为种子，确保同一通道的不同增强方法使用相同的基础信号
  const seed = channel * 1000;

  // 生成原始数据（基于相同种子）
  let baseData = generateMotorImageryEEG(channel, taskType, 1000, seed);
  let data;

  // 应用数据增强
  if (augmentMethod === 'GAN') {
    data = applyGANAugmentation(baseData);
  } else if (augmentMethod === 'VAE') {
    data = applyVAEAugmentation(baseData);
  } else {
    data = baseData;
  }

  // 生成时间轴标签（假设采样率250Hz）
  const labels = data.map((_, index) => (index / 250).toFixed(3));

  // 生成分类结果
  const classification = generateClassificationResult(data, augmentMethod);

  return {
    labels,
    data,
    classification
  };
};

// Get all channel list
export const getChannels = () => {
  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Channel ${i + 1}`
  }));
};

// Get data augmentation method list
export const getAugmentMethods = () => {
  return [
    { id: 'none', name: 'Original Data' },
    { id: 'GAN', name: 'GAN Augmented' },
    { id: 'VAE', name: 'VAE Augmented' }
  ];
};
