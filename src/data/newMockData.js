// Generate mock EEG data for the new system structure

// Simple seeded random number generator
const seededRandom = (seed) => {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};

// Generate base EEG signal
const generateBaseEEGSignal = (length, frequency, amplitude, phase = 0, seed = 12345) => {
  const signal = [];
  const random = seededRandom(seed);

  for (let i = 0; i < length; i++) {
    // Mix multiple frequency components to simulate real EEG
    const alpha = amplitude * Math.sin(2 * Math.PI * frequency * i / 250 + phase);
    const beta = (amplitude * 0.5) * Math.sin(2 * Math.PI * (frequency * 2) * i / 250 + phase);
    const theta = (amplitude * 0.3) * Math.sin(2 * Math.PI * (frequency * 0.6) * i / 250 + phase);
    const noise = (random() - 0.5) * amplitude * 0.25;
    signal.push(alpha + beta + theta + noise);
  }
  return signal;
};

// Generate original EEG data for a specific subject and channel
export const generateOriginalEEG = (subject, channel, length = 2000) => {
  // Use subject and channel to create unique seed
  const seed = subject * 10000 + channel * 100;

  // Different subjects have different baseline characteristics
  const subjectVariation = (subject - 1) * 2;
  const channelVariation = (channel - 1) * 0.3;

  const frequency = 10 + subjectVariation + channelVariation;
  const amplitude = 45 + subject * 3 + channel * 0.5;
  const phase = (subject * Math.PI / 9) + (channel * Math.PI / 22);

  const data = generateBaseEEGSignal(length, frequency, amplitude, phase, seed);
  const labels = data.map((_, index) => (index / 250).toFixed(3));

  return { data, labels };
};

// Simulate EOG (Eye movement) artifact - typically larger amplitude, lower frequency
const generateEOGArtifact = (length, seed) => {
  const random = seededRandom(seed);
  const artifact = [];

  for (let i = 0; i < length; i++) {
    // EOG is typically 2-5 Hz with larger amplitude
    const eogComponent = 80 * Math.sin(2 * Math.PI * 3 * i / 250);
    const randomSpike = (random() > 0.95) ? (random() - 0.5) * 200 : 0; // Occasional large spikes
    artifact.push(eogComponent + randomSpike);
  }

  return artifact;
};

// Remove EOG from EEG data (simulate ICA or regression-based removal)
export const removeEOG = (originalData, subject, channel) => {
  const seed = subject * 10000 + channel * 100 + 1;
  const eogArtifact = generateEOGArtifact(originalData.length, seed);

  // Simulate EOG removal by subtracting estimated artifact with some attenuation
  const cleaned = originalData.map((value, index) => {
    const artifactContribution = eogArtifact[index] * 0.15; // 15% of EOG mixed in original
    return value - artifactContribution;
  });

  return cleaned;
};

// Extract MI (Motor Imagery) segment - 50% to 75% of the data
export const extractMISegment = (data) => {
  const startIdx = Math.floor(data.length * 0.5);
  const endIdx = Math.floor(data.length * 0.75);
  return data.slice(startIdx, endIdx);
};

// VAE Augmentation - smooth and slightly enhance
export const applyVAEAugmentation = (data) => {
  const augmented = [];
  const windowSize = 5;

  for (let i = 0; i < data.length; i++) {
    let sum = data[i];
    let count = 1;

    for (let j = 1; j <= windowSize; j++) {
      if (i - j >= 0) {
        sum += data[i - j];
        count++;
      }
      if (i + j < data.length) {
        sum += data[i + j];
        count++;
      }
    }

    const smoothed = sum / count;
    augmented.push(smoothed * 1.05); // Slight enhancement
  }

  return augmented;
};

// TCN (Temporal Convolutional Network) Augmentation - preserve temporal structure
export const applyTCNAugmentation = (data) => {
  const augmented = [];
  const kernelSize = 3;

  for (let i = 0; i < data.length; i++) {
    let value = data[i] * 0.5; // Center weight

    if (i > 0) value += data[i - 1] * 0.25;
    if (i < data.length - 1) value += data[i + 1] * 0.25;

    augmented.push(value * 1.1); // Slight enhancement
  }

  return augmented;
};

// GAN Augmentation - enhance features and add variation
export const applyGANAugmentation = (data) => {
  const random = seededRandom(12345);

  return data.map(value => {
    const enhanced = value * 1.25; // Stronger enhancement
    const variation = (random() - 0.5) * 8; // Add learned variation
    return enhanced + variation;
  });
};

