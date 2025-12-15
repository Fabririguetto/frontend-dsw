const API_URL = process.env.REACT_APP_API_URL;

const decodeToken = (token) => {
    try {
        if (!token) return null;
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error decodificando token:", e);
        return null;
    }
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return false;
    }

    const payload = decodeToken(token);
    
    if (!payload || !payload.exp) {
        localStorage.clear();
        return false; 
    }

    const currentTime = Date.now() / 1000;
    
    if (payload.exp < currentTime) {
        console.log("Token expirado.");
        localStorage.clear(); 
        return false;
    }

    return true;
};

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!data.token) {
            throw new Error(data.error || 'Invalid credentials');
        }

        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        return data.user;
    } catch (error) {
        throw error;
    }
};

export const resetPasswordDirect = async (email, newPassword) => {
    const token = getToken(); 
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
    
    try {
        const response = await fetch(`${API_URL}auth/reset-direct`, { 
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ email, newPassword })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al restablecer contraseña.');
        }

        return data; 
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
    localStorage.clear();
    window.location.href = '/';
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const getToken = () => {
    return localStorage.getItem('token');
};