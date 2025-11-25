import React, { useState, useEffect } from 'react';
import { BrowserRouter, NavLink, Route, Routes, Navigate } from 'react-router-dom';
import { getUsuarioActual, logout } from './services/authService';

import StockPage from './pages/StockPage';
import ClientesPage from './pages/ClientesPage';
import SucursalesPage from './pages/SucursalesPage';
import VentasPage from './pages/VentasPage';
import EmpleadosPage from './pages/EmpleadosPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/navbar'; 

import DetalleVenta from './components/DetalleVenta';
import CargaVenta from './components/CargaVenta'; 

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = getUsuarioActual();
    setUsuario(user);
  }, []);

  const getLinkClass = ({ isActive }) => isActive ? "active" : "";

  if (!usuario) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    );
  }


  return (
    <BrowserRouter>
      <div className="App">
        

        <Navbar />

        <div className="page-container"> 
          <Routes>
            <Route path="/" element={<Navigate to="/ventas" />} />
            
            <Route path="/ventas" element={<VentasPage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            

            {usuario.rol === 'admin' && (
               <>
                <Route path="/empleados" element={<EmpleadosPage />} />
                <Route path="/sucursales" element={<SucursalesPage />} />
               </>
            )}

            <Route path="/detalle_venta/:idVenta" element={<DetalleVenta />} />
            <Route path="/cargaventa/:idVenta" element={<CargaVenta />} />
            
            <Route path="*" element={<Navigate to="/ventas" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;