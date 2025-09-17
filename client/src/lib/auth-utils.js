
export const checkAuthStatus = () => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) return null;
  
  try {
    const user = JSON.parse(userStr);
    return { token, user };
  } catch {
    return null;
  }
};

export const isUserBlocked = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('blocked_user') !== null;
};

export const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('blocked_user');
};