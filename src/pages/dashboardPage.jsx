import React from 'react';
import { Grid, Card, CardContent, Typography, List, ListItem, ListItemText, CircularProgress, Box, Alert } from '@mui/material';
import useHookDashboard from '../hooks/useHookDashboard'; 
import DashboardIcon from '@mui/icons-material/Dashboard';
import '../styles/DashboardPage.css';

const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString('es-AR', { 
        style: 'currency', 
        currency: 'ARS',
        minimumFractionDigits: 2 
    });
};

const DashboardPage = () => {
    const stats = useHookDashboard(); 

    if (stats.loading) {
        return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
    }

    return (
        <Box p={3}>
            <div className="page-title dashboard-title">
                <DashboardIcon fontSize="large" className="dashboard-icon" />
                Panel de Control
            </div>

            {stats.error && <Alert severity="error" mb={3}>{stats.error}</Alert>}

            <Grid container spacing={3} className="dashboard-grid">
                {/* Tarjeta 1: Ventas del Mes */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card className="dashboard-card card-ventas">
                        <CardContent>
                            <Typography variant="subtitle1" className="card-title">
                                Ventas del Mes
                            </Typography>
                            <Typography variant="h3" className="card-number" color="success">
                                {stats.ventasMes}
                            </Typography>
                            <Typography variant="body2" className="card-subtitle">
                                Transacciones registradas
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tarjeta 2: Ingresos del mes */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card className="dashboard-card card-ingresos">
                        <CardContent>
                            <Typography variant="subtitle1" className="card-title">
                                Ingresos del Mes
                            </Typography>
                            <Typography variant="h3" className="card-number ingreso-monto">
                                {formatCurrency(stats.ingresosMes)}
                            </Typography>
                            <Typography variant="body2" className="card-subtitle">
                                Total facturado
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tarjeta 3: Stock bajo */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card className="dashboard-card card-stock-bajo">
                        <CardContent>
                            <Typography variant="subtitle1" className="card-title">
                                Stock Bajo
                            </Typography>
                            <Typography variant="h3" className="card-number">
                                {stats.productosPocoStock.length}
                            </Typography>
                            <Typography variant="body2" className="card-subtitle">
                                Productos por reponer
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tarjeta 4: Sin stock */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card className="dashboard-card card-sin-stock">
                        <CardContent>
                            <Typography variant="subtitle1" className="card-title" mb={2}>
                                Productos Sin Stock
                            </Typography>
                            <List dense className="card-list">
                                {stats.productosSinStock.slice(0, 3).map((producto) => (
                                    <ListItem key={producto.idProducto}>
                                        <ListItemText 
                                            primary={producto.articulo}
                                            secondary={producto.descripcion || "Sin descripción"}
                                        />
                                    </ListItem>
                                ))}
                                {stats.productosSinStock.length === 0 && (
                                    <ListItem>
                                        <ListItemText 
                                            primary="¡Excelente!"
                                            secondary="No hay productos sin stock"
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tarjeta 5: Top productos */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card className="dashboard-card card-top-productos">
                        <CardContent>
                            <Typography variant="subtitle1" className="card-title" mb={2}>
                                Productos Más Vendidos
                            </Typography>
                            <List dense className="card-list">
                                {stats.productosMasVendidos.slice(0, 3).map((producto, index) => (
                                    <ListItem key={producto.idProducto}>
                                        <ListItemText 
                                            primary={`${index + 1}. ${producto.articulo}`}
                                            secondary={`${producto.total_vendido} unidades vendidas`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tarjeta 6: Top vendedores */}
                <Grid item xs={12} lg={4}>
                    <Card className="dashboard-card card-top-vendedores">
                        <CardContent>
                            <Typography variant="subtitle1" className="card-title" mb={2}>
                                Top Vendedores
                            </Typography>
                            <List dense className="card-list">
                                {stats.topVendedores.slice(0, 3).map((vendedor) => (
                                    <ListItem key={vendedor.idEmpleado}>
                                        <ListItemText 
                                            primary={vendedor.nombre_apellidoEmp}
                                            secondary={`${vendedor.total_ventas} ventas - ${formatCurrency(vendedor.total_monto)}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardPage;