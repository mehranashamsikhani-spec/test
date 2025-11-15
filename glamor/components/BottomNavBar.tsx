import React from 'react';
import Dock from './Dock';
import { ICONS } from '../constants';
import { useAppContext } from '../context/AppContext';
import { OrderStatus } from '../types';

interface BottomNavBarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView }) => {
  const { cart, wishlist, isLoggedIn, orders } = useAppContext();

  const renderBadge = (count: number) => {
    if (count === 0) return null;
    return (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-[18px] h-[18px] px-1 text-[10px] font-bold flex items-center justify-center border-2 border-[#3D2412]">
        {count}
      </span>
    );
  };

  const userNavItems = [
    { name: 'home', label: 'خانه', icon: <div className="relative">{ICONS.home}{renderBadge(0)}</div>, onClick: () => setActiveView('home') },
    { name: 'search', label: 'جستجو', icon: <div className="relative">{ICONS.search}{renderBadge(0)}</div>, onClick: () => setActiveView('search') },
    { name: 'wishlist', label: 'علاقه‌مندی', icon: <div className="relative">{ICONS.wishlist}{renderBadge(wishlist.length)}</div>, onClick: () => setActiveView('wishlist') },
    { name: 'cart', label: 'سبد خرید', icon: <div className="relative">{ICONS.cart}{renderBadge(cart.reduce((sum, item) => sum + item.quantity, 0))}</div>, onClick: () => setActiveView('cart') },
    { name: 'profile', label: 'پروفایل', icon: <div className="relative">{ICONS.profile}{renderBadge(0)}</div>, onClick: () => setActiveView('profile') },
  ];

  const pendingOrdersCount = orders.filter(o => o.status === OrderStatus.Pending).length;

  const adminNavItems = [
    { name: 'home', label: 'خانه', icon: <div className="relative">{ICONS.home}{renderBadge(0)}</div>, onClick: () => setActiveView('home') },
    { name: 'orders', label: 'سفارشات', icon: <div className="relative">{ICONS.orders}{renderBadge(pendingOrdersCount)}</div>, onClick: () => setActiveView('orders') },
    { name: 'customers', label: 'مشتریان', icon: <div className="relative">{ICONS.customers}{renderBadge(0)}</div>, onClick: () => setActiveView('customers') },
    { name: 'finance', label: 'حسابداری', icon: <div className="relative">{ICONS.finance}{renderBadge(0)}</div>, onClick: () => setActiveView('finance') },
    { name: 'profile', label: 'پروفایل', icon: <div className="relative">{ICONS.profile}{renderBadge(0)}</div>, onClick: () => setActiveView('profile') },
  ];

  const navItems = (isLoggedIn ? adminNavItems : userNavItems).map(item => ({
    ...item,
    className: activeView === item.name ? 'active' : '',
  }));

  return <Dock items={navItems} />;
};

export default BottomNavBar;