
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './../Styles/Navbar.css';

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Mi App</Link>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/profile">Perfil</Link>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={() => signOut()}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
