import React from 'react';
import { Navigate } from 'react-router-dom';

const RotaProtegida = ({ children }) => {
    const estaLogado = localStorage.getItem('usuario_logado') === 'true';

    if (!estaLogado) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default RotaProtegida;