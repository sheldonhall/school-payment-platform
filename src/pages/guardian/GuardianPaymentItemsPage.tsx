import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from '../../lib/supabase';
import { GuardianHeader } from '../../components/GuardianHeader';
import { useCart } from '../../context/CartContext';

/**
 * Types (kept explicit for clarity)
 */
type Guardian = {
  id: string;
  access_token: string;
  first_name: string;
  last_name: string;
};

type Student = {
  id: string;
  first_name: string;
  last_name: string;
};

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
  status: string;
  icon_url: string | null;
  is_mandatory: boolean;
  max_capacity: number | null;
  schedule: ScheduleSlot[] | null;
};

type PaymentItemWithContext = {
  paymentItem: PaymentItem;
  student: Student;
  isPaid: boolean;
};

/**
 * CONFIG
 */
const ICON_BUCKET = "payment-item-icons"; // change if needed

/**
 * PAGE
 */
export function GuardianPaymentItemsPage() {
  const { token: tokenFromParams } = useParams();
  const [searchParams] = useSearchParams();
  const tokenFromQuery = searchParams.get("token");
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();
  const token = tokenFromParams || tokenFromQuery;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<PaymentItemWithContext[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("all");
  const [guardianName, setGuardianName] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setError("Missing access token.");
      setLoading(false);
      return;
    }

    loadData(token);
  }, [token]);




