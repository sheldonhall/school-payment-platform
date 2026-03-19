import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { supabase } from '../lib/supabase';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin/login');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.app_metadata?.role;

    if (role === 'guardian') {
      const { data: guardian } = await supabase
        .from('guardians')
        .select('access_token')
        .eq('email', user.email)
        .maybeSingle();

      if (guardian?.access_token) {
        navigate(`/guardian/${guardian.access_token}`);
      } else {
        navigate('/admin/login');
      }
      return;
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        showMenuButton={true}
        menuOpen={sidebarOpen}
      />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          Concept Preview - School Payment Portal
        </div>
      </footer>
    </div>
  );
}
