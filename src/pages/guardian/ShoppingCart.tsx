import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { GuardianHeader } from "../../components/GuardianHeader";
import { useCart } from "../../context/CartContext";

type CartItem = {
  id: string;
  payment_item_id: string;
  student_id: string;
  payment_item: {
    id: string;
    title: string;
    description: string | null;
    amount: number;
    icon_url: string | null;
  };
  student: {
    id: string;
    first_name: string;
    last_name: string;
  };
};

const ICON_BUCKET = "payment-item-icons";

export function ShoppingCart() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [guardianId, setGuardianId] = useState<string | null>(null);
  const [guardianName, setGuardianName] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setError("Missing access token.");
      setLoading(false);
      return;
    }

    loadCart();
    
  }, [token]);

  async function loadCart() {
    try {
      setLoading(true);

      const { data: guardian, error: guardianError } = await supabase
        .from("guardians")
        .select("id, first_name, last_name")
        .eq("access_token", token)
        .maybeSingle();

      if (guardianError || !guardian) {
        throw new Error("Invalid access link.");
      }

      setGuardianId(guardian.id);
      setGuardianName(`${guardian.first_name} ${guardian.last_name}`);

      const { data: items, error: itemsError } = await supabase
        .from("shopping_cart_items")
        .select(
          `
          id,
          payment_item_id,
          student_id,
          payment_items (
            id,
            title,
            description,
            amount,
            icon_url
          ),
          students (
            id,
            first_name,
            last_name
          )
        `
        )
        .eq("guardian_id", guardian.id);

      if (itemsError) throw itemsError;

      const formattedItems: CartItem[] = (items || []).map((item: any) => ({
        id: item.id,
        payment_item_id: item.payment_item_id,
        student_id: item.student_id,
        payment_item: item.payment_items,
        student: item.students,
      }));

      const unpaidItems: CartItem[] = [];
      const itemsToRemove: string[] = [];

      for (const item of formattedItems) {
        const { data: pisRecord } = await supabase
          .from("payment_item_students")
          .select("id")
          .eq("payment_item_id", item.payment_item_id)
          .eq("student_id", item.student_id)
          .maybeSingle();

        if (pisRecord) {
          const { data: payments } = await supabase
            .from("payments")
            .select("amount")
            .eq("payment_item_student_id", pisRecord.id)
            .not("verified_at", "is", null);

          if (payments && payments.length > 0) {
            const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
            if (totalPaid >= item.payment_item.amount) {
              itemsToRemove.push(item.id);
              continue;
            }
          }
        }

        unpaidItems.push(item);
      }

      if (itemsToRemove.length > 0) {
        await supabase
          .from("shopping_cart_items")
          .delete()
          .in("id", itemsToRemove);

        if (token) {
          await refreshCartCount(token);
        }
      }

      setCartItems(unpaidItems);
    } catch (err: any) {
      setError(err.message || "Failed to load cart.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveItem(cartItemId: string) {
    if (!token) return;

    try {
      const { error } = await supabase
        .from("shopping_cart_items")
        .delete()
        .eq("id", cartItemId);

      if (error) throw error;

      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      await refreshCartCount(token);
    } catch (err: any) {
      alert(err.message || "Failed to remove item.");
    }
  }

  function handleCheckout() {
    if (token) {
      navigate(`/guardian/shopping-cart/checkout?token=${token}`);
    }
  }

  function getIconUrl(path: string | null) {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    const { data } = supabase.storage.from(ICON_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  const total = cartItems.reduce(
    (sum, item) => sum + (item.payment_item?.amount || 0),
    0
  );

  if (loading) {
    return (
      <>
        <GuardianHeader guardianName={guardianName} />
        <main className="page">
          <p>Loading cart...</p>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <GuardianHeader guardianName={guardianName} />
        <main className="page">
          <p style={{ color: "darkred" }}>{error}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <GuardianHeader />
      <main className="page">
        <div className="container">
          <h1>Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="empty">
              <p>Your cart is empty.</p>
              <button
                className="secondary"
                onClick={() => navigate(`/guardian/${token}/payment-items`)}
              >
                Browse Payment Items
              </button>
            </div>
          ) : (
            <>
              <button
                className="continue-shopping"
                onClick={() => navigate(`/guardian/${token}/payment-items`)}
              >
                ← Continue Shopping
              </button>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    {item.payment_item.icon_url && (
                      <img
                        src={getIconUrl(item.payment_item.icon_url) || undefined}
                        alt=""
                        className="item-icon"
                      />
                    )}
                    <div className="item-details">
                      <h3>{item.payment_item.title}</h3>
                      <p className="student-name">
                        For: {item.student.first_name} {item.student.last_name}
                      </p>
                      {item.payment_item.description && (
                        <p className="description">
                          {item.payment_item.description}
                        </p>
                      )}
                    </div>
                    <div className="item-actions">
                      <p className="price">TTD ${item.payment_item.amount}</p>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item.id)}
                        title="Remove from cart"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span className="amount">TTD ${total.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span className="amount">TTD ${total.toFixed(2)}</span>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>

        <style>{`
          .page {
            padding: 2rem 1rem;
            background: #fafafa;
            min-height: calc(100vh - 80px);
          }

          .container {
            max-width: 900px;
            margin: 0 auto;
          }

          h1 {
            margin: 0 0 1.5rem 0;
            font-size: 2rem;
            color: #333;
          }

          .empty {
            background: white;
            padding: 3rem;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          }

          .empty p {
            font-size: 1.1rem;
            color: #666;
            margin-bottom: 1.5rem;
          }

          .secondary {
            padding: 0.75rem 1.5rem;
            background: white;
            color: #7a1f2b;
            border: 2px solid #7a1f2b;
            border-radius: 8px;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.2s;
          }

          .secondary:hover {
            background: #7a1f2b;
            color: white;
          }

          .continue-shopping {
            padding: 0.75rem 1.5rem;
            background: white;
            color: #7a1f2b;
            border: 2px solid #7a1f2b;
            border-radius: 8px;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 1.5rem;
          }

          .continue-shopping:hover {
            background: #7a1f2b;
            color: white;
          }

          .cart-items {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 1.5rem;
          }

          .cart-item {
            background: white;
            border-radius: 12px;
            padding: 1rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
            display: flex;
            gap: 1rem;
            align-items: center;
          }

          .item-icon {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
            background: #eee;
          }

          .item-details {
            flex: 1;
          }

          .item-details h3 {
            margin: 0 0 0.25rem 0;
            font-size: 1.1rem;
            color: #333;
          }

          .student-name {
            font-size: 0.9rem;
            color: #666;
            margin: 0 0 0.25rem 0;
          }

          .description {
            font-size: 0.85rem;
            color: #888;
            margin: 0;
          }

          .item-actions {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 0.5rem;
          }

          .price {
            font-size: 1.1rem;
            font-weight: 600;
            color: #7a1f2b;
            margin: 0;
          }

          .remove-btn {
            background: transparent;
            border: none;
            color: #dc3545;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 6px;
            transition: background 0.2s;
          }

          .remove-btn:hover {
            background: #ffe6e6;
          }

          .cart-summary {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            font-size: 1rem;
          }

          .summary-row.total {
            border-top: 2px solid #eee;
            margin-top: 0.5rem;
            padding-top: 1rem;
            font-size: 1.2rem;
            font-weight: 600;
          }

          .amount {
            color: #7a1f2b;
          }

          .checkout-btn {
            width: 100%;
            margin-top: 1rem;
            padding: 1rem;
            background: #7a1f2b;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          }

          .checkout-btn:hover {
            background: #5d1721;
          }

          @media (max-width: 640px) {
            .page {
              padding: 1rem 0.75rem;
            }

            h1 {
              font-size: 1.5rem;
            }

            .cart-item {
              flex-direction: column;
              align-items: flex-start;
            }

            .item-icon {
              width: 100%;
              height: 150px;
            }

            .item-actions {
              width: 100%;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            }
          }
        `}</style>
      </main>
    </>
  );
}
