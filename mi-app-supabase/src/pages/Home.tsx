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
          <h1 className="text-4xl font-bold mb-4">Bienvenido, {profile?.username || user.email}!</h1>
          <Link to="/profile" className="text-blue-500 hover:underline mr-4">Ir al Perfil</Link>
          <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded">Cerrar Sesión</button>
        </div>
      ) : (
        <Link to="/login" className="bg-blue-500 text-white px-6 py-3 rounded-lg text-xl">Iniciar Sesión</Link>
      )}
    </div>
    
  );
};

export default HomePage;