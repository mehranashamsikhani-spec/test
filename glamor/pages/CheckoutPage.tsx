import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Customer } from '../types';

interface CheckoutPageProps {
  setActiveView: (view: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ setActiveView }) => {
  const { cart, addOrder } = useAppContext();
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [customer, setCustomer] = useState<Customer>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    postalCode: '',
  });
  const [error, setError] = useState('');

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  if (cart.length === 0 && step !== 'success') {
      React.useEffect(() => {
        setActiveView('home');
      }, []);
      return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    for (const key in customer) {
      if (customer[key as keyof Customer].trim() === '') {
        setError('لطفاً تمام فیلدها را پر کنید.');
        return;
      }
    }
    setError('');
    setStep('payment');
  };
  
  const handlePayment = () => {
      addOrder(customer, cart, totalPrice);
      setStep('success');
  }

  const renderForm = () => (
    <form onSubmit={handleSubmitForm} className="space-y-4">
      {error && <p className="bg-red-100 text-red-700 p-3 rounded text-center">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">نام</label>
          <input type="text" name="firstName" value={customer.firstName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">نام خانوادگی</label>
          <input type="text" name="lastName" value={customer.lastName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
      </div>
       <div>
        <label className="block text-sm font-medium">شماره تلفن</label>
        <input type="tel" name="phone" value={customer.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
       <div>
        <label className="block text-sm font-medium">آدرس</label>
        <textarea name="address" value={customer.address} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">کد پستی</label>
        <input type="text" name="postalCode" value={customer.postalCode} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <button type="submit" className="w-full bg-[#3D2412] text-white py-3 mt-4 rounded-lg hover:bg-[#663C1F] transition-colors">
        تایید و ادامه
      </button>
    </form>
  );

  const renderPayment = () => (
    <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">انتقال به درگاه پرداخت</h2>
        <p className="mb-6">شما در حال انتقال به صفحه پرداخت هستید. لطفاً اطلاعات سفارش خود را تایید کنید.</p>
        <div className="bg-stone-200 p-4 rounded-lg text-right mb-6">
            <p><strong>نام:</strong> {customer.firstName} {customer.lastName}</p>
            <p><strong>مبلغ قابل پرداخت:</strong> {totalPrice.toLocaleString('fa-IR')} تومان</p>
        </div>
        <button onClick={handlePayment} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
            پرداخت
        </button>
    </div>
  );
  
  const renderSuccess = () => (
    <div className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold mb-4">سفارش شما با موفقیت ثبت شد!</h2>
        <p className="mb-6">از خرید شما سپاسگزاریم. سفارش شما به زودی پردازش خواهد شد.</p>
        <button onClick={() => setActiveView('home')} className="bg-[#3D2412] text-white px-8 py-3 rounded-lg hover:bg-[#663C1F] transition-colors">
            بازگشت به صفحه اصلی
        </button>
    </div>
  );

  const renderStep = () => {
    switch(step) {
      case 'form': return renderForm();
      case 'payment': return renderPayment();
      case 'success': return renderSuccess();
    }
  }

  const getStepTitle = () => {
    switch(step) {
      case 'form': return 'اطلاعات ارسال';
      case 'payment': return 'پرداخت';
      case 'success': return 'تکمیل سفارش';
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">فرآیند خرید</h1>
      <div className="max-w-2xl mx-auto bg-[#F5F0E8] p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-6 text-center">{getStepTitle()}</h2>
          {renderStep()}
      </div>
    </div>
  );
};

export default CheckoutPage;