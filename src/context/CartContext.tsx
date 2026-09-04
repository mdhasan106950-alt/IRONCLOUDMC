import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CouponValidationResult } from '../types';
import { api } from '../lib/api';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  finalTotal: number;
  couponCode: string | null;
  appliedCoupon: CouponValidationResult | null;
  couponError: string | null;
  isValidatingCoupon: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ironcloud_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string | null>(() => {
    try {
      return localStorage.getItem('ironcloud_coupon') || null;
    } catch {
      return null;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Sync to local storage safely
  useEffect(() => {
    try {
      localStorage.setItem('ironcloud_cart', JSON.stringify(items));
    } catch (e) {
      console.warn('Could not persist cart to storage:', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (couponCode) {
        localStorage.setItem('ironcloud_coupon', couponCode);
      } else {
        localStorage.removeItem('ironcloud_coupon');
      }
    } catch (e) {
      console.warn('Could not persist coupon to storage:', e);
    }
  }, [couponCode]);

  // Validate coupon whenever items or couponCode change
  useEffect(() => {
    if (!couponCode || items.length === 0) {
      setAppliedCoupon(null);
      setCouponError(null);
      return;
    }

    let isMounted = true;
    setIsValidatingCoupon(true);

    const payloadItems = items.map((i) => ({
      productId: i.product.id,
      quantity: i.quantity,
    }));

    api
      .validateCoupon(couponCode, payloadItems)
      .then((res) => {
        if (!isMounted) return;
        if (res.valid) {
          setAppliedCoupon(res);
          setCouponError(null);
        } else {
          setAppliedCoupon(null);
          setCouponError(res.error || 'Coupon could not be applied');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setAppliedCoupon(null);
        setCouponError(err.message || 'Error validating coupon');
      })
      .finally(() => {
        if (isMounted) setIsValidatingCoupon(false);
      });

    return () => {
      isMounted = false;
    };
  }, [couponCode, items]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      setCouponError('Please enter a coupon code.');
      return false;
    }

    setIsValidatingCoupon(true);
    setCouponError(null);

    const payloadItems = items.map((i) => ({
      productId: i.product.id,
      quantity: i.quantity,
    }));

    try {
      const res = await api.validateCoupon(clean, payloadItems);
      if (res.valid) {
        setCouponCode(clean);
        setAppliedCoupon(res);
        setCouponError(null);
        return true;
      } else {
        setAppliedCoupon(null);
        setCouponError(res.error || 'Invalid coupon code');
        return false;
      }
    } catch (err: any) {
      setAppliedCoupon(null);
      setCouponError(err.message || 'Error connecting to validation service');
      return false;
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // Subtotal calculated from cart items
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Authoritative discount or calculated discount
  const discount = appliedCoupon?.valid ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, subtotal - discount);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        finalTotal,
        couponCode,
        appliedCoupon,
        couponError,
        isValidatingCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
