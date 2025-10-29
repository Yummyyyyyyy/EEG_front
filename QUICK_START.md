# Motor Imagery EEG Data Visualization System - Quick Start Guide

## System is Running

Development server is live at: **http://localhost:3001/**

## New Feature: Multi-Method Overlay Comparison

### Key Improvements

1. **Multi-Select Augmentation Methods**
   - You can now select multiple data augmentation methods simultaneously
   - All selected methods are overlaid on the same chart
   - Easily compare the effects of different augmentation methods

2. **Unified Base Signal**
   - All augmentation methods are based on the same original EEG signal
   - Ensures fairness and consistency in comparisons
   - Uses seeded random generation for reproducibility

3. **Color Coding**
   - Original Data: Cyan (rgb(75, 192, 192))
   - GAN Augmented: Pink (rgb(255, 99, 132))
   - VAE Augmented: Blue (rgb(54, 162, 235))

## How to Use

### 1. Select a Channel
Click on any channel button (Channel 1-8) to view that EEG channel.

### 2. Select Multiple Augmentation Methods for Comparison
- Click any augmentation method button to select/deselect it
- You can select 1-3 methods simultaneously for comparison
- Selected methods will display a checkmark (✓)
- The bottom shows the number of methods selected

### 3. View Overlaid Chart
- The chart displays EEG waveforms for all selected methods
- Different colors represent different augmentation methods
- Hover over the chart to view specific values
- Legend shows which curve corresponds to each method

### 4. Compare Classification Results
- Right panel displays classification results for each method
- Compare how different augmentation methods affect classification accuracy
- Each method shows independently:
  - Most likely motion type
  - Probability distribution for three motion types
  - Intuitive progress bars

## Typical Use Cases

### Scenario 1: Compare Original vs Augmented Data
1. Select "Original Data"
2. Select "GAN Augmented"
3. Observe how GAN augmentation changes signal features
4. Compare classification accuracy between both methods

### Scenario 2: Compare Two Augmentation Methods
1. Select "GAN Augmented"
2. Select "VAE Augmented"
3. Compare differences between the two augmentation algorithms
4. Analyze which method performs better

### Scenario 3: Comprehensive Comparison
1. Select all three methods simultaneously
2. View complete comparison on the same chart
3. Comprehensively evaluate pros and cons of each method

## Technical Details

### Data Generation
- Sampling Rate: 250 Hz
- Signal Length: 1000 samples (4 seconds)
- Frequency Components: Alpha band (8-13 Hz) + Beta band
- Uses seeding for reproducibility

### GAN Augmentation Features
- Enhances signal amplitude (1.3x)
- Reduces noise
- Improves classification confidence (typically 70%+)

### VAE Augmentation Features
- Smooths signal (3-point window)
- Preserves overall distribution
- Moderate amplitude enhancement (1.15x)
- Medium classification confidence (typically 62-68%)

## Quick Actions

- Switch Channel: Click different channel buttons
- Add Comparison: Click unselected method
- Remove Comparison: Click selected method (keep at least 1)
- Select All: Click all method buttons sequentially

## System Requirements

- Modern browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Recommended screen resolution: 1280x720 or higher

## Tips

1. In multi-select mode, chart doesn't fill background color to avoid overlap
2. Different methods for the same channel use the same base signal
3. Classification results are automatically calculated based on signal features
4. You can change selections anytime - the system updates immediately

## Future Development Suggestions

- Add data export functionality
- Support uploading real EEG data files
- Add more signal processing algorithms
- Implement time-frequency analysis (STFT, Wavelet Transform)
- Support real-time data streaming

---

Enjoy using the EEG Data Visualization System!
