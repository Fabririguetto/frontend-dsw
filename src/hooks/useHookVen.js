import { useState, useEffect, useCallback, useMemo } from 'react';
import { getToken, logout } from '../services/authService';

const useVentas = () => {
  const [ventas, setVentas] = useState([]);
  
  // Estados para paginación (Igual que en useStock)
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20); // Filas por página por defecto
  const [totalVentas, setTotalVentas] = useState(0); // Total de registros en BD
  const [totalPages, setTotalPages] = useState(0);
  
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'idVenta', direction: 'descending' });

  // fetchVentas ahora utiliza los estados 'page' y 'limit'
  const fetchVentas = useCallback(async (filtro = '') => {
    const token = getToken();
    
    // Construcción de parámetros URL
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
      
      // Manejo de la respuesta paginada del backend
      // Se espera: { ventas: [], totalVentas: N, totalPages: M }
      if (data.ventas && Array.isArray(data.ventas)) {
        setVentas(data.ventas);
        setTotalVentas(data.totalVentas || 0); 
        setTotalPages(data.totalPages || 0);
      } else if (Array.isArray(data)) {
        // Fallback por si el backend devuelve array simple
        setVentas(data);
        setTotalVentas(data.length);
        setTotalPages(1);
      } else {
        setVentas([]);
        setTotalVentas(0);
        setTotalPages(0);
      }
      
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor');
      setVentas([]);
    }
  }, [page, limit]); // Se ejecuta de nuevo si cambia la página o el límite

  // Lógica de Ordenamiento (Cliente)
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedVentas = useMemo(() => {
    let itemsOrdenados = [...ventas];
    if (sortConfig.key !== null) {
      itemsOrdenados.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (!isNaN(Number(valA)) && !isNaN(Number(valB))) {
            valA = Number(valA);
            valB = Number(valB);
        } else {
              valA = valA ? valA.toString().toLowerCase() : '';
              valB = valB ? valB.toString().toLowerCase() : '';
        }

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return itemsOrdenados;
  }, [ventas, sortConfig]);

  return { 
    ventas: sortedVentas,
    totalVentas,
    totalPages,
    page,       
    setPage,    
    limit,      
    setLimit,   
    fetchVentas,
    requestSort,
    sortConfig,
    error 
  };
};

export default useVentas;