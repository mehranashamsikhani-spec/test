import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Product, Size, Color, ProductVariant } from '../types';
import { PLACEHOLDER_IMAGE } from '../constants';
import GlareHover from './GlareHover';

const HeartIcon: React.FC<{isFilled: boolean}> = ({ isFilled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors duration-200 ${isFilled ? 'text-red-500 fill-current' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

const ProductDetailContent: React.FC<{product: Product}> = ({ product }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useAppContext();
  const [selectedColor, setSelectedColor] = useState<Color | null>(product.colors[0] || null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [feedback, setFeedback] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isWishlisted = isInWishlist(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [PLACEHOLDER_IMAGE];
  const hasSale = product.salePrice != null && product.salePrice < product.price;
  const displayPrice = hasSale ? product.salePrice! : product.price;
  const isProductTotallyOutOfStock = product.variants.length > 0 && product.variants.every(v => v.isOutOfStock);

  const availableSizesForSelectedColor = useMemo(() => {
    if (!selectedColor) return [];
    return product.variants
      .filter(v => v.color === selectedColor.name)
      .map(v => v.size);
  }, [selectedColor, product.variants]);
  
  useEffect(() => {
    setSelectedSize(null);
  }, [selectedColor]);

  const getVariant = (color: Color | null, size: Size | null): ProductVariant | undefined => {
      if (!color || !size) return undefined;
      return product.variants.find(v => v.color === color.name && v.size === size);
  }

   const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
    
  const handleAddToCart = () => {
    if (isProductTotallyOutOfStock) return;
    if (product.colors.length > 0 && !selectedColor) {
      setFeedback('لطفا رنگ را انتخاب کنید.');
      setTimeout(() => setFeedback(''), 2000);
      return;
    }
    if (availableSizesForSelectedColor.length > 0 && !selectedSize) {
      setFeedback('لطفا سایز را انتخاب کنید.');
      setTimeout(() => setFeedback(''), 2000);
      return;
    }

    const selectedVariant = getVariant(selectedColor, selectedSize);
    if (!selectedVariant || selectedVariant.isOutOfStock) {
        setFeedback('این گزینه موجود نیست.');
        setTimeout(() => setFeedback(''), 2000);
        return;
    }
    
    addToCart({
      ...product,
      quantity: 1,
      selectedVariant: selectedVariant,
      selectedColor: selectedColor!,
    });
    setFeedback('به سبد خرید اضافه شد!');
    setTimeout(() => setFeedback(''), 2000);
  };
  
  return (
    <div>
        <div className="relative group mb-4">
            <GlareHover
              width="100%"
              height="16rem"
              borderRadius="0.5rem"
              background="transparent"
              borderColor="transparent"
            >
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <img 
                    key={currentImageIndex}
                    src={images[currentImageIndex]} 
                    alt={product.name}
                    className="w-full h-full object-contain" 
                />
              </div>
            </GlareHover>
            <button onClick={handleToggleWishlist} className="absolute top-2 right-2 bg-white/70 rounded-full p-1.5 backdrop-blur-sm z-10">
                <HeartIcon isFilled={isWishlisted} />
            </button>
             {images.length > 1 && (
                <>
                    <button onClick={prevImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={nextImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </>
            )}
        </div>
        
        {hasSale ? (
            <div className="mb-4 flex items-baseline gap-2">
                <p className="text-red-600 font-bold text-xl">{displayPrice.toLocaleString('fa-IR')} تومان</p>
                <p className="text-gray-500 line-through">{product.price.toLocaleString('fa-IR')}</p>
            </div>
        ) : (
            <p className="text-xl font-semibold mb-4">{displayPrice.toLocaleString('fa-IR')} تومان</p>
        )}
        
         <div className="space-y-4">
              {product.colors.length > 0 && (
                  <div>
                      <h4 className="font-semibold mb-2 text-sm text-[#663C1F]">رنگ</h4>
                      <div className="flex space-x-2 space-x-reverse">
                      {product.colors.map(color => (
                          <button key={color.hex} onClick={() => setSelectedColor(color)} className={`w-9 h-9 rounded-full border-2 transition-all transform ${selectedColor?.hex === color.hex ? 'border-[#3D2412] scale-110' : 'border-gray-200'}`} style={{ backgroundColor: color.hex }} title={color.name}></button>
                      ))}
                      </div>
                  </div>
              )}

             {availableSizesForSelectedColor.length > 0 && (
                  <div>
                      <h4 className="font-semibold mb-2 text-sm text-[#663C1F]">سایز</h4>
                      <div className="flex space-x-2 space-x-reverse">
                      {availableSizesForSelectedColor.map(size => {
                          const variant = getVariant(selectedColor, size);
                          const isOutOfStock = variant?.isOutOfStock ?? true;
                          return (
                              <button 
                                key={size} 
                                onClick={() => !isOutOfStock && setSelectedSize(size)} 
                                disabled={isOutOfStock}
                                className={`relative px-4 py-2 border rounded-lg text-sm transition-colors 
                                    ${selectedSize === size ? 'bg-[#3D2412] text-white font-semibold' : 'bg-transparent border-stone-400 text-[#663C1F]'}
                                    ${isOutOfStock ? 'bg-stone-200 text-stone-400 cursor-not-allowed line-through' : ''}`}
                               >
                              {size}
                              </button>
                          )
                        })}
                      </div>
                  </div>
              )}
          </div>
          
          <div className="mt-6">
              <button 
                onClick={handleAddToCart}
                disabled={isProductTotallyOutOfStock}
                className="w-full bg-[#3D2412] text-white py-3 rounded-lg hover:bg-[#663C1F] transition-colors font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {isProductTotallyOutOfStock ? 'اتمام موجودی' : 'افزودن به سبد خرید'}
              </button>
                {feedback && <div className="text-center mt-3 text-sm text-green-600">{feedback}</div>}
          </div>
    </div>
  );
};

export default ProductDetailContent;