import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProfilePage from './pages/Profile';
import ForgotPasswordPage from './pages/ForgotPassword';
import UpdatePasswordPage from './pages/UpdatePassword';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import DashboardPage from './pages/Dashboard';
import AplicacionesDelUsuarioPage from './pages/AplicacionesDelUsuario';

import './Styles/AppStyle.css'


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/aplicaciones-del-usuario" element={<AplicacionesDelUsuarioPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
