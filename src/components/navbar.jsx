import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUsuarioActual, logout } from '../services/authService';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Person } from '@mui/icons-material';
import '../styles/navbar.css';

const Navbar = () => {
const user = getUsuarioActual();
const navigate = useNavigate();
const location = useLocation();

if (!user) return null;
const handleLogout = () => {
    logout();
    navigate('/login');
};

const getActiveClass = (path) => {
    if (location.pathname !== path) return '';
    
    switch(path) {
    case '/dashboard': return 'nav-btn-active-dashboard';
    case '/ventas': return 'nav-btn-active-ventas';
    case '/stock': return 'nav-btn-active-stock';
    case '/clientes': return 'nav-btn-active-clientes';
    case '/empleados': return 'nav-btn-active-empleados';
    case '/sucursales': return 'nav-btn-active-sucursales';
    default: return '';
    }
};

return (
    <AppBar position="static">
        <Toolbar className="navbar-toolbar">
        <Typography variant="h6" className="navbar-title">
        Gestión DSW
        </Typography>
        
        <Box className="navbar-center-container">
            {user.rol === 'admin' && (
                <Button color="inherit" component={Link} to="/dashboard" className={getActiveClass('/dashboard')}>
                    Dashboard
                </Button>
            )}
            <Button color="inherit" component={Link} to="/ventas" className={getActiveClass('/ventas')}>Ventas</Button>
            <Button color="inherit" component={Link} to="/stock" className={getActiveClass('/stock')}>Stock</Button>
            <Button color="inherit" component={Link} to="/clientes" className={getActiveClass('/clientes')}>Clientes</Button>

        {user.rol === 'admin' && (
            <>
                <Button color="inherit" component={Link} to="/empleados" className={getActiveClass('/empleados')}>Empleados</Button>
                <Button color="inherit" component={Link} to="/sucursales" className={getActiveClass('/sucursales')}>Sucursales</Button>
            </>
        )}
        </Box>

        <Box className="navbar-right-container">
        <Typography variant="body2" className="user-name">
            <Person className='icon-perfil'/>{user.nombre}
        </Typography>
        <Button 
            className="btn-CerrarSesion"
            onClick={handleLogout}> Cerrar Sesión </Button>
        </Box>
    </Toolbar>
</AppBar>
);
};

export default Navbar;