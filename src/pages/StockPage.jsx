import React from 'react';
import useStock from '../hooks/useHookStock';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import { IconButton } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import './StockPage.css';

function FormStock() {
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

  return (
    <div>
      <div className="App-header">
        <input
          type="text"
          name="nombreProducto"
          value={filters.nombreProducto}
          onChange={handleFilterChange}
          placeholder="Buscar por articulo o descripcion"
        />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="articulo"
          value={formData.articulo}
          onChange={handleInputChange}
          placeholder="Artículo"
        />
        <input
          type="text"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleInputChange}
          placeholder="Descripción"
        />
        <input
          type="number"
          name="cantidad"
          value={formData.cantidad}
          onChange={handleInputChange}
          placeholder="Cantidad"
        />
        <input
          type="number"
          name="monto"
          value={formData.monto}
          onChange={handleInputChange}
          placeholder="Monto"
        />
        <button
          type="submit"
          className="btn-submit"
        >
          {formData.idProducto ? 'Actualizar Producto' : 'Agregar Producto'}
        </button>
        <button
          type="button"
          className="btn-reset"
          onClick={resetForm}
        >
          Limpiar Formulario
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th onClick={() => requestSort('articulo')}>Artículo</th>
            <th onClick={() => requestSort('descripcion')}>Descripción</th>
            <th onClick={() => requestSort('cantidad')}>Cantidad</th>
            <th onClick={() => requestSort('monto')}>Monto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedProductos.map((producto) => (
            <tr key={producto.idProducto}>
              <td>{producto.articulo}</td>
              <td>{producto.descripcion}</td>
              <td>{producto.cantidad}</td>
              <td>{`$${(producto.monto ? Number(producto.monto).toFixed(2) : '0.00')}`}</td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(producto)}
                >
                  Editar
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleElim(producto.idProducto, producto.estado)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <TableFooter>
          <TableRow>
            <TablePagination
              className='pagination'
              rowsPerPageOptions={[20, 30, 40]}
              colSpan={3}
              count={totalProductos}
              rowsPerPage={limit}
              page={page}
              ActionsComponent={TablePaginationActions}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => setLimit(Number(e.target.value))}
            />
          </TableRow>
        </TableFooter>
      </table>
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
    <div>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
        <KeyboardArrowLeftIcon />
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
        <KeyboardArrowRightIcon />
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
        <LastPageIcon />
      </IconButton>
    </div>
  );
}

export default FormStock;
