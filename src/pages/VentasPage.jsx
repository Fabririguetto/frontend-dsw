import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useVentas from '../hooks/useHookVen';
import DetalleVenta from '../components/DetalleVenta';
import './VentasPage.css';

// Importaciones de Material UI para la paginación
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import { IconButton } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

// Componente auxiliar para los botones de paginación
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

  // Eliminamos el style={{ color: 'inherit' }} para usar el color por defecto del botón (gris/negro)
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

function VentasPage() {
  const { 
    ventas, 
    fetchVentas, 
    requestSort, 
    error,
    page,
    setPage,
    limit,
    setLimit,
    totalVentas
  } = useVentas();
  
  const [filtro, setFiltro] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVentas(filtro);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filtro]); 

  const handleFilterChange = (e) => {
    const valor = e.target.value;
    setFiltro(valor);
    setPage(0);
  };

  const handleDetalleClick = (venta) => {
    setVentaSeleccionada(venta);
    setIsModalOpen(true);
  };

  const handleNuevaVenta = () => {
    navigate('/cargaventa/nueva');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const thStyle = { cursor: 'pointer', userSelect: 'none' };

  return (
    <div id="form-ventas-container">
      <header className="App-header" id="header-ventas">
        <input
          type="text"
          id="filtro-clientes"
          placeholder="Buscar por cliente o vendedor..."
          onChange={handleFilterChange}
          value={filtro}
        />
      </header>

      <div id="form-venta-inputs" className="div-container" style={{ justifyContent: 'flex-end' }}>
        <button
          type="button"
          id="nueva-venta-btn"
          onClick={handleNuevaVenta}
        >
          + Nueva Venta
        </button>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div id="tabla-ventas-container">
        <table id="tabla-ventas" className="tabla-negra">
          <thead>
            <tr>
              <th style={thStyle} onClick={() => requestSort('idVenta')}>ID ↕</th>
              <th style={thStyle} onClick={() => requestSort('montoTotal')}>Monto Total ↕</th>
              <th style={thStyle} onClick={() => requestSort('nombre_apellidoEmp')}>Vendedor ↕</th>
              <th style={thStyle} onClick={() => requestSort('nombre_apellidoCli')}>Cliente ↕</th>
              <th style={thStyle} onClick={() => requestSort('fechaHoraVenta')}>Fecha y Hora ↕</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  No se encontraron ventas.
                </td>
              </tr>
            ) : (
              ventas.map((venta) => (
                <tr key={venta.idVenta}>
                  <td>#{venta.idVenta}</td>
                  <td style={{ fontWeight: 'bold', color: '#4caf50' }}>
                    ${Number(venta.montoTotal).toFixed(2)}
                  </td>
                  <td>{venta.nombre_apellidoEmp}</td>
                  <td>{venta.nombre_apellidoCli}</td>
                  <td>{new Date(venta.fechaHoraVenta).toLocaleString()}</td>
                  <td>
                    <button 
                      className="detallebtn" 
                      onClick={() => handleDetalleClick(venta)}
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          
          <TableFooter>
            <TableRow>
              {/* Hemos quitado el SX que forzaba el color blanco para que se usen los colores por defecto */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                colSpan={6}
                count={totalVentas}
                rowsPerPage={limit}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'Filas por página' },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>

        </table>
      </div>

      {isModalOpen && ventaSeleccionada && (
        <DetalleVenta
          venta={ventaSeleccionada}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default VentasPage;