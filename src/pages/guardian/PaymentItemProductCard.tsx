import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from '../../lib/supabase';
import { GuardianHeader } from '../../components/GuardianHeader';
import { useCart } from '../../context/CartContext';

/**
 * Types
 */
type ScheduleSlot = {
  day: string;
  startTime: string;
  endTime: string;
};

type PaymentItem = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  due_date: string | null;
  icon_url: string | null;
  is_mandatory: boolean;
  max_capacity: number | null;
  location: string | null;
  schedule: ScheduleSlot[] | null;
};

type Student = {
  id: string;
  first_name: string;
  last_name: string;
};

type Guardian = {
  id: string;
  access_token: string;
  first_name: string;
  last_name: string;
};

const ICON_BUCKET = "payment-item-icons"; // change if needed

/**
 * Page
 */
export function PaymentItemProductCard() {
  const { paymentItemId, studentId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [paymentItem, setPaymentItem] = useState<PaymentItem | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [guardian, setGuardian] = useState<Guardian | null>(null);
  const [availablePositions, setAvailablePositions] = useState<number | null>(
    null
  );
  const [isInCart, setIsInCart] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (!paymentItemId || !studentId || !token) {
      setError("Invalid access link.");
      setLoading(false);
      return;
    }

    loadData();
  }, [paymentItemId, studentId, token]);

  async function loadData() {
    try {
      setLoading(true);

      /**
       * 1. Resolve guardian (security check)
       */
      const { data: guardian, error: guardianError } = await supabase
        .from("guardians")
        .select("id, access_token, first_name, last_name")
        .eq("access_token", token)
        .single<Guardian>();

      if (guardianError || !guardian) {
        throw new Error("Invalid or expired access link.");
      }

      setGuardian(guardian);

      /**
       * 2. Load student (must belong to guardian)
       */
      const { data: studentLink, error: studentError } = await supabase
        .from("student_guardians")
        .select(
          `
          students (
            id,
            first_name,
            last_name
          )
        `
        )
        .eq("guardian_id", guardian.id)
        .eq("student_id", studentId)
        .single();

      if (studentError || !studentLink?.students) {
        throw new Error("Student not found.");
      }

      setStudent(studentLink.students);

      /**
       * 3. Load payment item
       */
      const { data: item, error: itemError } = await supabase
        .from("payment_items")
        .select(
          `
          id,
          title,
          description,
          amount,
          due_date,
          icon_url,
          is_mandatory,
          max_capacity,
          location,
          schedule
        `
        )
        .eq("id", paymentItemId)
        .single<PaymentItem>();

      if (itemError || !item) {
        throw new Error("Payment item not found.");
      }

      setPaymentItem(item);

      /**
       * 4. Calculate available positions (OPT‑IN ONLY)
       */
      if (!item.is_mandatory && item.max_capacity) {
        const { count } = await supabase
          .from("payment_item_students")
          .select("*", { count: "exact", head: true })
          .eq("payment_item_id", item.id);

        const remaining = item.max_capacity - (count || 0);
        setAvailablePositions(Math.max(remaining, 0));
      }

      /**
       * 5. Check if payment has already been made
       */
      // If item is $0, it's automatically considered paid
      if (item.amount === 0) {
        setIsPaid(true);
      } else {
        const { data: pisRecord } = await supabase
          .from("payment_item_students")
          .select("id")
          .eq("payment_item_id", item.id)
          .eq("student_id", studentId)
          .maybeSingle();

        if (pisRecord) {
          const { data: payments } = await supabase
            .from("payments")
            .select("amount")
            .eq("payment_item_student_id", pisRecord.id)
            .not("verified_at", "is", null);

          if (payments && payments.length > 0) {
            const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
            setIsPaid(totalPaid >= item.amount);
          }
        }
      }

      /**
       * 6. Check if item is already in cart
       */
      const { data: cartItem } = await supabase
        .from("shopping_cart_items")
        .select("id")
        .eq("guardian_id", guardian.id)
        .eq("payment_item_id", item.id)
        .eq("student_id", studentId)
        .maybeSingle();

      setIsInCart(!!cartItem);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart() {
    if (!guardian || !paymentItemId || !studentId || !token) return;

    try {
      setAddingToCart(true);

      const { error } = await supabase.from("shopping_cart_items").insert({
        guardian_id: guardian.id,
        payment_item_id: paymentItemId,
        student_id: studentId,
      });

      if (error) throw error;

      setIsInCart(true);
      await refreshCartCount(token);
    } catch (err: any) {
      alert(err.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  }

  function handleViewCart() {
    if (token) {
      navigate(`/guardian/shopping-cart?token=${token}`);
    }
  }

  function getIconUrl(path: string | null) {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const { data } = supabase.storage.from(ICON_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading…</p>;
  }

  if (error || !paymentItem || !student) {
    return (
      <p style={{ padding: "2rem", color: "darkred" }}>
        {error || "Unable to load item."}
      </p>
    );
  }

  return (
    <>
      <GuardianHeader guardianName={guardian ? `${guardian.first_name} ${guardian.last_name}` : undefined} />
      <main className="page">
        <section className="container">
        <button
          onClick={() => navigate(`/guardian/${token}`)}
          className="back-button"
        >
          <ArrowLeft size={20} />
          <span>Back to Payment Items</span>
        </button>

        <div className="card">
          {paymentItem.icon_url && (
            <img
              src={getIconUrl(paymentItem.icon_url) || undefined}
              alt=""
              className="hero"
            />
          )}

          <div className="content">
          {isPaid && (
            <div className="paid-banner">PAID</div>
          )}
          <h1>{paymentItem.title}</h1>

          <p className="student">
            For: <strong>{student.first_name} {student.last_name}</strong>
          </p>

          <div className="badges">
            {paymentItem.is_mandatory ? (
              <span className="badge mandatory">Mandatory</span>
            ) : (
              <span className="badge optional">Optional</span>
            )}
          </div>

          {!paymentItem.is_mandatory && availablePositions !== null && (
            <p className="stock">
              Available positions: <strong>{availablePositions}</strong>
            </p>
          )}

          <p className="price">
            TTD <strong>${paymentItem.amount}</strong>
          </p>

          {paymentItem.description && (
            <p className="description">{paymentItem.description}</p>
          )}

          {paymentItem.location && (
            <p className="meta">
              <strong>Location:</strong> {paymentItem.location}
            </p>
          )}

          {paymentItem.schedule && paymentItem.schedule.length > 0 && (
            <p className="meta">
              <strong>Schedule:</strong>{" "}
              {paymentItem.schedule.map((s, i) => (
                <span key={i}>
                  {s.day.substring(0, 3)} {s.startTime}–{s.endTime}
                  {i < paymentItem.schedule!.length - 1 && " • "}
                </span>
              ))}
            </p>
          )}

          {paymentItem.due_date && (
            <p className="meta">
              <strong>Payment due by:</strong>{" "}
              {new Date(paymentItem.due_date).toLocaleDateString()}
            </p>
          )}

          {isPaid ? (
            <p className="paid-notice">
              This item has already been paid for.
            </p>
          ) : isInCart ? (
            <button className="primary" onClick={handleViewCart}>
              View Cart
            </button>
          ) : (
            <button
              className="primary"
              onClick={handleAddToCart}
              disabled={availablePositions === 0 || addingToCart}
            >
              {availablePositions === 0
                ? "No positions available"
                : addingToCart
                ? "Adding to cart..."
                : "Add to Cart"}
            </button>
          )}
          </div>
        </div>
      </section>

      <style>{`
        .page {
          padding: 2rem 1rem;
          background: #fafafa;
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
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 0.65rem 1rem;
          font-size: 0.95rem;
          cursor: pointer;
          color: #333;
          margin-bottom: 1.5rem;
          transition: all 0.15s ease;
        }

        .back-button:hover {
          background: #f5f5f5;
          border-color: #7a1f2b;
          color: #7a1f2b;
        }

        .back-button:active {
          transform: scale(0.98);
        }

        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .hero {
          width: 100%;
          height: 280px;
          object-fit: cover;
          background: #eee;
        }

        .content {
          padding: 1.5rem;
          position: relative;
        }

        .paid-banner {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #dc3545;
          color: white;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 0.5rem 1.2rem;
          border-radius: 6px;
          box-shadow: 0 3px 8px rgba(220, 53, 69, 0.4);
          z-index: 10;
        }

        h1 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
        }

        .student {
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
        }

        .badges {
          margin-bottom: 0.75rem;
        }

        .badge {
          font-size: 0.75rem;
          padding: 0.3rem 0.6rem;
          border-radius: 999px;
        }

        .mandatory {
          background: #7a1f2b;
          color: white;
        }

        .optional {
          background: #e6e6e6;
          color: #333;
        }

        .stock {
          font-size: 0.85rem;
          margin-bottom: 0.75rem;
        }

        .price {
          font-size: 1.2rem;
          margin: 0.75rem 0;
        }

        .description {
          font-size: 0.9rem;
          color: #444;
          margin-bottom: 1rem;
        }

        .meta {
          font-size: 0.85rem;
          margin-bottom: 0.4rem;
        }

        .primary {
          margin-top: 1.25rem;
          width: 100%;
          padding: 0.75rem;
          font-size: 0.95rem;
          border-radius: 8px;
          border: none;
          background: #7a1f2b;
          color: white;
          cursor: pointer;
        }

        .primary:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .mandatory-notice {
          margin-top: 1.25rem;
          padding: 0.75rem;
          background: #f0f8ff;
          border: 1px solid #7a1f2b;
          border-radius: 8px;
          color: #333;
          font-size: 0.9rem;
          text-align: center;
        }

        .paid-notice {
          margin-top: 1.25rem;
          padding: 0.75rem;
          background: #f8d7da;
          border: 2px solid #dc3545;
          border-radius: 8px;
          color: #721c24;
          font-size: 0.9rem;
          font-weight: 600;
          text-align: center;
        }

        @media (max-width: 480px) {
          .hero {
            height: 200px;
          }
        }
      `}</style>
      </main>
    </>
  );
}
