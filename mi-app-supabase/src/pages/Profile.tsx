import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, profile, fetchProfile } = useAuth();
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', user.id);

    if (error) {
      setError('Error al actualizar el perfil: ' + error.message);
    } else {
      setMessage('¡Perfil actualizado con éxito!');
      fetchProfile(user.id); // Refrescar el perfil en el contexto
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white  
      +p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Tu Perfil</h2>
        {message && <p className="bg-green-100 text-green-700 p-2 rounded mb-4">{message}</p>}
        {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>}
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email" value={user?.email || ''} className="w-full px-3 py-2 border rounded-lg bg-gray-200" disabled />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Actualizar Perfil</button>
        </form>
        <Link to="/" className="block text-center mt-4 text-blue-500 hover:underline">Volver al Inicio</Link>
      </div>
    </div>
  );
};

export default ProfilePage;