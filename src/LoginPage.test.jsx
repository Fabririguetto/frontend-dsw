import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginPage from './pages/LoginPage';
import { BrowserRouter } from 'react-router-dom';

test('El formulario de login debe tener campos email y password', () => {
    render(
    <BrowserRouter>
        <LoginPage />
    </BrowserRouter>
    );
// Verifica que los elementos existen
expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
});