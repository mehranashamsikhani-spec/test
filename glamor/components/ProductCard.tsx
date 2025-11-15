import React from 'react';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import { PLACEHOLDER_IMAGE } from '../constants';
import GlareHover from './GlareHover';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const HeartIcon: React.FC<{isFilled: boolean}> = ({ isFilled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors duration-200 ${isFilled ? 'text-red-500 fill-current' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);


const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useAppContext();
  const isWishlisted = isInWishlist(product.id);
  const imgSrc = product.images && product.images.length > 0 ? product.images[0] : PLACEHOLDER_IMAGE;
  const hasSale = product.salePrice != null && product.salePrice < product.price;
  const isTotallyOutOfStock = product.variants.length > 0 && product.variants.every(v => v.isOutOfStock);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(isWishlisted) {
        removeFromWishlist(product.id);
    } else {
        addToWishlist(product);
    }
  };

  return (
    <div className="bg-[#F5F0E8] rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer group" onClick={() => onViewDetails(product)}>
      <div className="relative w-full aspect-[3/4]">
         <GlareHover
            width="100%"
            height="100%"
            borderRadius="0"
            background="transparent"
            borderColor="transparent"
          >
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <img src={imgSrc} alt={product.name} className="w-full h-full object-contain" />
            </div>
          </GlareHover>
        {isTotallyOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">اتمام موجودی</span>
            </div>
        )}
        <button onClick={handleWishlistClick} className="absolute top-2 right-2 bg-white/70 rounded-full p-1.5 backdrop-blur-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <HeartIcon isFilled={isWishlisted} />
        </button>
      </div>
      <div className="p-3">
        <h3 className="text-base font-semibold truncate">{product.name}</h3>
        {hasSale ? (
            <div className="mt-1 flex items-baseline gap-2">
                <p className="text-sm font-bold text-red-600">{product.salePrice?.toLocaleString('fa-IR')} تومان</p>
                <p className="text-gray-500 line-through text-xs">{product.price.toLocaleString('fa-IR')}</p>
            </div>
        ) : (
            <p className="text-sm text-[#7F5933] mt-1">{product.price.toLocaleString('fa-IR')} تومان</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;