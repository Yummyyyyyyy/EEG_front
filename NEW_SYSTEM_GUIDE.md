# Motor Imagery EEG Data Processing & Augmentation System

## System Overview

A comprehensive EEG data processing and augmentation system with three-panel layout for advanced Brain-Computer Interface research.

**Development Server:** http://localhost:3001/

---

## System Architecture

### Layout Structure

```
┌────────────────────────────────────────────────────────────────┐
│                         TOOLBAR                                 │
│  [Mode Toggle] [Subject Selector] [Channel Selector] [View]   │
├──────────────┬─────────────────────────────┬──────────────────┤
│              │                             │                  │
│  LEFT PANEL  │      MIDDLE PANEL          │   RIGHT PANEL    │
│   (20%)      │        (50%)               │     (30%)        │
│              │                             │                  │
│  Original    │  Processed + Augmented     │  Augmentation    │
│  EEG Data    │  (Overlay Comparison)      │  Controls        │
│              │                             │                  │
└──────────────┴─────────────────────────────┴──────────────────┘
```

---

## Features

### 1. Toolbar (Top Bar)

#### Mode Selection
- **Local Mode**: Use pre-loaded simulated data (currently active)
  - 9 subjects available (Subject 1-9)
  - 22 channels per subject (Channel 1-22)
- **Upload Mode**: Upload custom EEG files (Coming soon)

#### Data Selection
- **Subject Selector**: Dropdown to select from 9 subjects
- **Channel Selector**: Dropdown to select from 22 channels
- **View Data Button**: Click to load and visualize the selected data

---

### 2. Left Panel (20% width)

**Purpose**: Display original, unprocessed EEG data

**Features**:
- Raw EEG waveform visualization
- Subject and channel information
- Sample count display
- Clean, focused view of baseline data

**Chart Details**:
- Color: Cyan (rgb(75, 192, 192))
- Filled area under curve
- Time axis: seconds
- Amplitude axis: μV (microvolts)

---

### 3. Middle Panel (50% width)

**Purpose**: Process EEG data and overlay augmented comparisons

**Processing Controls** (Top buttons):

1. **Remove EOG Button**
   - Removes Eye Movement artifacts (EOG) from the signal
   - Simulates ICA or regression-based artifact removal
   - Reduces high-amplitude eye movement interference
   - Click to toggle on/off

2. **Extract MI Segment Button**
   - Extracts Motor Imagery segment (50%-75% of data)
   - Focuses on the active MI period
   - Useful for classification tasks
   - Click to toggle on/off

**Visualization**:
- **Blue Line (Solid)**: Processed EEG data
  - Shows result after EOG removal and/or MI extraction
  - Base reference for comparing augmentations

- **Colored Dashed Lines**: Augmented data from selected methods
  - Overlaid on the same chart for direct comparison
  - Each method has unique color coding
  - Enables visual assessment of similarity to processed data

**Status Indicators**:
- Sample count
- Number of active augmentations
- Processing status badges (EOG Removed, MI Segment)

---

### 4. Right Panel (30% width)

**Purpose**: Control data augmentation methods

**Augmentation Methods** (4 buttons):

1. **VAE (Variational Autoencoder)**
   - Color: Cyan (rgb(75, 192, 192))
   - Method: Smooth reconstruction with latent space encoding
   - Characteristics: Gentle enhancement, good for denoising

2. **TCN (Temporal Convolutional Network)**
   - Color: Orange (rgb(255, 159, 64))
   - Method: Preserves temporal structure with convolutional kernels
   - Characteristics: Maintains sequential patterns

3. **GAN (Generative Adversarial Network)**
   - Color: Pink (rgb(255, 99, 132))
   - Method: Enhanced features through adversarial training
   - Characteristics: Stronger augmentation, more variation

4. **Diffusion (Diffusion Model)**
   - Color: Purple (rgb(153, 102, 255))
   - Method: Gradual denoising process
   - Characteristics: High-quality generation, smooth results

**Functionality**:
- Click any button to activate/deactivate augmentation
- Multiple methods can be active simultaneously
- Augmented lines appear as dashed overlays in middle panel
- Active status shown at bottom with color-coded badges

**Method Descriptions**:
- Brief explanation of each method
- Helps users understand augmentation approaches

---

## Workflow Guide

### Basic Workflow

1. **Select Subject and Channel**
   ```
   Toolbar → Subject Dropdown → Choose Subject 1-9
   Toolbar → Channel Dropdown → Choose Channel 1-22
   ```

2. **Load Data**
   ```
   Click "View Data" button
   Wait for loading (~300ms)
   ```

3. **View Original Data**
   ```
   Check Left Panel → Original EEG waveform displayed
   ```

4. **Process Data (Optional)**
   ```
   Middle Panel → Click "Remove EOG" (if needed)
   Middle Panel → Click "Extract MI Segment" (if needed)
   ```

5. **Compare Augmentation Methods**
   ```
   Right Panel → Click VAE button
   Right Panel → Click GAN button
   Right Panel → Click other methods as desired
   Middle Panel → Compare dashed lines with solid processed line
   ```

6. **Analyze Results**
   ```
   Observe which augmentation method produces data most similar to processed/original
   Compare amplitude, frequency, and temporal patterns
   ```

---

