import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { PlacedOrder, OrderContextType } from '../types/order';

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'booknest_orders_history_v2';

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<PlacedOrder[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(() => {
    return orders.length > 0 ? orders[orders.length - 1] : null;
  });

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Ignore
    }
  }, [orders]);

  const saveOrder = useCallback((order: PlacedOrder) => {
    setOrders((prev) => [...prev, order]);
    setLastOrder(order);
  }, []);

  const getOrderById = useCallback((orderId: string): PlacedOrder | null => {
    return orders.find((o) => o.orderId === orderId) || (lastOrder?.orderId === orderId ? lastOrder : null);
  }, [orders, lastOrder]);

  return (
    <OrderContext.Provider value={{ lastOrder, saveOrder, getOrderById }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
