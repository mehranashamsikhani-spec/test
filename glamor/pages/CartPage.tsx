import React from 'react';
import { useAppContext } from '../context/AppContext';
import { PLACEHOLDER_IMAGE } from '../constants';
import GlareHover from '../components/GlareHover';

interface CartPageProps {
  setActiveView: (view: string) => void;
}

const CartPage: React.FC<CartPageProps> = ({ setActiveView }) => {
  const { cart, updateCartQuantity, removeFromCart } = useAppContext();

  const totalPrice = cart.reduce((total, item) => {
    const price = item.salePrice != null ? item.salePrice : item.price;
    return total + price * item.quantity;
  }, 0);
  
  const isAnyItemOutOfStock = cart.some(item => item.selectedVariant.isOutOfStock);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">سبد خرید</h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">سبد خرید شما خالی است.</p>
      ) : (
        <div className="md:grid md:grid-cols-3 md:gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map(item => {
              const imgSrc = item.images && item.images.length > 0 ? item.images[0] : PLACEHOLDER_IMAGE;
              const hasSale = item.salePrice != null && item.salePrice < item.price;
              const displayPrice = hasSale ? item.salePrice! : item.price;
              const { color, size } = item.selectedVariant;

              return (
                <div key={`${item.id}-${color}-${size}`} className={`flex items-start bg-[#F5F0E8] p-4 rounded-lg shadow ${item.selectedVariant.isOutOfStock ? 'opacity-60' : ''}`}>
                  <GlareHover
                    width="80px"
                    height="80px"
                    borderRadius="0.5rem"
                    background="transparent"
                    borderColor="transparent"
                  >
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                      <img src={imgSrc} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                  </GlareHover>
                  <div className="flex-grow mr-4">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-[#663C1F]">
                      رنگ: {color} / سایز: {size}
                    </p>
                    <p className="text-sm mt-1">{displayPrice.toLocaleString('fa-IR')} تومان</p>
                    {item.selectedVariant.isOutOfStock && <p className="text-red-500 text-xs font-bold mt-1">اتمام موجودی</p>}
                  </div>
                  <div className="flex flex-col items-end justify-between h-full min-h-[80px]">
                    <div className="flex items-center border border-stone-400 rounded-md">
                      <button onClick={() => updateCartQuantity(item.id, color, size, item.quantity + 1)} className="px-2 py-1 text-lg font-bold text-[#3D2412]">+</button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, color, size, item.quantity - 1)} className="px-2 py-1 text-lg font-bold text-[#3D2412]">-</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id, color, size)} className="text-red-500 text-xs hover:underline mt-2">حذف</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="md:col-span-1 mt-8 md:mt-0">
            <div className="bg-[#F5F0E8] p-6 rounded-lg shadow sticky top-24">
              <h2 className="text-xl font-bold mb-4">جمع کل</h2>
              <div className="flex justify-between mb-6">
                <span>مبلغ نهایی:</span>
                <span className="font-bold">{totalPrice.toLocaleString('fa-IR')} تومان</span>
              </div>
              {isAnyItemOutOfStock && <p className="text-red-600 text-sm mb-4 text-center bg-red-100 p-2 rounded">برخی از کالاهای سبد شما ناموجود است. لطفاً قبل از ادامه آنها را حذف کنید.</p>}
              <button
                disabled={isAnyItemOutOfStock || cart.length === 0}
                onClick={() => setActiveView('checkout')}
                className="w-full bg-[#3D2412] text-white py-3 rounded-lg hover:bg-[#663C1F] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                ادامه فرآیند خرید
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;