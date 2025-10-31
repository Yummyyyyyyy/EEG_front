const DEFAULT_BASE_URL = 'http://localhost:8000';

const getBaseUrl = () => {
  const envUrl = import.meta.env?.VITE_API_BASE_URL;
  if (!envUrl) {
    return DEFAULT_BASE_URL;
  }
  return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
};

const handleResponse = async (response) => {
  const rawText = await response.text();

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    if (rawText) {
      try {
        const parsed = JSON.parse(rawText);
        if (parsed?.detail) {
          message = Array.isArray(parsed.detail)
            ? parsed.detail.map((item) => item?.msg ?? item).join(', ')
            : parsed.detail;
        } else if (parsed?.message) {
          message = parsed.message;
        }
      } catch {
        message = rawText;
      }
    }

    throw new Error(message);
  }

  if (!rawText) {
    return null;
  }

  try {
    return JSON.parse(rawText);
  } catch (error) {
    throw new Error('Failed to parse server response.');
  }
};

export const fetchTrials = async ({ subject, motionType } = {}) => {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/trials`);

  if (subject) {
    url.searchParams.append('subject', subject);
  }

  if (motionType) {
    url.searchParams.append('motionType', motionType);
  }

  const response = await fetch(url.toString());
  const payload = await handleResponse(response);
  return payload?.data ?? [];
};

export const fetchTrialEEGData = async (
  trialId,
  { removeEOG = true, extractMI = false } = {}
) => {
  if (!trialId) {
    throw new Error('trialId is required to fetch EEG data.');
  }

  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/trials/${trialId}/eeg-data`);
  url.searchParams.append('removeEOG', removeEOG ? 'true' : 'false');
  url.searchParams.append('extractMI', extractMI ? 'true' : 'false');

  const response = await fetch(url.toString());
  const payload = await handleResponse(response);
  return payload?.data ?? {};
};

export const generateAugmentedData = async (
  trialId,
  methods,
  eegData,
  count = 10
) => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/augmentation/generate`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      trialId,
      methods,
      eegData,
      count
    })
  });

  const payload = await handleResponse(response);
  return payload?.data ?? {};
};

export const downloadAugmentationData = async ({
  motionType,
  method,
  numSamples,
  fileType
}) => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/augmentation/download`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      motionType,
      method,
      numSamples,
      fileType
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = `Download failed with status ${response.status}`;

    try {
      const parsed = JSON.parse(errorText);
      if (parsed?.detail) {
        message = parsed.detail;
      }
    } catch {
      message = errorText || message;
    }

    throw new Error(message);
  }

  // Get filename from Content-Disposition header
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = `${method}_${motionType}_${numSamples}.${fileType}`;

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename=(.+)/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1];
    }
  }

  // Get blob from response
  const blob = await response.blob();

  // Create download link
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);

  return { success: true, filename };
};

export const fetchClassification = async (
  trialId,
  motionType,
  numTrials = 10
) => {
  if (!trialId) {
    throw new Error('trialId is required to fetch classification.');
  }

  if (!motionType) {
    throw new Error('motionType is required to fetch classification.');
  }

  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/classification/${trialId}`);
  url.searchParams.append('motionType', motionType);
  url.searchParams.append('numTrials', numTrials);

  const response = await fetch(url.toString());
  const payload = await handleResponse(response);
  return payload?.data ?? null;
};
