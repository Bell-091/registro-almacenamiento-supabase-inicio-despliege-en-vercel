import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error } = await signIn({ email, password });
    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] px-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">
        
        <h2 className="text-3xl font-bold mb-6 text-center">
          Iniciar Sesión
        </h2>

        {error && (
          <p className="bg-red-500/20 border border-red-400 text-red-200 p-2 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-300"
              placeholder="correo@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-300"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition duration-300"
          >
            Login
          </button>

        </form>

        <div className="mt-6 text-center text-sm space-y-2">
          <p>
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-cyan-300 hover:underline">
              Regístrate
            </Link>
          </p>

          <Link to="/forgot-password" className="block text-cyan-300 hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>

          <Link to="/" className="block text-gray-300 hover:text-white mt-2">
            Página Inicial
          </Link>
        </div>

      </div>
    </div>
  );


};

export default LoginPage;