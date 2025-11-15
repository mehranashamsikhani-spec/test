import React, { createContext, useState, useContext, ReactNode, FC } from 'react';
import { Product, CartItem, WishlistItem, Customer, Order, OrderStatus, FinancialEntry, BankAccount } from '../types';
import { INITIAL_PRODUCTS, INITIAL_BANK_ACCOUNTS } from '../constants';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  isLoggedIn: boolean;
  orders: Order[];
  customers: Customer[];
  currentCustomer: Customer | null;
  financialEntries: FinancialEntry[];
  bankAccounts: BankAccount[];
  addProduct: (product: Product) => void;
  updateProduct: (updatedProduct: Product) => void;
  deleteProduct: (productId: number) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number, variantColor: string, variantSize: string) => void;
  updateCartQuantity: (productId: number, variantColor: string, variantSize: string, quantity: number) => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  addOrder: (customer: Customer, cartItems: CartItem[], totalPrice: number) => void;
  updateOrderStatus: (orderId: number, status: OrderStatus) => void;
  customerLogin: (phone: string) => 'found' | 'not-found';
  customerRegister: (firstName: string, lastName: string, phone: string) => void;
  customerLogout: () => void;
  addFinancialEntry: (entry: Omit<FinancialEntry, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(INITIAL_BANK_ACCOUNTS);

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, { ...product, id: Date.now() }]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
    setCart(prev => prev.map(cartItem => {
      if (cartItem.id === updatedProduct.id) {
        const newVariantInfo = updatedProduct.variants.find(v => 
          v.color === cartItem.selectedVariant.color && v.size === cartItem.selectedVariant.size
        );
        return {
          ...cartItem,
          ...updatedProduct,
          selectedVariant: newVariantInfo || cartItem.selectedVariant,
        };
      }
      return cartItem;
    }));
    setWishlist(prev => prev.map(item => (item.id === updatedProduct.id ? { ...item, ...updatedProduct } : item)));
  };

  const deleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(item => item.id !== productId));
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existingItem = prev.find(i => i.id === item.id && i.selectedVariant.color === item.selectedVariant.color && i.selectedVariant.size === item.selectedVariant.size);
      if (existingItem) {
        return prev.map(i => 
            (i.id === item.id && i.selectedVariant.color === item.selectedVariant.color && i.selectedVariant.size === item.selectedVariant.size) 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number, variantColor: string, variantSize: string) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.selectedVariant.color === variantColor && item.selectedVariant.size === variantSize)));
  };

  const updateCartQuantity = (productId: number, variantColor: string, variantSize: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantColor, variantSize);
    } else {
      setCart(prev => prev.map(item => 
        (item.id === productId && item.selectedVariant.color === variantColor && item.selectedVariant.size === variantSize) 
        ? { ...item, quantity } 
        : item
      ));
    }
  };

  const addToWishlist = (item: WishlistItem) => {
    if (!wishlist.some(w => w.id === item.id)) {
      setWishlist(prev => [...prev, item]);
    }
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };
    
  const isInWishlist = (productId: number): boolean => {
    return wishlist.some(item => item.id === productId);
  }

  const login = (user: string, pass: string) => {
    if (user === 'nima' && pass === '1234') {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };
  
  const addOrder = (customer: Customer, cartItems: CartItem[], totalPrice: number) => {
    setCustomers(prev => {
        const existing = prev.find(c => c.phone === customer.phone);
        if (existing) {
            return prev.map(c => c.phone === customer.phone ? {...c, ...customer} : c);
        }
        return [...prev, customer];
    });

    const newOrderId = Date.now();
    const newOrder: Order = {
        id: newOrderId,
        customer,
        items: cartItems,
        totalPrice,
        date: new Date().toISOString(),
        status: OrderStatus.Pending,
    };
    setOrders(prev => [...prev, newOrder]);
    
    // Create corresponding financial entry
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = totalAmount - totalPrice;
    
    const newFinancialEntry: Omit<FinancialEntry, 'id'> = {
      date: new Date().toISOString(),
      type: 'online',
      description: `سفارش #${newOrderId}`,
      totalAmount: totalAmount,
      discountAmount: discountAmount,
      finalAmount: totalPrice,
      paymentMethod: 'card',
      bankAccountId: bankAccounts[0]?.id, // Default to first bank account
      orderId: newOrderId,
    };
    addFinancialEntry(newFinancialEntry);
    
    setCart([]); // Clear the cart
  };
  
  const updateOrderStatus = (orderId: number, status: OrderStatus) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
  };

  const customerLogin = (phone: string): 'found' | 'not-found' => {
    const customer = customers.find(c => c.phone === phone);
    if(customer) {
        setCurrentCustomer(customer);
        return 'found';
    }
    return 'not-found';
  };

  const customerRegister = (firstName: string, lastName: string, phone: string) => {
    const newCustomer: Customer = {
        firstName, lastName, phone, address: '', postalCode: ''
    };
    if (!customers.some(c => c.phone === phone)) {
        setCustomers(prev => [...prev, newCustomer]);
    }
    setCurrentCustomer(newCustomer);
  };

  const customerLogout = () => {
    setCurrentCustomer(null);
  }

  const addFinancialEntry = (entry: Omit<FinancialEntry, 'id'>) => {
    const newEntry = {
        ...entry,
        id: Date.now() + Math.random(),
    };
    setFinancialEntries(prev => [...prev, newEntry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  return (
    <AppContext.Provider value={{
      products, cart, wishlist, isLoggedIn, orders, customers, currentCustomer, financialEntries, bankAccounts,
      addProduct, updateProduct, deleteProduct,
      addToCart, removeFromCart, updateCartQuantity,
      addToWishlist, removeFromWishlist, isInWishlist,
      login, logout, addOrder, updateOrderStatus,
      customerLogin, customerRegister, customerLogout,
      addFinancialEntry,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};