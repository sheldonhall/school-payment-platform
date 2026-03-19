import { Logo } from './Logo';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
  menuOpen?: boolean;
}

export function Header({ onMenuToggle, showMenuButton = false, menuOpen = false }: HeaderProps) {
  return (
    <header className="bg-school-red-600 text-white shadow-lg">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 hover:bg-school-red-700 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
          <Logo className="text-white" />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:block">Payment Portal</span>
        </div>
      </div>
    </header>
  );
}
