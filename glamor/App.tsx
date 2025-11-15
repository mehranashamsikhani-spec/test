import React, { useState } from 'react';
import Header from './components/Header';
import BottomNavBar from './components/BottomNavBar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import CustomersPage from './pages/CustomersPage';
import FinancePage from './pages/FinancePage';
import { useAppContext } from './context/AppContext';
import CheckoutPage from './pages/CheckoutPage';
import SplashScreen from './components/SplashScreen';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn } = useAppContext();

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <HomePage />;
      case 'search':
        return <SearchPage />;
      case 'wishlist':
        return !isLoggedIn ? <WishlistPage /> : <AdminPage />;
      case 'cart':
        return !isLoggedIn ? <CartPage setActiveView={setActiveView} /> : <AdminPage />;
      case 'checkout':
        return <CheckoutPage setActiveView={setActiveView} />;
      case 'profile':
        return <AdminPage />;
      case 'orders': // Handle the new 'orders' view for admin
      case 'customers':
        return isLoggedIn ? <CustomersPage /> : <AdminPage />;
      case 'finance':
        return isLoggedIn ? <FinancePage /> : <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  if (isLoading) {
    return <SplashScreen onFinished={() => setIsLoading(false)} />;
  }


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pb-20 md:pb-0">
        {renderContent()}
      </main>
      <BottomNavBar activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default App;