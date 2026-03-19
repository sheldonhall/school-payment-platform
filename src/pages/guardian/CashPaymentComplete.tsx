import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, DollarSign } from "lucide-react";
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

export function CashPaymentComplete() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const orderId = searchParams.get("order");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [guardianName, setGuardianName] = useState<string>("");
  console.log(`order Id is: `+ orderId);
  useEffect(() => {
    if (!token || !orderId) {
      setError("Invalid payment link.");
      setLoading(false);
      return;
    }

    loadOrderDetails();
  }, [token, orderId]);

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
          id,
          amount,
          payment_item_id,
          student_id,
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

      // Create payment records for cash payments
      await createPaymentRecords(items || []);
    } catch (err: any) {
      setError(err.message || "Failed to load order details.");
    } finally {
      setLoading(false);
    }
  }

  async function createPaymentRecords(orderItems: any[]) {
    try {
      for (const item of orderItems) {
        // Find or create payment_item_student record
        let { data: paymentItemStudent, error: pisError } = await supabase
          .from("payment_item_students")
          .select("id")
          .eq("payment_item_id", item.payment_item_id)
          .eq("student_id", item.student_id)
          .maybeSingle();

        if (pisError) throw pisError;

        if (!paymentItemStudent) {
          const { data: newPis, error: createPisError } = await supabase
            .from("payment_item_students")
            .insert({
              payment_item_id: item.payment_item_id,
              student_id: item.student_id,
            })
            .select()
            .single();

          if (createPisError) throw createPisError;
          paymentItemStudent = newPis;
        }

        //update order status
        const { data: existingOrder, error: orderCheckError } = await supabase
          .from("orders")
          .select("id")
          .eq("id", orderId)
          .maybeSingle();

        if (orderCheckError) throw orderCheckError;

        // Only create payment if it doesn't exist yet
        if (existingOrder) {
          await supabase
            .from("orders")
            .update({
              status: "verified",
            })
            .eq("id", orderId);
        }
        
        // Check if payment already exists for this order and payment_item_student
        const { data: existingPayment, error: paymentCheckError } = await supabase
          .from("payments")
          .select("id")
          .eq("order_id", orderId)
          .eq("payment_item_student_id", paymentItemStudent.id)
          .maybeSingle();

        if (paymentCheckError) throw paymentCheckError;

        // Only create payment if it doesn't exist yet
        if (!existingPayment) {
          const { error: paymentError } = await supabase
            .from("payments")
            .insert({
              order_id: orderId,
              verified_at: new Date().toISOString(),
              payment_item_student_id: paymentItemStudent.id,
              amount: item.amount,
              method: "Cash",
            });

          if (paymentError) throw paymentError;
        }
        else
        {
          var paymentId = existingPayment.id;
          await supabase
            .from("payments")
            .update({
              verified_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", paymentId);
        }
      }
    } catch (err: any) {
      console.error("Error creating payment records:", err);
    }
  }

  if (loading) {
    return (
      <>
        <GuardianHeader guardianName={guardianName} />
        <main className="page">
          <p>Loading...</p>
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
          <div className="success-section">
            <div className="success-icon">
              <CheckCircle size={80} />
            </div>
            <h1>Payment Acknowledged</h1>
            <p className="subtitle">Thank you for selecting cash payment</p>
          </div>

          <div className="info-card">
            <div className="info-header">
              <DollarSign size={32} />
              <h2>Please Pay at School Office</h2>
            </div>
            <p className="info-text">
              Your order has been recorded. Please visit the school office to complete your
              payment in cash at your earliest convenience.
            </p>
            <div className="amount-highlight">
              <span className="amount-label">Amount to Pay:</span>
              <span className="amount-value">TTD ${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="order-card">
            <h2>Your Order</h2>
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
              <span>Total:</span>
              <span className="total-amount">TTD ${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="note-card">
            <p>
              <strong>Office Hours:</strong>
            </p>
            <p>Monday - Friday: 8:00 AM - 4:00 PM</p>
            <p className="mt">
              Once your payment is received and verified, you will receive a confirmation.
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
            max-width: 700px;
            margin: 0 auto;
          }

          .success-section {
            text-align: center;
            margin-bottom: 2rem;
          }

          .success-icon {
            display: flex;
            justify-content: center;
            color: #28a745;
            margin-bottom: 1.5rem;
            animation: scaleIn 0.3s ease-out;
          }

          @keyframes scaleIn {
            from {
              transform: scale(0);
            }
            to {
              transform: scale(1);
            }
          }

          h1 {
            margin: 0 0 0.5rem 0;
            font-size: 2rem;
            color: #333;
          }

          .subtitle {
            margin: 0;
            color: #666;
            font-size: 1.1rem;
          }

          h2 {
            margin: 0 0 1rem 0;
            font-size: 1.3rem;
            color: #333;
          }

          .info-card,
          .order-card,
          .note-card {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          }

          .info-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            color: #7a1f2b;
            margin-bottom: 1rem;
          }

          .info-text {
            color: #666;
            line-height: 1.6;
            margin-bottom: 1.5rem;
          }

          .amount-highlight {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, #7a1f2b 0%, #5d1721 100%);
            color: white;
            padding: 1.5rem;
            border-radius: 8px;
          }

          .amount-label {
            font-size: 1rem;
            opacity: 0.9;
          }

          .amount-value {
            font-size: 1.8rem;
            font-weight: 700;
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

          .note-card p {
            margin: 0.5rem 0;
            color: #666;
            line-height: 1.6;
          }

          .note-card p:first-child {
            color: #333;
            font-size: 1.05rem;
          }

          .mt {
            margin-top: 1rem;
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

            .info-card,
            .order-card,
            .note-card {
              padding: 1.5rem;
            }

            .amount-value {
              font-size: 1.5rem;
            }

            .success-icon svg {
              width: 60px;
              height: 60px;
            }
          }
        `}</style>
      </main>
    </>
  );
}
