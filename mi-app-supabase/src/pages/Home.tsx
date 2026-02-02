import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {user ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">¡Hola, {profile?.username || user.email}!</h1>
          <p className="text-lg text-gray-600 mb-6">Nos alegra verte de nuevo.</p>
          <Link to="/profile" className="text-blue-500 hover:underline mr-4">Ir al Perfil</Link>
          <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded">Cerrar Sesión</button>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Bienvenido a la app</h1>
          <p className="text-xl text-gray-600 mb-8">Aqui ocurre la autenticación de usuario y luego puedes acceder al contenido protegido.</p>
          <div className="flex justify-center space-x-4">
            <Link to="/login" className="bg-blue-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-blue-600 transition-colors">Iniciar Sesión</Link>
            <Link to="/signup" className="bg-green-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-green-600 transition-colors">Registrarse</Link>
            
          </div>
        </div>
      )}
    </div>
    
  );
};

export default HomePage;