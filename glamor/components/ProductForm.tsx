import React, { useState, useEffect } from 'react';
import { Product, Category, Size, Color, ProductVariant } from '../types';
import { PLACEHOLDER_IMAGE } from '../constants';

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    category: Category.Shirt,
    price: 0,
    salePrice: undefined,
    colors: [],
    variants: [],
    images: [],
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        salePrice: product.salePrice,
        colors: product.colors,
        variants: product.variants,
        images: product.images,
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'salePrice') {
        setFormData(prev => ({ ...prev, salePrice: value ? Number(value) : undefined }));
    } else {
        setFormData(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
    }
  };
  
  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && formData.images.length < 3) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setFormData(prev => ({
        ...prev,
        images: prev.images.filter(image => image !== imageToRemove)
    }));
  };

  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  
  const handleAddColor = () => {
      if (newColorName && !formData.colors.some(c => c.name === newColorName)) {
          setFormData(prev => ({ ...prev, colors: [...prev.colors, {name: newColorName, hex: newColorHex}]}));
          setNewColorName('');
          setNewColorHex('#000000');
      }
  }
  
  const handleRemoveColor = (colorName: string) => {
      setFormData(prev => ({ 
          ...prev, 
          colors: prev.colors.filter(c => c.name !== colorName),
          variants: prev.variants.filter(v => v.color !== colorName) // Also remove variants of that color
      }));
  }

  const [newVariant, setNewVariant] = useState<{ color: string, size: Size, isOutOfStock: boolean }>({
    color: '',
    size: Size.L,
    isOutOfStock: false,
  });

  useEffect(() => {
    // If colors are available but no color is selected for new variant, select the first one.
    if (formData.colors.length > 0 && !newVariant.color) {
      setNewVariant(prev => ({ ...prev, color: formData.colors[0].name }));
    }
  }, [formData.colors, newVariant.color]);

  const handleNewVariantChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        setNewVariant(prev => ({ ...prev, isOutOfStock: (e.target as HTMLInputElement).checked }));
    } else {
        setNewVariant(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddVariant = () => {
    if (!newVariant.color) {
        alert("لطفاً ابتدا یک رنگ اضافه کنید.");
        return;
    }
    const exists = formData.variants.some(v => v.color === newVariant.color && v.size === newVariant.size);
    if (!exists) {
        setFormData(prev => ({ ...prev, variants: [...prev.variants, newVariant] }));
    } else {
        alert("این ترکیب رنگ و سایز قبلاً اضافه شده است.");
    }
  };
  
  const handleRemoveVariant = (variantToRemove: ProductVariant) => {
      setFormData(prev => ({ ...prev, variants: prev.variants.filter(v => !(v.color === variantToRemove.color && v.size === variantToRemove.size)) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productToSave = { ...formData };
    if (productToSave.images.length === 0) {
        productToSave.images.push(PLACEHOLDER_IMAGE);
    }
    onSave({ ...productToSave, id: product?.id || 0 });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#3D2412]">نام محصول</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
      </div>
       <div>
        <label className="block text-sm font-medium text-[#3D2412]">تصاویر محصول (حداکثر ۳)</label>
        <div className="mt-2 flex items-center flex-wrap gap-4">
            {formData.images.map((image, index) => (
                <div key={index} className="relative">
                    <img src={image} className="w-24 h-24 object-contain bg-gray-200 rounded-md" />
                     <button type="button" onClick={() => handleRemoveImage(image)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold" aria-label="حذف تصویر">&times;</button>
                </div>
            ))}
            {formData.images.length < 3 && (
                <label className="cursor-pointer bg-stone-200 w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md text-sm font-medium text-[#3D2412] hover:bg-stone-300">
                    <span>افزودن تصویر</span>
                    <span className="text-xs text-gray-500">{formData.images.length}/3</span>
                    <input type="file" accept="image/*" onChange={handleAddImage} className="sr-only"/>
                </label>
            )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#3D2412]">دسته بندی</label>
        <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
          {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#3D2412]">قیمت (تومان)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3D2412]">قیمت با تخفیف (اختیاری)</label>
            <input type="number" name="salePrice" value={formData.salePrice || ''} onChange={handleChange} placeholder="مثال: 450000" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
      </div>
       <div className="p-4 bg-stone-200 rounded-lg">
        <label className="block text-sm font-medium text-[#3D2412]">رنگ ها</label>
        <div className="flex items-center space-x-2 space-x-reverse mt-1">
            <input type="text" placeholder="نام رنگ" value={newColorName} onChange={e => setNewColorName(e.target.value)} className="w-1/2 border border-gray-300 rounded-md shadow-sm p-2"/>
            <input type="color" value={newColorHex} onChange={e => setNewColorHex(e.target.value)} className="h-10 w-10"/>
            <button type="button" onClick={handleAddColor} className="bg-[#895129] text-white px-3 py-1 rounded-md text-sm">افزودن</button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
            {formData.colors.map(color => (
                <div key={color.name} className="flex items-center bg-white rounded-full px-3 py-1 text-sm">
                    <span style={{backgroundColor: color.hex}} className="w-4 h-4 rounded-full mr-2 border"></span>
                    <span>{color.name}</span>
                    <button type="button" onClick={() => handleRemoveColor(color.name)} className="mr-2 text-red-500">&times;</button>
                </div>
            ))}
        </div>
      </div>

       <div className="p-4 bg-stone-200 rounded-lg">
        <label className="block text-sm font-medium text-[#3D2412]">مدیریت موجودی (واریانت ها)</label>
        <div className="grid grid-cols-4 gap-2 items-center mt-2 p-2 bg-white rounded">
            <select name="color" value={newVariant.color} onChange={handleNewVariantChange} className="border border-gray-300 rounded-md p-2 text-sm col-span-2 md:col-span-1">
                {formData.colors.length === 0 && <option disabled value="">ابتدا رنگ اضافه کنید</option>}
                {formData.colors.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <select name="size" value={newVariant.size} onChange={handleNewVariantChange} className="border border-gray-300 rounded-md p-2 text-sm col-span-2 md:col-span-1">
                {Object.values(Size).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <label className="flex items-center space-x-2 space-x-reverse text-sm col-span-2 md:col-span-1">
              <input type="checkbox" name="isOutOfStock" checked={newVariant.isOutOfStock} onChange={handleNewVariantChange} />
              <span>ناموجود</span>
            </label>
            <button type="button" onClick={handleAddVariant} className="bg-[#895129] text-white px-3 py-1.5 rounded-md text-sm col-span-2 md:col-span-1">افزودن واریانت</button>
        </div>
        <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
            {formData.variants.map((v, i) => (
                <div key={i} className="flex items-center justify-between bg-white rounded px-3 py-1 text-sm">
                    <div>
                        <span className="font-semibold">{v.color}</span> / <span>{v.size}</span>
                    </div>
                    <div className="flex items-center">
                        <span className={`text-xs font-bold ${v.isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>{v.isOutOfStock ? 'ناموجود' : 'موجود'}</span>
                        <button type="button" onClick={() => handleRemoveVariant(v)} className="mr-4 text-red-500 text-lg">&times;</button>
                    </div>
                </div>
            ))}
        </div>
      </div>
      
      <div className="flex justify-end pt-4 space-x-2 space-x-reverse">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-stone-200 text-stone-800 rounded-md">انصراف</button>
        <button type="submit" className="px-4 py-2 bg-[#3D2412] text-white rounded-md">ذخیره</button>
      </div>
    </form>
  );
};

export default ProductForm;
