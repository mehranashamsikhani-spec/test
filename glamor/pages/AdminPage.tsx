import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Modal from '../components/Modal';
import ProductForm from '../components/ProductForm';
import { Product, Order, OrderStatus } from '../types';

// FIX: Changed JSX.Element to React.ReactElement to fix "Cannot find namespace 'JSX'" error.
const statusInfo: { [key in OrderStatus]: { text: string; bg: string; icon: React.ReactElement } } = {
    [OrderStatus.Pending]: { 
        text: 'text-yellow-800', bg: 'bg-yellow-100', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
    },
    [OrderStatus.Confirmed]: { 
        text: 'text-green-800', bg: 'bg-green-100', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
    },
    [OrderStatus.Shipping]: { 
        text: 'text-orange-800', bg: 'bg-orange-100',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1zM3 11h10" /></svg>
    },
    [OrderStatus.Delivered]: { 
        text: 'text-green-800', bg: 'bg-green-200',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
    },
};

const CustomerPortal = () => {
    const { orders, currentCustomer, customerLogin, customerRegister, customerLogout } = useAppContext();
    const [phone, setPhone] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [step, setStep] = useState<'phone' | 'register'>('phone');
    const [foundOrders, setFoundOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (currentCustomer) {
            const customerOrders = orders.filter(o => o.customer.phone === currentCustomer.phone).reverse();
            setFoundOrders(customerOrders);
        }
    }, [currentCustomer, orders]);

    const handlePhoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone.trim()) return;
        const result = customerLogin(phone);
        if (result === 'not-found') {
            setStep('register');
        }
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim()) return;
        customerRegister(firstName, lastName, phone);
    };

    if (currentCustomer) {
        return (
            <div className="max-w-md mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">سفارشات شما</h2>
                    <button onClick={customerLogout} className="bg-red-500 text-white px-3 py-1 text-sm rounded-md hover:bg-red-600 transition-colors">
                        خروج
                    </button>
                </div>
                {foundOrders.length > 0 ? (
                    <div className="space-y-4">
                        {foundOrders.map(order => (
                            <div key={order.id} className="bg-[#F5F0E8] p-4 rounded-lg shadow">
                                <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                                    <h4 className="font-semibold">سفارش #{order.id}</h4>
                                    <span className={`flex items-center px-3 py-1 text-sm font-semibold rounded-full ${statusInfo[order.status].bg} ${statusInfo[order.status].text}`}>
                                        {statusInfo[order.status].icon}
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">تاریخ: {new Date(order.date).toLocaleDateString('fa-IR')}</p>
                                <p className="text-sm font-bold mt-2">مبلغ کل: {order.totalPrice.toLocaleString('fa-IR')} تومان</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-600 bg-stone-200 p-4 rounded-lg shadow">
                        <p>شما هنوز سفارشی ثبت نکرده‌اید.</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto">
             <div className="bg-[#F5F0E8] p-8 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-center mb-6">ورود یا ثبت نام مشتری</h2>
                {step === 'phone' ? (
                    <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
                        <input 
                            type="tel" 
                            value={phone} 
                            onChange={e => setPhone(e.target.value)}
                            placeholder="شماره تلفن"
                            required
                            className="w-full p-2 border border-gray-300 rounded text-center"
                        />
                        <button type="submit" className="bg-[#7F5933] text-white px-6 py-2 rounded hover:bg-[#663C1F]">
                            ورود
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                         <p className="text-center text-sm">کاربری با شماره <span dir="ltr" className="font-semibold">{phone}</span> یافت نشد. لطفاً برای تکمیل ثبت نام، نام خود را وارد کنید.</p>
                         <input type="text" placeholder="نام" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded"/>
                         <input type="text" placeholder="نام خانوادگی" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded"/>
                         <div className="flex gap-2 mt-2">
                            <button type="button" onClick={() => setStep('phone')} className="flex-1 px-4 py-2 bg-stone-200 text-stone-800 rounded-md">بازگشت</button>
                            <button type="submit" className="flex-1 px-4 py-2 bg-[#3D2412] text-white rounded-md">ثبت نام و ورود</button>
                         </div>
                    </form>
                )}
            </div>
        </div>
    );
};


const AdminLogin: React.FC<{ onLogin: (u: string, p: string) => boolean; onSwitchView: () => void }> = ({ onLogin, onSwitchView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(username, password)) {
      setError('نام کاربری یا رمز عبور اشتباه است.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleLogin} className="bg-[#F5F0E8] p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-6">ورود ادمین</h1>
        {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">{error}</p>}
        <div className="mb-4">
          <label className="block text-[#3D2412]">نام کاربری</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1" />
        </div>
        <div className="mb-6">
          <label className="block text-[#3D2412]">رمز عبور</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1" />
        </div>
        <button type="submit" className="w-full bg-[#3D2412] text-white py-2 rounded-lg hover:bg-[#663C1F]">ورود</button>
      </form>
       <div className="text-center mt-4">
          <button onClick={onSwitchView} className="text-sm text-[#7F5933] hover:underline">
            بازگشت به ورود مشتری
          </button>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, logout } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };
  
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (product: Product) => {
      if(editingProduct) {
          updateProduct(product);
      } else {
          addProduct(product);
      }
  };
  
  const handleDeleteProduct = (productId: number) => {
      if(window.confirm('آیا از حذف این محصول اطمینان دارید؟')) {
          deleteProduct(productId);
      }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">مدیریت محصولات</h1>
        <div>
            <button onClick={openAddModal} className="bg-[#7F5933] text-white px-4 py-2 rounded-md ml-4">افزودن محصول</button>
            <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-md">خروج</button>
        </div>
      </div>
      <div className="bg-[#F5F0E8] shadow rounded-lg overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-[#895129] text-stone-200">
            <tr>
              <th className="p-3 text-right">نام محصول</th>
              <th className="p-3 text-right">دسته</th>
              <th className="p-3 text-right">قیمت</th>
              <th className="p-3 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{p.price.toLocaleString('fa-IR')}</td>
                <td className="p-3 text-center space-x-2 space-x-reverse">
                  <button onClick={() => openEditModal(p)} className="text-blue-600 hover:underline">ویرایش</button>
                  <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 hover:underline">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'ویرایش محصول' : 'افزودن محصول'}>
          <ProductForm product={editingProduct} onSave={handleSaveProduct} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};


const AdminPage: React.FC = () => {
  const { isLoggedIn, login, currentCustomer } = useAppContext();
  const [viewMode, setViewMode] = useState<'customer' | 'admin'>('customer');

  if (isLoggedIn) {
      return <div className="container mx-auto px-4 py-8"><AdminDashboard /></div>;
  }
  
  if (currentCustomer) {
      return <div className="container mx-auto px-4 py-8"><CustomerPortal /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {viewMode === 'customer' ? (
        <div>
          <CustomerPortal />
          <div className="text-center mt-6">
            <button onClick={() => setViewMode('admin')} className="text-sm text-[#7F5933] hover:underline">
              ورود ادمین
            </button>
          </div>
        </div>
      ) : (
        <AdminLogin onLogin={login} onSwitchView={() => setViewMode('customer')} />
      )}
    </div>
  );
};

export default AdminPage;