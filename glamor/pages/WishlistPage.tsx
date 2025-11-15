import React from 'react';
import { useAppContext } from '../context/AppContext';
import { WishlistItem } from '../types';
import { PLACEHOLDER_IMAGE } from '../constants';
import GlareHover from '../components/GlareHover';

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, addToCart } = useAppContext();

  const handleMoveToCart = (item: WishlistItem) => {
    const firstAvailableVariant = item.variants.find(v => !v.isOutOfStock);
    if (!firstAvailableVariant) return; // or show a message

    const color = item.colors.find(c => c.name === firstAvailableVariant.color);
    if (!color) return; // Data inconsistency

    const cartItem = { 
        ...item, 
        quantity: 1, 
        selectedVariant: firstAvailableVariant,
        selectedColor: color,
    };
    addToCart(cartItem);
    removeFromWishlist(item.id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">علاقه‌مندی‌ها</h1>
      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500">لیست علاقه‌مندی‌های شما خالی است.</p>
      ) : (
        <div className="space-y-4">
          {wishlist.map(item => {
            const imgSrc = item.images && item.images.length > 0 ? item.images[0] : PLACEHOLDER_IMAGE;
            const hasSale = item.salePrice != null && item.salePrice < item.price;
            const isTotallyOutOfStock = item.variants.length > 0 && item.variants.every(v => v.isOutOfStock);

            return (
              <div key={item.id} className="flex items-center bg-[#F5F0E8] p-4 rounded-lg shadow">
                 <GlareHover
                    width="64px"
                    height="64px"
                    borderRadius="0.375rem"
                    background="transparent"
                    borderColor="transparent"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0">
                        <img src={imgSrc} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                </GlareHover>
                <div className="flex-grow mr-4">
                  <h3 className="font-semibold">{item.name}</h3>
                   {hasSale ? (
                        <div className="flex items-baseline gap-2">
                            <p className="text-red-600 font-bold text-sm">{item.salePrice?.toLocaleString('fa-IR')} تومان</p>
                            <p className="text-gray-500 line-through text-xs">{item.price.toLocaleString('fa-IR')}</p>
                        </div>
                    ) : (
                        <p className="text-[#663C1F] text-sm">{item.price.toLocaleString('fa-IR')} تومان</p>
                    )}
                    {isTotallyOutOfStock && <p className="text-red-500 text-xs font-bold mt-1">اتمام موجودی</p>}
                </div>
                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={() => handleMoveToCart(item)}
                    disabled={isTotallyOutOfStock}
                    className="bg-[#3D2412] text-white px-3 py-1 text-sm rounded-md whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
                   >
                    به سبد خرید
                  </button>
                  <button onClick={() => removeFromWishlist(item.id)} className="bg-red-500 text-white px-3 py-1 text-sm rounded-md">حذف</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;