import { useState, useEffect, useCallback, useMemo } from 'react';
import { getToken, logout } from '../services/authService';

const useVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [sortConfig, setSortConfig] = useState({ key: 'idVenta', direction: 'descending' });

  const fetchVentas = useCallback(async (filtro = '') => {
    setLoading(true);
    const token = getToken();
    
    const params = new URLSearchParams();
    if (filtro) params.append('filtro', filtro);
    params.append('pagina', page);
    params.append('limite', limit);

    const url = `http://localhost:3500/ventas?${params.toString()}`;

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
      
      // --- CORRECCIÓN CLAVE AQUÍ ---
      if (data.ventas && Array.isArray(data.ventas)) {
          setVentas(data.ventas);
          // El backend manda "total", no "totalVentas".
          // Al corregir esto, el paginador sabrá que hay más páginas.
          setTotalVentas(data.total || 0); 
      } else if (Array.isArray(data)) {
          // Fallback por si el backend responde viejo
          setVentas(data);
          setTotalVentas(data.length);
      } else {
          setVentas([]);
          setTotalVentas(0);
      }
      
    } catch (err) {
      console.error(err);
      setError('Error de conexión');
      setVentas([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // --- LÓGICA DE ORDENAMIENTO MEJORADA ---
  const sortedVentas = useMemo(() => {
    let items = [...ventas];
    if (sortConfig.key !== null) {
      items.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        // 1. CASO ESPECIAL: FECHAS
        if (sortConfig.key === 'fechaHoraVenta') {
            // Convertimos el string a objeto Date para comparar correctamente el tiempo real
            const dateA = new Date(valA);
            const dateB = new Date(valB);
            if (dateA < dateB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (dateA > dateB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        }

        // 2. CASO NÚMEROS (Precios, IDs)
        if (!isNaN(Number(valA)) && !isNaN(Number(valB))) {
             valA = Number(valA);
             valB = Number(valB);
        } else {
             // 3. CASO TEXTO (Nombres)
             valA = valA ? valA.toString().toLowerCase() : '';
             valB = valB ? valB.toString().toLowerCase() : '';
        }

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [ventas, sortConfig]);

  return { 
    ventas: sortedVentas, 
    totalVentas,
    page, setPage, limit, setLimit, 
    fetchVentas, requestSort, sortConfig, error, loading
  };
};

export default useVentas;