// Diffusion Model Augmentation - gradual denoising process
export const applyDiffusionAugmentation = (data) => {
  const random = seededRandom(54321);

  // Simulate diffusion denoising - smooth with controlled noise
  const augmented = [];
  const diffusionSteps = 3;

  for (let i = 0; i < data.length; i++) {
    let value = data[i];

    // Apply diffusion-like smoothing
    for (let step = 0; step < diffusionSteps; step++) {
      const noise = (random() - 0.5) * 3 * (1 - step / diffusionSteps);
      value = value * 0.9 + data[i] * 0.1 + noise;
    }

    augmented.push(value * 1.15);
  }

  return augmented;
};

// Generate trials for a subject/channel combination
export const generateTrials = (subject, channel, numTrials = 20) => {
  const labels = ['left', 'right', 'foot', 'tongue'];
  const trials = [];

  for (let i = 1; i <= numTrials; i++) {
    // Distribute labels evenly
    const label = labels[(i - 1) % labels.length];

    trials.push({
      id: i,
      subject,
      channel,
      label
    });
  }

  return trials;
};

// Get EEG data for a specific trial
export const getTrialData = (trial) => {
  const seed = trial.subject * 10000 + trial.channel * 100 + trial.id;

  // Generate data based on trial label
  const { data, labels } = generateOriginalEEG(trial.subject, trial.channel, 2000);

  return {
    original: { data, labels },
    trialInfo: trial
  };
};

// Simulate EEGNet classification prediction
export const predictWithEEGNet = (data, method, trueLabel) => {
  // Simulate prediction accuracy based on method
  const accuracyMap = {
    'original': 0.65,
    'vae': 0.72,
    'tcn': 0.75,
    'gan': 0.78,
    'diffusion': 0.80
  };

  const accuracy = accuracyMap[method] || 0.65;
  const labels = ['left', 'right', 'foot', 'tongue'];

  // Simulate correct or incorrect prediction
  const isCorrect = Math.random() < accuracy;

  let predicted;
  if (isCorrect) {
    predicted = trueLabel;
  } else {
    // Pick a wrong label
    const wrongLabels = labels.filter(l => l !== trueLabel);
    predicted = wrongLabels[Math.floor(Math.random() * wrongLabels.length)];
  }

  return {
    method,
    methodName: method.toUpperCase(),
    predicted,
    correct: predicted === trueLabel,
    confidence: (0.7 + Math.random() * 0.25).toFixed(2)
  };
};

// Get available subjects
export const getSubjects = () => {
  return Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    name: `Subject ${i + 1}`
  }));
};

// Get available channels
export const getChannels = () => {
  return Array.from({ length: 22 }, (_, i) => ({
    id: i + 1,
    name: `Channel ${i + 1}`
  }));
};

// Get augmentation methods for the new system
export const getAugmentationMethods = () => {
  return [
    { id: 'vae', name: 'VAE', color: 'rgb(75, 192, 192)' },
    { id: 'tcn', name: 'TCN', color: 'rgb(255, 159, 64)' },
    { id: 'gan', name: 'GAN', color: 'rgb(255, 99, 132)' },
    { id: 'diffusion', name: 'Diffusion', color: 'rgb(153, 102, 255)' }
  ];
};

// Main function to get processed data
export const getProcessedEEGData = (subject, channel, options = {}) => {
  const {
    removeEOGFlag = false,
    extractMIFlag = false,
    augmentationMethods = []
  } = options;

  // Generate original data
  let { data: originalData, labels: originalLabels } = generateOriginalEEG(subject, channel);

  // Step 1: Remove EOG if requested
  let processedData = removeEOGFlag ? removeEOG(originalData, subject, channel) : [...originalData];

  // Step 2: Extract MI segment if requested
  if (extractMIFlag) {
    processedData = extractMISegment(processedData);
    const startIdx = Math.floor(originalLabels.length * 0.5);
    const endIdx = Math.floor(originalLabels.length * 0.75);
    originalLabels = originalLabels.slice(startIdx, endIdx);
  }

  // Step 3: Apply augmentation methods
  const augmentedDatasets = augmentationMethods.map(method => {
    let augmentedData;

    switch (method) {
      case 'vae':
        augmentedData = applyVAEAugmentation(processedData);
        break;
      case 'tcn':
        augmentedData = applyTCNAugmentation(processedData);
        break;
      case 'gan':
        augmentedData = applyGANAugmentation(processedData);
        break;
      case 'diffusion':
        augmentedData = applyDiffusionAugmentation(processedData);
        break;
      default:
        augmentedData = [...processedData];
    }

    return {
      method,
      data: augmentedData
    };
  });

  return {
    original: {
      data: originalData,
      labels: Array.from({ length: originalData.length }, (_, i) => (i / 250).toFixed(3))
    },
    processed: {
      data: processedData,
      labels: originalLabels
    },
    augmented: augmentedDatasets
  };
};
