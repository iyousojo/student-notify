const API_URL = 'https://student-notification-system-1.onrender.com/api';

// Helper to get headers
const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

/**
 * Fetch Home Feed: Department & Faculty updates only
 * (Excludes general school-wide announcements)
 */
export const getHomeNotifications = async () => {
  const response = await fetch(`${API_URL}/notifications`, {
    method: 'GET',
    headers: getHeaders()
  });

  if (!response.ok) throw new Error('Failed to fetch notifications');
  
  const result = await response.json();
  const allData = result.data || [];

  // Filter: Exclude items where target.role is "All"
  return allData.filter(item => item.target?.role !== 'All');
};

/**
 * Fetch Official Board: General School announcements only
 */
export const getOfficialAnnouncements = async () => {
  const response = await fetch(`${API_URL}/notifications`, {
    method: 'GET',
    headers: getHeaders()
  });

  if (!response.ok) throw new Error('Failed to fetch announcements');

  const result = await response.json();
  const allData = result.data || [];

  // Filter: Only items where target.role is "All"
  return allData.filter(item => item.target?.role === 'All');
};