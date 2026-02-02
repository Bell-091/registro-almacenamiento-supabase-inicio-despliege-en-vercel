import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Se ha enviado un enlace para restablecer la contraseña a tu correo electrónico.');
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Recuperar Contraseña</h1>
      <form onSubmit={handleForgotPassword}>
        <label htmlFor="email">Correo Electrónico</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={() => navigate('/login')}>Volver a Iniciar Sesión</button>
    </div>
  );
};

export default ForgotPassword;
