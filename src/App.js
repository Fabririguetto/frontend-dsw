import React from 'react';
import { BrowserRouter, NavLink, Route, Routes, Navigate } from 'react-router-dom';
import './styles/App.css';

import StockPage from './pages/StockPage';
import ClientesPage from './pages/ClientesPage';
import SucursalesPage from './pages/SucursalesPage';
import VentasPage from './pages/VentasPage';
import EmpleadosPage from './pages/EmpleadosPage';

import DetalleVenta from './components/DetalleVenta';
import CargaVenta from './components/CargaVenta'; 

function App() {
  const getLinkClass = ({ isActive }) => isActive ? "active" : "";

  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <nav>
            <NavLink to="/ventas" className={getLinkClass}>Ventas</NavLink>
            <NavLink to="/stock" className={getLinkClass}>Stock</NavLink>
            <NavLink to="/clientes" className={getLinkClass}>Clientes</NavLink>
            <NavLink to="/empleados" className={getLinkClass}>Empleados</NavLink>
            <NavLink to="/sucursales" className={getLinkClass}>Sucursales</NavLink>
          </nav>
        </header>

        <div className="Content">
          <Routes>
            <Route path="/" element={<Navigate to="/ventas" />} />

            <Route path="/stock" element={<StockPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/sucursales" element={<SucursalesPage />} />
            <Route path="/ventas" element={<VentasPage />} />
            <Route path="/empleados" element={<EmpleadosPage />} />

            <Route path="/detalle_venta/:idVenta" element={<DetalleVenta />} />
            <Route path="/cargaventa/:idVenta" element={<CargaVenta />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;