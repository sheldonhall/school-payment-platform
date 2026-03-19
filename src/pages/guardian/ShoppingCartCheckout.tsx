import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CreditCard, DollarSign, ArrowLeft, Building2 } from "lucide-react";
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
    amount: number;
  };
  student: {
    id: string;
    first_name: string;
    last_name: string;
  };
};

export function ShoppingCartCheckout() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [guardianId, setGuardianId] = useState<string | null>(null);
  const [guardianName, setGuardianName] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "wipay" | "cash">("bank_transfer");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Missing access token.");
      setLoading(false);
      return;
    }

    loadCheckoutData();
  }, [token]);

  async function loadCheckoutData() {
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
            amount
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

      if (formattedItems.length === 0) {
        navigate(`/guardian/shopping-cart?token=${token}`);
        return;
      }

      setCartItems(formattedItems);
    } catch (err: any) {
      setError(err.message || "Failed to load checkout data.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCompletePayment() {
    if (!guardianId || !token) return;

    try {
      setProcessing(true);

      // Generate a content hash for the cart to create consistent reference numbers
      const contentHash = cartItems
        .map((item) => `${item.payment_item_id}-${item.student_id}`)
        .sort()
        .join("|");

      const hashCode = contentHash.split("").reduce((acc, char) => {
        return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
      }, 0);

      const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const shortHash = Math.abs(hashCode).toString(36).toUpperCase().slice(0, 5);
      const referenceNumber = `TT${date}-${shortHash}`;

      // Check if order already exists for this guardian and cart content
      let { data: existingOrder } = await supabase
        .from("orders")
        .select("id, reference_number")
        .eq("guardian_id", guardianId)
        .eq("reference_number", referenceNumber)
        .maybeSingle();

      let orderId: string;

      if (existingOrder) {
        // Update existing order
        orderId = existingOrder.id;
        await supabase
          .from("orders")
          .update({
            payment_method: paymentMethod,
            total_amount: total,
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);
      } else {
        // Create new order
        const { data: newOrder, error: orderError } = await supabase
          .from("orders")
          .insert({
            guardian_id: guardianId,
            reference_number: referenceNumber,
            total_amount: total,
            payment_method: paymentMethod,
            status: "pending",
          })
          .select()
          .single();

        if (orderError) throw orderError;
        orderId = newOrder.id;

        // Insert order items
        const orderItemsData = cartItems.map((item) => ({
          order_id: orderId,
          payment_item_id: item.payment_item_id,
          student_id: item.student_id,
          amount: item.payment_item.amount,
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItemsData);

        if (itemsError) throw itemsError;
      }

      // Navigate to appropriate completion page
      if (paymentMethod === "bank_transfer") {
        navigate(`/guardian/payment/bank-transfer?token=${token}&ref=${referenceNumber}&order=${orderId}`);
      } else if (paymentMethod === "wipay") {
        navigate(`/guardian/payment/wipay?token=${token}&order=${orderId}&amount=${total}`);
      } else {
        navigate(`/guardian/payment/cash-complete?token=${token}&order=${orderId}`);
      }
    } catch (err: any) {
      alert(err.message || "Failed to complete payment.");
    } finally {
      setProcessing(false);
    }
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
          <p>Loading checkout...</p>
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
          <button
            onClick={() => navigate(`/guardian/shopping-cart?token=${token}`)}
            className="back-button"
          >
            <ArrowLeft size={20} />
            <span>Back to Cart</span>
          </button>

          <h1>Checkout</h1>

          <div className="checkout-content">
            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="summary-item">
                    <div>
                      <p className="item-title">{item.payment_item.title}</p>
                      <p className="item-student">
                        {item.student.first_name} {item.student.last_name}
                      </p>
                    </div>
                    <p className="item-price">TTD ${item.payment_item.amount}</p>
                  </div>
                ))}
              </div>
              <div className="total-row">
                <span>Total:</span>
                <span className="total-amount">TTD ${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="payment-section">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <label
                  className={`payment-option ${
                    paymentMethod === "bank_transfer" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as "bank_transfer" | "wipay" | "cash")
                    }
                  />
                  <Building2 size={24} />
                  <div>
                    <p className="option-title">Bank Transfer</p>
                    <p className="option-desc">Pay via your bank</p>
                  </div>
                </label>

                <label
                  className={`payment-option ${
                    paymentMethod === "wipay" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="wipay"
                    checked={paymentMethod === "wipay"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as "bank_transfer" | "wipay" | "cash")
                    }
                  />
                  <CreditCard size={24} />
                  <div>
                    <p className="option-title">WIPay</p>
                    <p className="option-desc">Pay now with credit/debit card</p>
                  </div>
                </label>

                <label
                  className={`payment-option ${
                    paymentMethod === "cash" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as "bank_transfer" | "wipay" | "cash")
                    }
                  />
                  <DollarSign size={24} />
                  <div>
                    <p className="option-title">Pay in Cash</p>
                    <p className="option-desc">Pay at school office</p>
                  </div>
                </label>
              </div>

              <button
                className="complete-btn"
                onClick={handleCompletePayment}
                disabled={processing}
              >
                {processing
                  ? "Processing..."
                  : paymentMethod === "cash"
                  ? "Confirm Cash Payment"
                  : paymentMethod === "bank_transfer"
                  ? "Get Payment Instructions"
                  : "Proceed to Payment"}
              </button>
            </div>
          </div>
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

          .back-button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: white;
            color: #7a1f2b;
            border: 2px solid #7a1f2b;
            border-radius: 8px;
            padding: 0.75rem 1.5rem;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 1.5rem;
          }

          .back-button:hover {
            background: #7a1f2b;
            color: white;
          }

          h1 {
            margin: 0 0 1.5rem 0;
            font-size: 2rem;
            color: #333;
          }

          h2 {
            margin: 0 0 1rem 0;
            font-size: 1.3rem;
            color: #333;
          }

          .checkout-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
          }

          .order-summary,
          .payment-section {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          }

          .items-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 1rem;
          }

          .summary-item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 1rem;
            border-bottom: 1px solid #eee;
          }

          .summary-item:last-child {
            border-bottom: none;
          }

          .item-title {
            margin: 0 0 0.25rem 0;
            font-size: 0.95rem;
            font-weight: 500;
            color: #333;
          }

          .item-student {
            margin: 0;
            font-size: 0.85rem;
            color: #666;
          }

          .item-price {
            margin: 0;
            font-size: 0.95rem;
            font-weight: 600;
            color: #7a1f2b;
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            padding-top: 1rem;
            border-top: 2px solid #eee;
            font-size: 1.2rem;
            font-weight: 600;
          }

          .total-amount {
            color: #7a1f2b;
          }

          .payment-options {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 1.5rem;
          }

          .payment-option {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            border: 2px solid #ddd;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .payment-option:hover {
            border-color: #7a1f2b;
          }

          .payment-option.selected {
            border-color: #7a1f2b;
            background: #fdf5f6;
          }

          .payment-option input[type="radio"] {
            cursor: pointer;
          }

          .option-title {
            margin: 0 0 0.25rem 0;
            font-size: 1rem;
            font-weight: 600;
            color: #333;
          }

          .option-desc {
            margin: 0;
            font-size: 0.85rem;
            color: #666;
          }

          .complete-btn {
            width: 100%;
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

          .complete-btn:hover:not(:disabled) {
            background: #5d1721;
          }

          .complete-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
          }

          @media (max-width: 768px) {
            .checkout-content {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 640px) {
            .page {
              padding: 1rem 0.75rem;
            }

            h1 {
              font-size: 1.5rem;
            }

            h2 {
              font-size: 1.1rem;
            }
          }
        `}</style>
      </main>
    </>
  );
}
