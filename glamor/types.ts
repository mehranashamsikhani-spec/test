
export enum Category {
  Shirt = 'پیراهن',
  TShirt = 'تیشرت',
  Pants = 'شلوار',
  Accessory = 'اکسسوری',
}

export enum Size {
  L = 'L',
  XL = 'XL',
  XXL = '2X',
}

export interface Color {
  name: string;
  hex: string;
}

export interface ProductVariant {
  color: string; // The name of the color
  size: Size;
  isOutOfStock: boolean;
}

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  salePrice?: number;
  variants: ProductVariant[];
  colors: Color[];
  images: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant: ProductVariant;
  selectedColor: Color;
}

export interface WishlistItem extends Product {
  // Wishlist items might have specific properties in the future
}

export interface Customer {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  postalCode: string;
}

export enum OrderStatus {
  Pending = 'در حال انتظار',
  Confirmed = 'تایید شده',
  Shipping = 'در حال ارسال',
  Delivered = 'تحویل داده شده',
}

export interface Order {
  id: number;
  customer: Customer;
  items: CartItem[];
  totalPrice: number;
  date: string;
  status: OrderStatus;
}

export interface BankAccount {
    id: number;
    name: string;
    accountNumber: string;
}

export type PaymentMethod = 'card' | 'cash' | 'credit';

export interface FinancialEntry {
    id: number;
    date: string;
    type: 'online' | 'in-person';
    description: string;
    totalAmount: number; // Price before discount
    discountAmount: number;
    finalAmount: number; // Price after discount
    paymentMethod: PaymentMethod;
    bankAccountId?: number;
    orderId?: number;
}
