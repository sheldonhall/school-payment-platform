import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  WalletCards,
  Users,
  GraduationCap,
  School,
  LogOut,
  Microscope,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/payment-items", label: "Payment Items", icon: FileText },
    { path: "/admin/payments", label: "Payments", icon: WalletCards },
    { path: "/admin/students", label: "Students", icon: Users },
    { path: "/admin/teachers", label: "Teachers", icon: GraduationCap },
    { path: "/admin/classes", label: "Classes", icon: School },
    { path: "/admin/testing", label: "Testing", icon: Microscope },
    { path: "/admin/testing", label: "New thing", icon: Microscope },
  ];

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${
                    active
                      ? "bg-school-red-50 text-school-red-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => (window.location.href = "/admin/login")}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
