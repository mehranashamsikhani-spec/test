
import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Product } from '../types';
import Modal from '../components/Modal';
import ProductDetailContent from '../components/ProductDetailContent';
import Footer from '../components/Footer';
import { PLACEHOLDER_IMAGE } from '../constants';
import GlareHover from '../components/GlareHover';

const HomePage: React.FC = () => {
  const { products } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const reversedProducts = [...products].reverse();

  const displayedProducts = reversedProducts;

  return (
    // The parent main tag has `flex-grow`, so we use absolute positioning to fill the viewport area below the header.
    <div className="absolute top-16 left-0 right-0 bottom-0"> 
      <div ref={mainContainerRef} className="h-full w-full overflow-y-auto scroll-snap-type-y-mandatory scrollbar-hide">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product, index) => {
            const imgSrc = product.images && product.images.length > 0 ? product.images[0] : PLACEHOLDER_IMAGE;
            const hasSale = product.salePrice != null && product.salePrice < product.price;

            return (
              <section
                key={product.id}
                className="h-full w-full scroll-snap-align-start flex flex-col items-center justify-center relative text-white bg-black"
              >
                <div className="absolute inset-0 z-0">
                   <img src={imgSrc} alt={product.name} className="w-full h-full object-cover opacity-30 blur-sm" />
                </div>
                <div className="z-10 flex flex-col md:flex-row items-center justify-center gap-8 p-8 max-w-5xl mx-auto">
                    <GlareHover width="300px" height="400px" borderRadius="1rem" background="transparent" borderColor="rgba(255,255,255,0.1)">
                       <img src={imgSrc} alt={product.name} className="w-full h-full object-contain" />
                    </GlareHover>
                   
                    <div className="text-center md:text-right">
                       <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>{product.name}</h2>
                        {hasSale ? (
                            <div className="mb-6 flex items-baseline justify-center md:justify-start gap-4">
                                <p className="text-3xl font-bold text-red-400">{product.salePrice?.toLocaleString('fa-IR')} تومان</p>
                                <p className="text-xl text-gray-400 line-through">{product.price.toLocaleString('fa-IR')}</p>
                            </div>
                        ) : (
                            <p className="text-3xl font-semibold mb-6">{product.price.toLocaleString('fa-IR')} تومان</p>
                        )}
                       <button onClick={() => handleViewDetails(product)} className="bg-white/20 backdrop-blur-md text-white font-bold py-3 px-8 rounded-full text-lg border border-white/30 hover:bg-white/30 transition-colors">
                        مشاهده جزئیات
                       </button>
                    </div>
                </div>
              </section>
            );
          })
        ) : (
          <div className="h-full w-full flex items-center justify-center text-center text-gray-500 p-10">
            <p>محصولی برای نمایش وجود ندارد.</p>
          </div>
        )}
        
        <section className="h-full w-full scroll-snap-align-start flex flex-col items-center justify-center bg-[#3D2412]">
          <Footer />
        </section>
      </div>
      
      <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title={selectedProduct?.name || ''}>
        {selectedProduct && <ProductDetailContent product={selectedProduct} />}
      </Modal>
    </div>
  );
};
export default HomePage;