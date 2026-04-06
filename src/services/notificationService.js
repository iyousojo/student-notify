const API_URL = 'https://student-notification-system-1.onrender.com/api';

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

/**
 * Fetch Home Feed: Filters out global "All" announcements
 */
export const getHomeNotifications = async () => {
  try {
    const response = await fetch(`${API_URL}/notifications`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch notifications');
    
    const result = await response.json();
    const allData = result.data || result || [];

    // Home feed is for specific Faculty/Dept targets only
    return allData.filter(item => item.target?.role !== 'All');
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

/**
 * Fetch Official Board: Only shows global school announcements
 */
export const getOfficialAnnouncements = async () => {
  try {
    const response = await fetch(`${API_URL}/notifications`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch announcements');

    const result = await response.json();
    const allData = result.data || result || [];

    // Official board is for items where role target is "All"
    return allData.filter(item => item.target?.role === 'All');
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

/**
 * Bookmark an item
 */
export const toggleBookmark = async (itemId, isBookmarked) => {
  const method = isBookmarked ? 'DELETE' : 'POST';
  const response = await fetch(`${API_URL}/bookmarks`, {
    method,
    headers: getHeaders(),
    body: JSON.stringify({ itemId, itemType: 'Notification' })
  });
  return response.json();
};