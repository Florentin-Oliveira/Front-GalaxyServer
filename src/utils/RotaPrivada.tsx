import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { observer } from 'mobx-react-lite';
import autenticaStore from "../store/autentica.store";

const RotaPrivada = observer(() => {
    console.log('RotaPrivada:', autenticaStore.estaAutenticado);
    return (
        autenticaStore.estaAutenticado ? <Outlet /> : <Navigate to="/login" replace />
    );
});

export default RotaPrivada;
