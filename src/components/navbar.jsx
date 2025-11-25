import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsuarioActual, logout } from '../services/authService';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = () => {
const user = getUsuarioActual();
const navigate = useNavigate();

if (!user) return null;
const handleLogout = () => {
    logout();
    navigate('/login');
};

return (
    <AppBar position="static">
        <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Gestión DSW
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button color="inherit" component={Link} to="/ventas">Ventas</Button>
            <Button color="inherit" component={Link} to="/stock">Stock</Button>
            <Button color="inherit" component={Link} to="/clientes">Clientes</Button>

        {user.rol === 'admin' && (
            <>
                <Button color="inherit" component={Link} to="/empleados">Empleados</Button>
                <Button color="inherit" component={Link} to="/sucursales">Sucursales</Button>
            </>
        )}

        <Typography variant="body2" sx={{ ml: 2, mr: 1 }}>
            {user.nombre}
        </Typography>  
        <Button 
            color="error" 
            variant="contained" 
            size="small" 
            onClick={handleLogout}> Salir </Button>
        </Box>
    </Toolbar>
</AppBar>
);
};

export default Navbar;