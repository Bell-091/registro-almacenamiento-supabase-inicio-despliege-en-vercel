import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase redirects here after a password reset link is clicked,
    // and the session is available with the user information.
    // We need to listen for the PASSWORD_RECOVERY event.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
        if (event === 'PASSWORD_RECOVERY') {
            // The user is in the password recovery flow.
            // You can now allow them to set a new password.
        }
    });

    return () => {
        subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Tu contraseña ha sido actualizada exitosamente. Redirigiendo a la página de inicio de sesión...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Crear Nueva Contraseña</h1>
      <form onSubmit={handleUpdatePassword}>
        <label htmlFor="password">Nueva Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UpdatePassword;
