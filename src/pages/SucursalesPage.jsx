import React, { useState, useEffect } from 'react';
import './SucursalesPage.css';
import Modal from '../components/ModalSucursal';

function FormSucursales() {
  const [sucursales, setSucursales] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const fetchSucursales = async () => {
    try {
      const response = await fetch(`http://localhost:3500/sucursales?filtro=${filtro}`);
      const data = await response.json();
      setSucursales(data);
    } catch (error) {
      console.error('Error al obtener las sucursales:', error);
    }
  };

  useEffect(() => {
    fetchSucursales();
  }, [filtro]); 

  const handleVerDetalles = (sucursal) => {
    setSucursalSeleccionada(sucursal);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSucursalSeleccionada(null);
  };

  return (
    <div className="App sucursales-app">
      <header className="App-header sucursales-header">
        <input
          type="text"
          id="filtro-sucursal"
          value={filtro}
          onChange={handleFiltroChange}
          placeholder="Buscar por nombre o dirección de sucursal..."
          className="filtro-input"
        />
      </header>
      <div className="card-container">
        {sucursales.map((sucursal) => (
          <div key={sucursal.idSucursal} className="card sucursal-card">
            <h3 className="card-title sucursal-title">{sucursal.nombreSucursal}</h3>
            <p className="card-text sucursal-id">ID: {sucursal.idSucursal}</p>
            <p className="card-text sucursal-direccion">Dirección: {sucursal.direccion}</p>
            <div className="card-button-container sucursal-button-container">
              <button
                className="card-button sucursal-button"
                onClick={() => handleVerDetalles(sucursal)}
              >
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal showModal={showModal} onClose={closeModal}>
        {sucursalSeleccionada && (
          <div>
            <h3>Detalles de la Sucursal</h3>
            <p><strong>Nombre:</strong> {sucursalSeleccionada.nombreSucursal}</p>
            <p><strong>ID:</strong> {sucursalSeleccionada.idSucursal}</p>
            <p><strong>Dirección:</strong> {sucursalSeleccionada.direccion}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default FormSucursales;