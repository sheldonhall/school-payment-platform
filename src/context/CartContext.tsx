import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface CartContextType {
  cartCount: number;
  refreshCartCount: (token: string) => Promise<void>;
  clearCartCount: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(async (token: string) => {
    try {
      const { data: guardian } = await supabase
        .from('guardians')
        .select('id')
        .eq('access_token', token)
        .maybeSingle();

      if (!guardian) {
        setCartCount(0);
        return;
      }

      const { count } = await supabase
        .from('shopping_cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('guardian_id', guardian.id);

      setCartCount(count || 0);
    } catch (error) {
      console.error('Error loading cart count:', error);
      setCartCount(0);
    }
  }, []);

  const clearCartCount = useCallback(() => {
    setCartCount(0);
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount, clearCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
