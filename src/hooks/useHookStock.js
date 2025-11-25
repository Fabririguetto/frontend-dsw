import { useState, useEffect, useCallback } from 'react';
// Importamos helpers de autenticación (necesitamos getToken para el header y logout por si expira)
import { getToken, logout } from '../services/authService';

function useStock() {
  const [productos, setProductos] = useState([]);
  const [totalProductos, setTotalProductos] = useState(0);
  const [formData, setFormData] = useState({
    articulo: '',
    descripcion: '',
    cantidad: '',
    monto: '',
    idProducto: '',
  });
  const [filters, setFilters] = useState({
    estado: 'Disponible',
    nombreProducto: '',
  });
  const [sortConfig, setSortConfig] = useState({ key: 'idProducto', direction: 'ascending' });
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5); // Nota: podés subir esto a 10 o 20 por defecto

  // Función auxiliar centralizada para hacer peticiones autenticadas
  const sendRequest = async (url, method = 'GET', body = null) => {
    const token = getToken(); // Obtenemos el token del localStorage
    
    const headers = {
      'Content-Type': 'application/json',
    };

    // Si hay token, lo agregamos al header (Clave para la seguridad)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };
  
    if (body) {
      options.body = JSON.stringify(body);
    }
  
    try {
      const response = await fetch(url, options);
      
      // Manejo de sesión expirada (401 Unauthorized o 403 Forbidden)
      if (response.status === 401 || response.status === 403) {
        alert('Tu sesión ha expirado. Por favor, iniciá sesión nuevamente.');
        logout(); // Borra token y redirige al login
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la petición');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      throw error;
    }
  };

  // Usamos useCallback para que fetchProductos sea estable y no cause loops infinitos en useEffect
  const fetchProductos = useCallback(async () => {
    const nombreProducto = filters.nombreProducto || '';
    // const estado = filters.estado || ''; // (No se usa en la URL actual, pero podría servir)

    const maxLimit = 40;  
    const minLimit = 5;  // Bajé el minLimit para que coincida con tu state inicial (5)
    const validatedLimit = limit > maxLimit ? maxLimit : (limit < minLimit ? minLimit : limit);
    
    // Cálculo de paginación seguro
    const totalPages = Math.ceil(totalProductos / validatedLimit) || 1;
    const validatedPage = page >= totalPages ? totalPages - 1 : (page < 0 ? 0 : page);
  
    const url = `http://localhost:3500/stock?producto=${encodeURIComponent(nombreProducto)}&pagina=${validatedPage}&limite=${validatedLimit}`;
  
    try {
      // Usamos nuestra función segura sendRequest en lugar de fetch directo
      const data = await sendRequest(url);
      
      if (data && Array.isArray(data.productos)) {
        setProductos(data.productos);
        setTotalProductos(data.totalProductos);
      } else if (data) {
        // Si el backend devuelve vacío o estructura distinta pero válida
        setProductos([]);
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
      // Opcional: mostrar notificación de error
    }
  }, [page, limit, filters, totalProductos]); // Dependencias

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    setPage(0); // Resetear a página 1 al filtrar
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formData.idProducto ? updateProducto(formData.idProducto, formData) : createProducto(formData);
  };

  const createProducto = (producto) => {
    sendRequest('http://localhost:3500/stock', 'POST', producto)
      .then(() => {
        fetchProductos();
        resetForm();
      })
      .catch((error) => console.error('Error al ingresar el producto:', error));
  };

  const updateProducto = (id, producto) => {
    sendRequest(`http://localhost:3500/stock/${id}`, 'PUT', producto)
      .then(() => {
        fetchProductos();
        resetForm();
      })
      .catch((error) => console.error('Error al actualizar el producto:', error));
  };

  const resetForm = () => {
    setFormData({ articulo: '', descripcion: '', cantidad: '', monto: '', idProducto: '' });
  };

  const handleEdit = (producto) => {
    setFormData({
      idProducto: producto.idProducto,
      articulo: producto.articulo,
      descripcion: producto.descripcion,
      cantidad: producto.cantidad,
      monto: producto.monto,
    });
  };

  // Para eliminar un producto (baja lógica)
  const handleElim = (idProducto, estadoActual) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas cambiar el estado de este producto?');
    if (confirmDelete) {
      // En el backend definimos PUT /stockelim/:id para cambiar estado
      sendRequest(`http://localhost:3500/stockelim/${idProducto}`, 'PUT', { estado: estadoActual })
        .then(() => fetchProductos())
        .catch((error) => console.error('Error al eliminar el producto:', error));
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedProductos = [...productos].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  return {
    sortedProductos,
    formData,
    filters,
    handleInputChange,
    handleFilterChange,
    handleSubmit,
    handleEdit,
    handleElim,
    requestSort,
    resetForm,
    page,
    limit,
    setPage,
    setLimit,
    totalProductos,
  };
}

export default useStock;