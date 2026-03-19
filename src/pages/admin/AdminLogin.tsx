import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/Logo';
import { Lock, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.session) {
        const { data: { user } } = await supabase.auth.getUser();
        const role = user?.app_metadata?.role;

        if (role === 'guardian') {
          const { data: guardian, error: guardianError } = await supabase
            .from('guardians')
            .select('access_token')
            .eq('email', user.email)
            .maybeSingle();

          if (guardianError) {
            console.error('Guardian lookup error:', guardianError);
            setError(`Database error: ${guardianError.message}`);
          } else if (guardian?.access_token) {
            navigate(`/guardian/${guardian.access_token}`);
          } else {
            setError('Guardian account not properly set up. Please contact the school.');
          }
        } else {
          navigate('/admin/dashboard');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-school-red-600 via-school-red-700 to-school-red-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          <h1 className="text-2xl font-serif font-bold text-center text-school-red-700 mb-2">
            Admin Portal
          </h1>
          <p className="text-center text-gray-600 mb-8">
            { 'Please sign in to continue'}
          </p>
          {error && (
            <div className={`border px-4 py-3 rounded-lg mb-4 ${
              error.includes('created')
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent outline-none transition-all"
                  placeholder="admin@mrgs.edu.tt"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-school-red-600 hover:bg-school-red-700 text-white font-medium py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? ('Signing in...')
                : ('Sign In')}
            </button>
          </form>
        </div>
        <footer className="text-center text-white text-sm mt-8 opacity-90">
          School Payment Portal v1.0
        </footer>
      </div>
    </div>
  );
}
