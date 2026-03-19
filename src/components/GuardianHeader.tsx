import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { ShoppingCart, LogOut } from "lucide-react";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";

interface GuardianHeaderProps {
  guardianName?: string;
}

export function GuardianHeader({ guardianName }: GuardianHeaderProps) {
  const { token: tokenFromParams } = useParams();
  const [searchParams] = useSearchParams();
  const tokenFromQuery = searchParams.get("token");
  const token = tokenFromParams || tokenFromQuery;
  const navigate = useNavigate();
  const { cartCount, refreshCartCount } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (token) {
      refreshCartCount(token);
    }
  }, [token]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    const { data: { session } } = await supabase.auth.getSession();
    setIsLoggedIn(!!session);
  }

  function handleCartClick() {
    if (token) {
      navigate(`/guardian/shopping-cart?token=${token}`);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }

  return (
    <header className="guardian-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">Payment Portal</h1>
          {guardianName && (
            <p className="guardian-name">Welcome, {guardianName}</p>
          )}
        </div>
        <div className="header-right">
          <button className="cart-button" onClick={handleCartClick}>
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          {isLoggedIn && (
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      <style>{`
        .guardian-header {
          background: #7a1f2b;
          color: white;
          padding: 1rem 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .header-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .guardian-name {
          margin: 0;
          font-size: 0.875rem;
          opacity: 0.9;
          font-weight: 400;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .cart-button, .logout-button {
          position: relative;
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: white;
          padding: 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background 0.2s;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .cart-button:hover, .logout-button:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .cart-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #ff4444;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
          min-width: 20px;
          text-align: center;
        }

        @media (max-width: 640px) {
          .guardian-header {
            padding: 1rem;
          }

          .header-title {
            font-size: 1.2rem;
          }

          .guardian-name {
            font-size: 0.75rem;
          }

          .header-right {
            gap: 0.5rem;
          }

          .cart-button, .logout-button {
            padding: 0.6rem;
          }

          .logout-button span {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
