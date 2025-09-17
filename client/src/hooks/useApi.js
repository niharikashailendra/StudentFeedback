
import { useState } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async (apiCall, onSuccess, onError) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (err) {
      console.error('API Error:', err);
      setError(err);
      
      // Don't handle 403 here - let the interceptor handle it
      if (err.response?.status !== 403 && onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { callApi, loading, error };
};