import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Copy, CheckCircle, ArrowLeft } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { GuardianHeader } from "../../components/GuardianHeader";

type OrderItem = {
  payment_item: {
    title: string;
  };
  student: {
    first_name: string;
    last_name: string;
  };
  amount: number;
};

export function BankTransferInstructions() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const referenceNumber = searchParams.get("ref");
  const orderId = searchParams.get("order");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [guardianName, setGuardianName] = useState<string>("");

  useEffect(() => {
    if (!token || !referenceNumber || !orderId) {
      setError("Invalid payment link.");
      setLoading(false);
      return;
    }

    loadOrderDetails();
  }, [token, referenceNumber, orderId]);

  async function loadOrderDetails() {
    try {
      setLoading(true);

      const { data: guardian } = await supabase
        .from("guardians")
        .select("first_name, last_name")
        .eq("access_token", token)
        .maybeSingle();

      if (guardian) {
        setGuardianName(`${guardian.first_name} ${guardian.last_name}`);
      }

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("total_amount")
        .eq("id", orderId)
        .maybeSingle();

      if (orderError || !order) {
        throw new Error("Order not found.");
      }

      setTotalAmount(order.total_amount);

      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select(
          `
          amount,
          payment_items (
            title
          ),
          students (
            first_name,
            last_name
          )
        `
        )
        .eq("order_id", orderId);

      if (itemsError) throw itemsError;

      const formattedItems: OrderItem[] = (items || []).map((item: any) => ({
        payment_item: item.payment_items,
        student: item.students,
        amount: item.amount,
      }));

      setOrderItems(formattedItems);
    } catch (err: any) {
      setError(err.message || "Failed to load order details.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopyReference() {
    if (referenceNumber) {
      navigator.clipboard.writeText(referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) {
    return (
      <>
        <GuardianHeader guardianName={guardianName} />
        <main className="page">
          <p>Loading payment instructions...</p>
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
            onClick={() => navigate(`/guardian/shopping-cart/checkout?token=${token}`)}
            className="back-button"
          >
            <ArrowLeft size={20} />
            <span>Back to Checkout</span>
          </button>

          <div className="success-icon">
            <CheckCircle size={64} />
          </div>

          <h1>Bank Transfer Instructions</h1>
          <p className="subtitle">Follow these steps to complete your payment</p>

          <div className="reference-box">
            <div className="reference-label">Payment Reference Number</div>
            <div className="reference-number">
              <span className="ref-text">{referenceNumber}</span>
              <button onClick={handleCopyReference} className="copy-btn">
                {copied ? (
                  <>
                    <CheckCircle size={18} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="instructions-card">
            <h2>Payment Instructions</h2>
            <ol className="steps">
              <li>
                <strong>Log in to your online banking portal or mobile app</strong>
                <p>Access your bank's online platform</p>
              </li>
              <li>
                <strong>Add the school as a payee (if not already done)</strong>
                <div className="bank-details">
                  <p><strong>Account Name:</strong> St. Mary's College</p>
                  <p><strong>Account Number:</strong> 123456789</p>
                  <p><strong>Bank:</strong> Republic Bank Limited</p>
                </div>
              </li>
              <li>
                <strong>Make a payment for TTD ${totalAmount.toFixed(2)}</strong>
                <p>This is the total amount for your order</p>
              </li>
              <li>
                <strong>IMPORTANT: Enter the reference number in the payment comment/reference field</strong>
                <div className="important-note">
                  <p>Copy and paste this reference number EXACTLY as shown:</p>
                  <p className="highlight-ref">{referenceNumber}</p>
                  <p className="warning">
                    If making multiple payments, use the SAME reference number for each payment.
                  </p>
                </div>
              </li>
              <li>
                <strong>Submit your payment</strong>
                <p>Review and confirm the transaction</p>
              </li>
            </ol>
          </div>

          <div className="order-summary-card">
            <h2>Order Summary</h2>
            <div className="items-list">
              {orderItems.map((item, index) => (
                <div key={index} className="item-row">
                  <div>
                    <p className="item-title">{item.payment_item.title}</p>
                    <p className="item-student">
                      {item.student.first_name} {item.student.last_name}
                    </p>
                  </div>
                  <p className="item-amount">TTD ${item.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="total-row">
              <span>Total Amount:</span>
              <span className="total-amount">TTD ${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="notification-card">
            <p>
              <strong>What happens next?</strong>
            </p>
            <p>
              After you complete the bank transfer, you will receive a notification when the transaction
              is verified by the school. This process may take up to <strong>3 business days</strong>.
            </p>
          </div>

          <button
            onClick={() => navigate(`/guardian/${token}/payment-items`)}
            className="done-btn"
          >
            Done
          </button>
        </div>

        <style>{`
          .page {
            padding: 2rem 1rem;
            background: #fafafa;
            min-height: calc(100vh - 80px);
          }

          .container {
            max-width: 800px;
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

          .success-icon {
            display: flex;
            justify-content: center;
            color: #28a745;
            margin: 1rem 0;
          }

          h1 {
            margin: 1rem 0 0.5rem 0;
            font-size: 2rem;
            color: #333;
            text-align: center;
          }

          .subtitle {
            text-align: center;
            color: #666;
            font-size: 1.1rem;
            margin-bottom: 2rem;
          }

          h2 {
            margin: 0 0 1rem 0;
            font-size: 1.3rem;
            color: #333;
          }

          .reference-box {
            background: linear-gradient(135deg, #7a1f2b 0%, #5d1721 100%);
            color: white;
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 2rem;
            text-align: center;
            box-shadow: 0 8px 24px rgba(122, 31, 43, 0.3);
          }

          .reference-label {
            font-size: 0.9rem;
            opacity: 0.9;
            margin-bottom: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .reference-number {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .ref-text {
            font-size: 2rem;
            font-weight: 700;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
          }

          .copy-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.5);
            border-radius: 8px;
            padding: 0.75rem 1.25rem;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.2s;
            font-weight: 600;
          }

          .copy-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: white;
          }

          .instructions-card,
          .order-summary-card,
          .notification-card {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          }

          .steps {
            list-style: none;
            counter-reset: step-counter;
            padding: 0;
          }

          .steps li {
            counter-increment: step-counter;
            position: relative;
            padding-left: 3rem;
            margin-bottom: 2rem;
          }

          .steps li:last-child {
            margin-bottom: 0;
          }

          .steps li::before {
            content: counter(step-counter);
            position: absolute;
            left: 0;
            top: 0;
            width: 2rem;
            height: 2rem;
            background: #7a1f2b;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
          }

          .steps li strong {
            display: block;
            margin-bottom: 0.5rem;
            color: #333;
            font-size: 1.05rem;
          }

          .steps li p {
            margin: 0.5rem 0;
            color: #666;
          }

          .bank-details {
            background: #f8f9fa;
            border-left: 4px solid #7a1f2b;
            padding: 1rem;
            margin-top: 0.75rem;
            border-radius: 4px;
          }

          .bank-details p {
            margin: 0.5rem 0;
            color: #333;
          }

          .important-note {
            background: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 8px;
            padding: 1rem;
            margin-top: 0.75rem;
          }

          .important-note p {
            margin: 0.5rem 0;
          }

          .highlight-ref {
            font-family: 'Courier New', monospace;
            font-size: 1.2rem;
            font-weight: 700;
            color: #7a1f2b;
            background: white;
            padding: 0.75rem;
            border-radius: 6px;
            text-align: center;
          }

          .warning {
            color: #856404;
            font-weight: 600;
          }

          .items-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 1rem;
          }

          .item-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 1rem;
            border-bottom: 1px solid #eee;
          }

          .item-row:last-child {
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

          .item-amount {
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

          .notification-card p {
            margin: 0.75rem 0;
            color: #666;
            line-height: 1.6;
          }

          .notification-card p:first-child {
            color: #333;
            font-size: 1.05rem;
          }

          .done-btn {
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

          .done-btn:hover {
            background: #5d1721;
          }

          @media (max-width: 640px) {
            .page {
              padding: 1rem 0.75rem;
            }

            h1 {
              font-size: 1.5rem;
            }

            .ref-text {
              font-size: 1.5rem;
            }

            .instructions-card,
            .order-summary-card,
            .notification-card {
              padding: 1.5rem;
            }

            .steps li {
              padding-left: 2.5rem;
            }
          }
        `}</style>
      </main>
    </>
  );
}
