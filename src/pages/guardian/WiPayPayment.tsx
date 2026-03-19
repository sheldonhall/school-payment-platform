import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CreditCard, Lock, ArrowLeft } from "lucide-react";
import { GuardianHeader } from "../../components/GuardianHeader";
import { supabase } from "../../lib/supabase";

export function WiPayPayment() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const orderId = searchParams.get("order");
  const amount = searchParams.get("amount");
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [guardianName, setGuardianName] = useState<string>("");

  useEffect(() => {
    if (token) {
      loadGuardianInfo();
    }
  }, [token]);

  async function loadGuardianInfo() {
    const { data: guardian } = await supabase
      .from("guardians")
      .select("first_name, last_name")
      .eq("access_token", token)
      .maybeSingle();

    if (guardian) {
      setGuardianName(`${guardian.first_name} ${guardian.last_name}`);
    }
  }

  function formatCardNumber(value: string) {
    const cleaned = value.replace(/\s/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  }

  function handleCardNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\s/g, "");
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(formatCardNumber(value));
    }
  }

  function handleExpiryChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    if (value.length <= 5) {
      setExpiryDate(value);
    }
  }

  function handleCvvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setCvv(value);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      alert("Please fill in all card details.");
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      alert("Payment processed successfully! (This is a demo - no actual payment was made)");
      navigate(`/guardian/${token}/payment-items`);
    }, 2000);
  }

  return (
    <>
      <GuardianHeader guardianName={guardianName} />
      <main className="page">
        <div className="container">
          <button
            onClick={() => navigate(`/guardian/shopping-cart/checkout?token=${token}`)}
            className="back-button"
          >
            <ArrowLeft size={20} />
            <span>Back to Checkout</span>
          </button>

          <div className="wipay-header">
            <CreditCard size={48} />
            <h1>WIPay Payment</h1>
            <p className="subtitle">Secure payment processing</p>
          </div>

          <div className="payment-card">
            <div className="amount-display">
              <span className="amount-label">Total Amount</span>
              <span className="amount-value">TTD ${amount}</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <div className="input-with-icon">
                  <CreditCard size={20} className="input-icon" />
                  <input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="cardName">Cardholder Name</label>
                <input
                  id="cardName"
                  type="text"
                  placeholder="JOHN DOE"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    id="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={handleCvvChange}
                    required
                  />
                </div>
              </div>

              <div className="security-notice">
                <Lock size={16} />
                <span>Your payment information is secure and encrypted</span>
              </div>

              <button type="submit" className="pay-btn" disabled={processing}>
                {processing ? "Processing Payment..." : `Pay TTD $${amount}`}
              </button>
            </form>
          </div>

          <div className="trust-badges">
            <div className="badge">
              <Lock size={20} />
              <span>SSL Encrypted</span>
            </div>
            <div className="badge">
              <CreditCard size={20} />
              <span>PCI Compliant</span>
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
            max-width: 600px;
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

          .wipay-header {
            text-align: center;
            margin-bottom: 2rem;
            color: #7a1f2b;
          }

          .wipay-header svg {
            margin: 0 auto 1rem;
          }

          h1 {
            margin: 0 0 0.5rem 0;
            font-size: 2rem;
            color: #7a1f2b;
            font-weight: 700;
          }

          .subtitle {
            margin: 0;
            color: #666;
            font-size: 1rem;
          }

          .payment-card {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
            margin-bottom: 1.5rem;
          }

          .amount-display {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, #7a1f2b 0%, #5d1721 100%);
            color: white;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 2rem;
          }

          .amount-label {
            font-size: 0.95rem;
            opacity: 0.9;
          }

          .amount-value {
            font-size: 1.8rem;
            font-weight: 700;
          }

          form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }

          label {
            font-size: 0.9rem;
            font-weight: 600;
            color: #333;
          }

          input {
            padding: 0.875rem;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.2s;
          }

          input:focus {
            outline: none;
            border-color: #7a1f2b;
          }

          .input-with-icon {
            position: relative;
          }

          .input-with-icon input {
            padding-left: 3rem;
          }

          .input-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: #999;
          }

          .security-notice {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: #f0f9ff;
            color: #0369a1;
            padding: 0.875rem;
            border-radius: 8px;
            font-size: 0.9rem;
          }

          .pay-btn {
            width: 100%;
            padding: 1rem;
            background: #7a1f2b;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
            margin-top: 0.5rem;
          }

          .pay-btn:hover:not(:disabled) {
            background: #5d1721;
          }

          .pay-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
          }

          .trust-badges {
            display: flex;
            justify-content: center;
            gap: 2rem;
            flex-wrap: wrap;
          }

          .badge {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #666;
            font-size: 0.9rem;
          }

          @media (max-width: 640px) {
            .page {
              padding: 1rem 0.75rem;
            }

            h1 {
              font-size: 1.5rem;
            }

            .payment-card {
              padding: 1.5rem;
            }

            .amount-value {
              font-size: 1.5rem;
            }

            .form-row {
              grid-template-columns: 1fr;
            }

            .trust-badges {
              gap: 1rem;
            }
          }
        `}</style>
      </main>
    </>
  );
}
