import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PaymentItemsList } from './pages/admin/PaymentItemsList';
import { CreatePaymentItem } from './pages/admin/CreatePaymentItem';
import { EditPaymentItem } from './pages/admin/EditPaymentItem';
import { PaymentItemDetail } from './pages/admin/PaymentItemDetail';
import { Reconciliation } from './pages/admin/Reconciliation';
import { Payments } from './pages/admin/Payments';
import { Students } from './pages/admin/Students';
import { Teachers } from './pages/admin/Teachers';
import { Classes } from './pages/admin/Classes';
import { Testing } from './pages/admin/Testing';
import { GuardianPaymentItemsPage } from './pages/guardian/GuardianPaymentItemsPage';
import { PaymentItemProductCard } from './pages/guardian/PaymentItemProductCard';
import { ShoppingCart } from './pages/guardian/ShoppingCart';
import { ShoppingCartCheckout } from './pages/guardian/ShoppingCartCheckout';
import { BankTransferInstructions } from './pages/guardian/BankTransferInstructions';
import { WiPayPayment } from './pages/guardian/WiPayPayment';
import { CashPaymentComplete } from './pages/guardian/CashPaymentComplete';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/payment-items" element={<PaymentItemsList />} />
        <Route path="/admin/payment-items/new" element={<CreatePaymentItem />} />
        <Route path="/admin/payment-items/:id/edit" element={<EditPaymentItem />} />
        <Route path="/admin/payment-items/:id" element={<PaymentItemDetail />} />
        <Route path="/admin/payments" element={<Payments />} />
        <Route path="/admin/reconciliation" element={<Reconciliation />} />
        <Route path="/admin/students" element={<Students />} />
        <Route path="/admin/teachers" element={<Teachers />} />
        <Route path="/admin/classes" element={<Classes />} />
          <Route path="/admin/testing" element={<Testing />} />
        <Route path="/guardian/:token" element={<GuardianPaymentItemsPage />} />
        <Route path="/guardian/:token/payment-items" element={<GuardianPaymentItemsPage />} />
        <Route path="/guardian/payment-items/:paymentItemId/:studentId" element={<PaymentItemProductCard />} />
        <Route path="/guardian/shopping-cart" element={<ShoppingCart />} />
        <Route path="/guardian/shopping-cart/checkout" element={<ShoppingCartCheckout />} />
        <Route path="/guardian/payment/bank-transfer" element={<BankTransferInstructions />} />
        <Route path="/guardian/payment/wipay" element={<WiPayPayment />} />
        <Route path="/guardian/payment/cash-complete" element={<CashPaymentComplete />} />
      </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
