import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'STAFF' || user.role === 'ADMIN') {
        navigate('/dashboard');
      } else {
        setError('Access denied. Staff accounts only.');
      }
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      
      <div className="w-full max-w-md p-8 border border-gray-200 rounded-xl shadow-sm">

        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#800000' }}
          >
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#800000' }}>
            SorSU Registrar
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Sign in to your staff account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ focusRingColor: '#800000' }}
              placeholder="staff@sorsu.edu.ph"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-2 rounded-lg text-sm font-medium mt-2 transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: '#800000' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

      </div>
    </div>
  );
}