## Use Cases

### Case 1: Basic Data Inspection
**Goal**: View raw EEG data from different subjects/channels

1. Select Subject 1, Channel 1
2. Click View Data
3. Observe left panel for original waveform
4. Change to different channels/subjects to explore dataset

### Case 2: Artifact Removal Evaluation
**Goal**: See how EOG removal affects the signal

1. Load data (e.g., Subject 5, Channel 10)
2. Note the original waveform (left panel)
3. Click "Remove EOG" in middle panel
4. Compare blue processed line with cyan original (left panel)
5. Observe reduction in high-amplitude spikes

### Case 3: MI Segment Extraction
**Goal**: Extract and focus on motor imagery period

1. Load full EEG trial
2. Click "Extract MI Segment"
3. Note the reduced time range (50%-75% of original)
4. Use this for classification preprocessing

### Case 4: Augmentation Method Comparison
**Goal**: Compare all four augmentation approaches

1. Load and process data (with or without EOG removal)
2. Click all four augmentation buttons (VAE, TCN, GAN, Diffusion)
3. Observe middle panel with 5 overlaid lines:
   - 1 solid blue (processed)
   - 4 dashed colored (augmented)
4. Analyze which method best preserves signal characteristics
5. Evaluate amplitude matching, frequency preservation, noise levels

### Case 5: Full Pipeline Test
**Goal**: Run complete preprocessing and augmentation pipeline

1. Select subject and channel
2. Load data
3. Remove EOG artifacts
4. Extract MI segment
5. Apply all augmentation methods
6. Compare final augmented results with processed base signal

---

## Technical Specifications

### Data Characteristics

- **Sampling Rate**: 250 Hz
- **Signal Length**: 2000 samples (8 seconds)
- **After MI Extraction**: 500 samples (2 seconds)
- **Frequency Components**:
  - Alpha band (8-13 Hz)
  - Beta band (13-30 Hz)
  - Theta band (4-7 Hz)
  - Physiological noise

### Simulated Artifacts

- **EOG**: 2-5 Hz with large amplitude (~80 μV)
- **Random Spikes**: Occasional (5% probability)
- **Mixed Contribution**: 15% of EOG in original signal

### Augmentation Details

1. **VAE**:
   - Window size: 5 samples
   - Enhancement factor: 1.05x
   - Smoothing: Averaging filter

2. **TCN**:
   - Kernel size: 3 samples
   - Center weight: 0.5
   - Neighbor weights: 0.25 each
   - Enhancement: 1.1x

3. **GAN**:
   - Enhancement factor: 1.25x
   - Learned variation: ±8 μV
   - Stochastic component

4. **Diffusion**:
   - Diffusion steps: 3
   - Noise schedule: Decreasing
   - Enhancement: 1.15x

---

## Color Coding Reference

### Left Panel
- Original Data: Cyan (rgb(75, 192, 192))

### Middle Panel
- Processed Data: Blue (rgb(54, 162, 235))

### Augmentation Methods
- VAE: Cyan (rgb(75, 192, 192))
- TCN: Orange (rgb(255, 159, 64))
- GAN: Pink (rgb(255, 99, 132))
- Diffusion: Purple (rgb(153, 102, 255))

---

## Tips & Best Practices

1. **Start Simple**: Begin with one subject, one channel, no processing
2. **Compare Systematically**: Enable one augmentation at a time first
3. **Note Patterns**: Different channels show different signal characteristics
4. **Use EOG Removal**: Especially helpful for frontal channels (1-8)
5. **MI Extraction**: Reduces data but focuses on relevant period
6. **Overlay Analysis**: Dashed lines close to solid blue = good augmentation
7. **Method Selection**: Choose based on your augmentation goal:
   - VAE for denoising
   - TCN for temporal preservation
   - GAN for feature enhancement
   - Diffusion for quality generation

---

## Keyboard Shortcuts

Currently none implemented. All interactions via mouse/touch.

---

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Recommended**: Chrome for best performance

---

## Performance

- Initial Load: ~300ms
- EOG Toggle: ~300ms
- MI Toggle: ~300ms
- Augmentation Toggle: ~300ms
- Chart Rendering: <100ms

---

## Future Enhancements

- [ ] Upload custom EEG files (.edf, .csv, .mat)
- [ ] Real-time data streaming
- [ ] Export processed data
- [ ] Save/load configurations
- [ ] More augmentation methods
- [ ] Advanced filtering options
- [ ] Statistical comparison metrics
- [ ] Batch processing mode

---

## Troubleshooting

**Problem**: No data displayed after clicking View Data
- **Solution**: Check browser console for errors, refresh page

**Problem**: Charts not rendering properly
- **Solution**: Ensure browser is up-to-date, try different browser

**Problem**: Augmentation buttons disabled
- **Solution**: Must load data first by clicking "View Data"

**Problem**: Performance issues
- **Solution**: Close unused browser tabs, refresh page

---

## System Requirements

- **RAM**: 4GB minimum, 8GB recommended
- **Screen**: 1280x720 minimum, 1920x1080 recommended
- **Network**: Not required (runs locally)

---

## Credits

Developed for Advanced BCI Research
Motor Imagery EEG Processing System © 2024

---

**Enjoy exploring the EEG data processing and augmentation system!**
