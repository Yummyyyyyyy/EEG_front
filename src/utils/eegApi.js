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