const handleStartNewTerm = async () => {

    try {

      //get guardian by their token
      const { data: guardian, error: guardianError } = await supabase
        .from('guardians')
        .select('id')
        .eq('access_token', token)
        .maybeSingle();

      //if they're is an error getting guardian
      if (guardianError || !guardian) {
        throw new Error('Guardian not found.');
      }

      //find active and mandatory payment items
      const { data: mandatoryItems, error: itemsError } = await supabase
        .from('payment_items')
        .select('id')
        .eq('status', 'Active')
        .eq('is_mandatory', true);

      if (itemsError) throw itemsError;

      //find student_guardian relationship for the current guardian
      const { data: studentLinks, error: studentLinksError } = await supabase
        .from('student_guardians')
        .select('student_id')
        .eq('guardian_id', guardian.id);

      if (studentLinksError) throw studentLinksError;

      
      const studentIds = studentLinks.map((link: any) => link.student_id);

      const { data: paymentItemStudents, error: pisError } = await supabase
        .from('payment_item_students')
        .select('id, payment_item_id, student_id, payment_items(amount)')
        .in('payment_item_id', mandatoryItems.map((item) => item.id))
        .in('student_id', studentIds);

      if (pisError) throw pisError;

      const cartItemsToAdd = [];
      for (const link of paymentItemStudents || []) {
        const itemAmount = parseFloat((link.payment_items as any)?.amount || 0);

        // Skip $0 items - they are automatically considered paid
        //if (itemAmount === 0) {
        //  continue;
        //}

        // Check if this item is already fully paid
        const { data: payments } = await supabase
          .from('payments')
          .select('amount')
          .eq('payment_item_student_id', link.id)
          .not('verified_at', 'is', null);

        const totalPaid = (payments || []).reduce(
          (sum, p) => sum + parseFloat(p.amount || 0),
          0
        );

        // Only add to cart if not fully paid
        if (totalPaid < itemAmount || (payments.length == 0 && itemAmount == 0 )) {
          console.log("I am here");
          cartItemsToAdd.push({
            guardian_id: guardian.id,
            payment_item_id: link.payment_item_id,
            student_id: link.student_id,
          });
        }
      }

      if (cartItemsToAdd.length > 0) {
        const { error: insertError } = await supabase
          .from('shopping_cart_items')
          .upsert(cartItemsToAdd, {
            onConflict: 'guardian_id,payment_item_id,student_id',
            ignoreDuplicates: true,
          });

        if (insertError) throw insertError;
      }
    } catch (err: any) {
      alert(err.message || 'Failed to start new term.');
    } finally {
      await refreshCartCount(token);
    }
  };


  

  async function loadData(accessToken: string) {
    try {
      setLoading(true);
      await handleStartNewTerm();
      
      /**
       * 1. Resolve guardian via access_token
       */
      const { data: guardian, error: guardianError } = await supabase
        .from("guardians")
        .select("id, access_token, first_name, last_name")
        .eq("access_token", accessToken)
        .single<Guardian>();

      if (guardianError || !guardian) {
        throw new Error("Invalid or expired access link.");
      }

      setGuardianName(`${guardian.first_name} ${guardian.last_name}`);

      /**
       * 2. Get guardian's students
       */
      const { data: studentLinks, error: studentLinkError } = await supabase
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
        .eq("guardian_id", guardian.id);

      if (studentLinkError || !studentLinks) {
        throw new Error("Unable to load students.");
      }

      const students: Student[] = studentLinks
        .map((l: any) => l.students)
        .filter(Boolean);

      if (students.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      /**
       * 3. Get payment_item_students for those students
       */
      const studentIds = students.map((s) => s.id);

      const { data: itemStudentLinks, error: linkError } = await supabase
        .from("payment_item_students")
        .select("payment_item_id, student_id")
        .in("student_id", studentIds);

      if (linkError || !itemStudentLinks) {
        throw new Error("Unable to load payment items.");
      }

      if (itemStudentLinks.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      /**
       * 4. Load active payment items
       */
      const paymentItemIds = [
        ...new Set(itemStudentLinks.map((l) => l.payment_item_id)),
      ];

      const { data: paymentItems, error: itemsError } = await supabase
        .from("payment_items")
        .select(
          `
          id,
          title,
          description,
          amount,
          due_date,
          status,
          icon_url,
          is_mandatory,
          max_capacity,
          schedule
        `
        )
        .in("id", paymentItemIds)
        .eq("status", "Active");

      if (itemsError || !paymentItems) {
        throw new Error("Unable to load payment items.");
      }

      /**
       * 5. Check payment status for each payment_item + student combination
       */
      const { data: paymentItemStudents, error: pisError } = await supabase
        .from("payment_item_students")
        .select("id, payment_item_id, student_id")
        .in("student_id", studentIds)
        .in("payment_item_id", paymentItemIds);

      if (pisError) {
        throw new Error("Unable to load payment status.");
      }

      const pisIds = (paymentItemStudents || []).map((pis) => pis.id);

      let paidPaymentItemStudentIds: string[] = [];

      // First, mark all $0 items as paid
      /*paymentItemStudents?.forEach((pis) => {
        const item = paymentItems.find((i) => i.id === pis.payment_item_id);
        if (item && item.amount === 0) {
          paidPaymentItemStudentIds.push(pis.id);
        }
      });*/

      // Then check actual payments for non-zero items
      if (pisIds.length > 0) {
        const { data: payments, error: paymentsError } = await supabase
          .from("payments")
          .select("payment_item_student_id, amount")
          .in("payment_item_student_id", pisIds)
          .not("verified_at", "is", null);

        if (!paymentsError && payments) {
          const paymentSums = new Map<string, number>();
          payments.forEach((p) => {
            const current = paymentSums.get(p.payment_item_student_id) || 0;
            paymentSums.set(p.payment_item_student_id, current + (p.amount || 0));
          });

          const paidFromPayments = Array.from(paymentSums.entries())
            .filter(([pisId, totalPaid]) => {
              const pis = paymentItemStudents?.find((p) => p.id === pisId);
              if (!pis) return false;
              const item = paymentItems.find((i) => i.id === pis.payment_item_id);
              return item && totalPaid >= item.amount;
            })
            .map(([pisId]) => pisId);

          paidPaymentItemStudentIds = [...paidPaymentItemStudentIds, ...paidFromPayments];
        }
      }

      /**
       * 6. Build final duplicated list (ONE PER CHILD)
       */
      const finalItems: PaymentItemWithContext[] = [];

      for (const link of itemStudentLinks) {
        const paymentItem = paymentItems.find(
          (p) => p.id === link.payment_item_id
        );
        const student = students.find((s) => s.id === link.student_id);

        if (!paymentItem || !student) continue;

        const pisRecord = paymentItemStudents?.find(
          (pis) => pis.payment_item_id === link.payment_item_id && pis.student_id === link.student_id
        );

        const isPaid = pisRecord ? paidPaymentItemStudentIds.includes(pisRecord.id) : false;

        finalItems.push({
          paymentItem,
          student,
          isPaid,
        });
      }

      // Sort: mandatory items first, then optional items
      finalItems.sort((a, b) => {
        if (a.paymentItem.is_mandatory && !b.paymentItem.is_mandatory) return -1;
        if (!a.paymentItem.is_mandatory && b.paymentItem.is_mandatory) return 1;
        return 0;
      });

      setItems(finalItems);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Helpers
   */
  function getIconUrl(path: string | null) {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const { data } = supabase.storage.from(ICON_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  const uniqueStudents = useMemo(() => {
    const studentMap = new Map<string, Student>();
    items.forEach((item) => {
      if (!studentMap.has(item.student.id)) {
        studentMap.set(item.student.id, item.student);
      }
    });
    return Array.from(studentMap.values());
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedStudentId === "all") {
      return items;
    }
    return items.filter((item) => item.student.id === selectedStudentId);
  }, [items, selectedStudentId]);

  const content = useMemo(() => {
    if (loading) return <p>Loading payment items…</p>;
    if (error) return <p style={{ color: "darkred" }}>{error}</p>;
    if (items.length === 0)
      return <p>No payment items available at this time.</p>;

    return (
      <div className="grid">
        {filteredItems.map((entry, idx) => (
        <Link
            to={`/guardian/payment-items/${entry.paymentItem.id}/${entry.student.id}?token=${token}`}
            className="card-link"
            key={`${entry.paymentItem.id}-${entry.student.id}-${idx}`}
          >
          <div className="card">
            {entry.paymentItem.icon_url && (
              <img
                src={getIconUrl(entry.paymentItem.icon_url) || undefined}
                alt=""
                className="icon"
              />
            )}

            <div className="card-body">
              {entry.isPaid && (
                <div className="paid-banner">PAID</div>
              )}
              <div className="header-row">
                <h3>{entry.paymentItem.title}</h3>
                {entry.paymentItem.is_mandatory ? (
                  <span className="badge mandatory">Mandatory</span>
                ) : (
                  <span className="badge optional">Optional</span>
                )}
              </div>

              <p className="student">
                For: <strong>{entry.student.first_name} {entry.student.last_name}</strong>
              </p>

              <p className="amount">
                <strong>TTD ${entry.paymentItem.amount}</strong>
              </p>

              {entry.paymentItem.schedule && entry.paymentItem.schedule.length > 0 && (
                <p className="schedule">
                  {entry.paymentItem.schedule.map((s, i) => (
                    <span key={i} className="schedule-item">
                      {s.day.substring(0, 3)} {s.startTime}–{s.endTime}
                      {i < entry.paymentItem.schedule!.length - 1 && " • "}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>
        </Link>
        ))}
      </div>
    );
  }, [loading, error, items, filteredItems, token]);

  return (
    <>
      <GuardianHeader guardianName={guardianName} />
      <main className="page">
        <section className="container">
          {uniqueStudents.length > 1 && (
            <div className="filter-section">
              <label htmlFor="student-filter" className="filter-label">
                Filter by child:
              </label>
              <select
                id="student-filter"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="filter-select"
              >
                <option value="all">All</option>
                {uniqueStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {content}
        </section>

      <style>{`
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

        .filter-section {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.04);
        }

        .filter-label {
          font-size: 0.95rem;
          font-weight: 500;
          color: #333;
          margin: 0;
        }

        .filter-select {
          flex: 1;
          max-width: 300px;
          padding: 0.5rem 0.75rem;
          font-size: 0.95rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .filter-select:hover {
          border-color: #7a1f2b;
        }

        .filter-select:focus {
          outline: none;
          border-color: #7a1f2b;
          box-shadow: 0 0 0 3px rgba(122, 31, 43, 0.1);
        }

        .card-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .card-link:focus-visible {
          outline: 2px solid #7a1f2b;
          outline-offset: 4px;
        }

        .card {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .card-link:hover .card {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.1);
        }


        .page {
          padding: 2rem 1rem;
          background: #fafafa;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.25rem;
        }

        .card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .icon {
          width: 100%;
          height: 160px;
          object-fit: cover;
          background: #eee;
        }

        .card-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          position: relative;
        }

        .paid-banner {
          position: absolute;
          top: -0.5rem;
          right: 0.5rem;
          background: #dc3545;
          color: white;
          font-weight: 700;
          font-size: 0.8rem;
          padding: 0.4rem 1rem;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(220, 53, 69, 0.4);
          z-index: 10;
        }

        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
        }

        h3 {
          font-size: 1rem;
          margin: 0;
        }

        .badge {
          font-size: 0.7rem;
          padding: 0.25rem 0.5rem;
          border-radius: 999px;
          white-space: nowrap;
        }

        .mandatory {
          background: #7a1f2b;
          color: white;
        }

        .optional {
          background: #e6e6e6;
          color: #333;
        }

        .student {
          font-size: 0.85rem;
        }

        .desc {
          font-size: 0.85rem;
          color: #555;
        }

        .amount, .due {
          font-size: 0.8rem;
        }

        .schedule {
          font-size: 0.75rem;
          color: #666;
          line-height: 1.4;
        }

        .schedule-item {
          white-space: nowrap;
        }

        @media (max-width: 480px) {
          .page {
            padding: 1rem 0.75rem;
          }

          .filter-section {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }

          .filter-select {
            max-width: 100%;
          }
        }
      `}</style>
      </main>
    </>
  );
}
