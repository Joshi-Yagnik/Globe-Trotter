import { getAccessToken } from './supabase';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetch wrapper for FastAPI backend with auth headers.
 */
async function apiFetch(endpoint, options = {}) {
  const token = await getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ── Destinations ──
export const getDestinations = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/api/destinations?${query}`);
};

export const getDestination = (id) => apiFetch(`/api/destinations/${id}`);

// ── Trips ──
export const getTrips = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/api/trips?${query}`);
};

export const createTrip = (data) =>
  apiFetch('/api/trips', { method: 'POST', body: JSON.stringify(data) });

export const getTrip = (id) => apiFetch(`/api/trips/${id}`);

export const updateTrip = (id, data) =>
  apiFetch(`/api/trips/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteTrip = (id) =>
  apiFetch(`/api/trips/${id}`, { method: 'DELETE' });

export const updateTripStatus = (id, status) =>
  apiFetch(`/api/trips/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

// ── Sections ──
export const createSection = (data) =>
  apiFetch('/api/sections', { method: 'POST', body: JSON.stringify(data) });

export const updateSection = (id, data) =>
  apiFetch(`/api/sections/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteSection = (id) =>
  apiFetch(`/api/sections/${id}`, { method: 'DELETE' });

// ── Activities ──
export const getActivities = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/api/activities?${query}`);
};

// ── Community ──
export const getCommunityPosts = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/api/community?${query}`);
};

export const createCommunityPost = (data) =>
  apiFetch('/api/community', { method: 'POST', body: JSON.stringify(data) });

// ── Profile ──
export const getProfile = () => apiFetch('/api/profile');
export const updateProfile = (data) =>
  apiFetch('/api/profile', { method: 'PUT', body: JSON.stringify(data) });

// ── Calendar ──
export const getCalendar = (year, month) =>
  apiFetch(`/api/calendar?year=${year}&month=${month}`);

// ── Admin ──
export const getAdminAnalytics = () => apiFetch('/api/admin/analytics');

// ── AI ──
export const getAISuggestions = (data) =>
  apiFetch('/api/ai/suggestions', { method: 'POST', body: JSON.stringify(data) });
