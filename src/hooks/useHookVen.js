import { useState, useEffect, useCallback } from 'react';
import { getToken, logout } from '../services/authService';

const useVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [error, setError] = useState(null);

  const fetchVentas = useCallback(async (filtro = '') => {
    const token = getToken();
    
    const url = filtro 
      ? `http://localhost:3500/ventas?filtro=${encodeURIComponent(filtro)}`
      : 'http://localhost:3500/ventas';

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }

      const data = await response.json();
      
      setVentas(Array.isArray(data) ? data : []);
      
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor');
      setVentas([]);
    }
  }, []);

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  return { 
    ventas, 
    fetchVentas,
    error 
  };
};

export default useVentas;