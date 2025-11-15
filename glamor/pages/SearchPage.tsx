import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal';
import ProductDetailContent from '../components/ProductDetailContent';


const SearchPage: React.FC = () => {
  const { products } = useAppContext();
  const [filters, setFilters] = useState({
    category: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const handleFilterChange = (name: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const searchTermMatch = searchTerm ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const categoryMatch = filters.category ? p.category === filters.category : true;
      return searchTermMatch && categoryMatch;
    });
  }, [products, filters, searchTerm]);
  
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">جستجوی محصولات</h1>

      <div className="mb-6 relative">
        <input 
            type="text"
            placeholder="نام محصول را جستجو کنید..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-[#663C1F] focus:border-[#663C1F]"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>


      <div className="bg-[#F5F0E8] rounded-lg shadow p-4 mb-8">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
          <h2 className="text-lg font-semibold">فیلترها</h2>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {isFiltersOpen && (
          <div className="mt-4 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-[#3D2412] mb-2">دسته بندی</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleFilterChange('category', '')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!filters.category ? 'bg-[#3D2412] text-white' : 'bg-stone-200 text-[#663C1F] hover:bg-stone-300'}`}>همه</button>
                {Object.values(Category).map(cat => (
                  <button key={cat} onClick={() => handleFilterChange('category', cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filters.category === cat ? 'bg-[#3D2412] text-white' : 'bg-stone-200 text-[#663C1F] hover:bg-stone-300'}`}>{cat}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onViewDetails={handleViewDetails} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-10">محصولی با این مشخصات یافت نشد.</p>
        )}
      </div>
      <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title={selectedProduct?.name || ''}>
        {selectedProduct && <ProductDetailContent product={selectedProduct} />}
      </Modal>
    </div>
  );
};

export default SearchPage;