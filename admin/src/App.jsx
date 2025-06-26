import React from 'react';
import OrderDashboard from './OrderDashboard';
import { OrderProvider } from './OrderContext.jsx';

function AdminApp() {
  return (
    <OrderProvider>
      <OrderDashboard />
    </OrderProvider>
  );
}

export default AdminApp;
