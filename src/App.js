import React, { useState, useEffect } from 'react';
import { BrowserRouter, NavLink, Route, Routes, Navigate } from 'react-router-dom';
import { getUsuarioActual, logout } from './services/authService';
import './styles/App.css'; // Asegurate que la ruta del CSS sea correcta

// Páginas
import StockPage from './pages/StockPage';
import ClientesPage from './pages/ClientesPage';
import SucursalesPage from './pages/SucursalesPage';
import VentasPage from './pages/VentasPage';
import EmpleadosPage from './pages/EmpleadosPage';
import LoginPage from './pages/LoginPage'; // <--- Importamos el Login

// Componentes
import DetalleVenta from './components/DetalleVenta';
import CargaVenta from './components/CargaVenta'; 

function App() {
  const [usuario, setUsuario] = useState(null);

  // Al iniciar, preguntamos: ¿Hay alguien logueado?
  useEffect(() => {
    const user = getUsuarioActual();
    setUsuario(user);
  }, []);

  const getLinkClass = ({ isActive }) => isActive ? "active" : "";

  // 🔒 SI NO HAY USUARIO --> MOSTRAMOS SOLO LOGIN
  if (!usuario) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // 🔓 SI HAY USUARIO --> MOSTRAMOS EL SISTEMA
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <nav>
            <NavLink to="/ventas" className={getLinkClass}>Ventas</NavLink>
            <NavLink to="/stock" className={getLinkClass}>Stock</NavLink>
            <NavLink to="/clientes" className={getLinkClass}>Clientes</NavLink>
            
            {/* Solo Admin ve esto */}
            {usuario.rol === 'admin' && (
              <>
                <NavLink to="/empleados" className={getLinkClass}>Empleados</NavLink>
                <NavLink to="/sucursales" className={getLinkClass}>Sucursales</NavLink>
              </>
            )}

            <button onClick={logout} className="logout-btn" style={{ marginLeft: 'auto' }}>
              Salir
            </button>
          </nav>
        </header>

        <div className="Content">
          <Routes>
            <Route path="/" element={<Navigate to="/ventas" />} />
            <Route path="/ventas" element={<VentasPage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            
            {/* Rutas Protegidas para Admin */}
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