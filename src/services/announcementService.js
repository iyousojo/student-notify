const API_URL = 'https://student-notification-system-1.onrender.com/api';

export const getAnnouncements = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/announcements`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch announcements');
  }

  return response.json();
};