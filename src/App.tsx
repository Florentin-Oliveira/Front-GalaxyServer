import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import RotaPrivada from './utils/RotaPrivada';
import SignUpPage from './paginas/Logs/Sign-up';
import LoginPage from './paginas/Logs/Login';
//import ForgotPasswordPage from './paginas/Logs/EsqueceuSenha';
import NotFund from './paginas/NotFund/NotFund';
import Home from './paginas/Home';
import UserPerfil from './paginas/Perfil';
import Favoritos from './paginas/Favoritos';
import AreaTrabalho from './paginas/Clientes';
import ViewOS from './paginas/ViewOS';
import ViewCliente from './paginas/ViewCliente';
import FormOS from './paginas/FromOS';
import FormCliente from './paginas/FormCliente';
import PrivateLayout from './utils/LayoutPrivada';
//import ResetPasswordConfirmPage from './paginas/Logs/RedefinicaoSenha';
import CompatilhadosComigo from './paginas/CompatilhadosComigo';
import SessionExpiredDialog from './store/SessionExpiredDialog';
import autenticaStore from './store/autentica.store';
import Clientes from './paginas/Clientes'

const App: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    autenticaStore.setNavigateFunction(navigate);
  }, [navigate]);

  return (
    <>
      <SessionExpiredDialog />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/**        <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
        <Route path="/sign-up" element={<SignUpPage />} />
        {/**        <Route path="/reset-password-confirm/:uidb64/:token" element={<ResetPasswordConfirmPage />} /> */}
        
        <Route element={<RotaPrivada />}>
          <Route element={<PrivateLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/ViewOS/:id" element={<ViewOS />} />
            <Route path="/ViewCliente/:id" element={<ViewCliente />} />
            <Route path="/FormOS" element={<FormOS />} />
            <Route path="/FormCliente" element={<FormCliente />} />
            <Route path="/Favoritos" element={<Favoritos />} />
            <Route path="/Clientes" element={<Clientes />} />
            <Route path="/AreaTrabalho" element={<AreaTrabalho />} />
            <Route path='/UserPerfil' element={<UserPerfil />} />
            <Route path='/CompatilhadosComigo' element={<CompatilhadosComigo />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFund />} />
      </Routes>
    </>
  );
};

export default App;
