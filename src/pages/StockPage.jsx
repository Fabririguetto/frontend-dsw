import React, { useEffect, useState } from 'react';
import useStock from '../hooks/useHookStock';
import { getUsuarioActual } from '../services/authService';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import { IconButton, Paper, Typography } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import './StockPage.css';

function StockPage() {
  const {
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
  } = useStock();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = getUsuarioActual();
    if (user && user.rol === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  return (
    <div className="stock-container" style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom style={{ color: '#1976d2', fontWeight: 'bold' }}>
        Control de Stock
      </Typography>

      <div className="search-bar" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="nombreProducto"
          value={filters.nombreProducto}
          onChange={handleFilterChange}
          placeholder="Buscar por artículo o descripción"
          className="form-control"
          style={{ padding: '10px', width: '100%', maxWidth: '400px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>


      {isAdmin && (
        <Paper elevation={3} style={{ padding: '20px', marginBottom: '30px', backgroundColor: '#f9f9f9' }}>
          <Typography variant="h6" gutterBottom>
            {formData.idProducto ? 'Editar Producto' : 'Nuevo Producto'}
          </Typography>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              name="articulo"
              value={formData.articulo}
              onChange={handleInputChange}
              placeholder="Artículo"
              required
              style={{ padding: '8px', flex: 1 }}
            />
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción"
              required
              style={{ padding: '8px', flex: 2 }}
            />
            <input
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleInputChange}
              placeholder="Cant."
              required
              style={{ padding: '8px', width: '80px' }}
            />
            <input
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleInputChange}
              placeholder="Precio ($)"
              required
              style={{ padding: '8px', width: '100px' }}
            />
            <button type="submit" className="btn-submit" style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px' }}>
              {formData.idProducto ? 'Guardar Cambios' : 'Agregar'}
            </button>
            {formData.idProducto && (
              <button type="button" className="btn-reset" onClick={resetForm} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#757575', color: 'white', border: 'none', borderRadius: '4px' }}>
                Cancelar
              </button>
            )}
          </form>
        </Paper>
      )}

      <div className="table-responsive">
        <table className="stock-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
              <th onClick={() => requestSort('articulo')} style={{ cursor: 'pointer', padding: '10px' }}>Artículo ↕</th>
              <th onClick={() => requestSort('descripcion')} style={{ cursor: 'pointer', padding: '10px' }}>Descripción ↕</th>
              <th onClick={() => requestSort('cantidad')} style={{ cursor: 'pointer', padding: '10px' }}>Stock ↕</th>
              <th onClick={() => requestSort('monto')} style={{ cursor: 'pointer', padding: '10px' }}>Precio ↕</th>

              {isAdmin && <th style={{ padding: '10px' }}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {sortedProductos.map((producto) => (
              <tr key={producto.idProducto} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{producto.articulo}</td>
                <td style={{ padding: '10px' }}>{producto.descripcion}</td>
                <td style={{ padding: '10px', fontWeight: 'bold', color: producto.cantidad < 5 ? 'red' : 'green' }}>
                  {producto.cantidad}
                </td>
                <td style={{ padding: '10px' }}>{`$${(producto.monto ? Number(producto.monto).toFixed(2) : '0.00')}`}</td>
                

                {isAdmin && (
                  <td style={{ padding: '10px' }}>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(producto)}
                      style={{ marginRight: '5px', cursor: 'pointer', backgroundColor: '#1976d2', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleElim(producto.idProducto, producto.estado)}
                      style={{ cursor: 'pointer', backgroundColor: '#d32f2f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}
                    >
                      Borrar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                colSpan={isAdmin ? 5 : 4} 
                count={totalProductos}
                rowsPerPage={limit}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'Filas por página' },
                  native: true,
                }}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => setLimit(Number(e.target.value))}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </table>
      </div>
    </div>
  );
}


function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div style={{ flexShrink: 0, marginLeft: 20 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="primera página">
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="página anterior">
        <KeyboardArrowLeftIcon />
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="página siguiente">
        <KeyboardArrowRightIcon />
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="última página">
        <LastPageIcon />
      </IconButton>
    </div>
  );
}

export default StockPage;