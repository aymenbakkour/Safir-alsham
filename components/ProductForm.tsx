import React, { useState, useCallback } from 'react';
import { Product, ProductCategory } from '../types';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import { v4 as uuidv4 } from 'uuid';

interface ProductFormProps {
  onAddProduct: (product: Product) => void;
}

const productCategories: ProductCategory[] = ['مواد غذائية', 'هدايا', 'خدمة', 'رصيد موبايل'];

const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct }) => {
  const [productName, setProductName] = useState<string>('');
  const [productCategory, setProductCategory] = useState<ProductCategory>('مواد غذائية');
  const [productPrice, setProductPrice] = useState<string>('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(productPrice);
    if (!productName.trim() || isNaN(price) || price <= 0) {
      alert('الرجاء إدخال اسم منتج صالح وسعر صحيح.');
      return;
    }
    const newProduct: Product = {
      id: uuidv4(),
      name: productName.trim(),
      category: productCategory,
      price: price,
    };
    onAddProduct(newProduct);
    setProductName('');
    setProductPrice('');
    setProductCategory('مواد غذائية'); // Reset to default
  }, [productName, productCategory, productPrice, onAddProduct]);

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-5">
      <h4 className="text-xl font-bold mb-4">إضافة منتج جديد</h4>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <div>
          <Input
            id="pName"
            type="text"
            placeholder="اسم المنتج"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div>
          <Select
            id="pCat"
            options={productCategories.map(cat => ({ value: cat, label: cat }))}
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value as ProductCategory)}
          />
        </div>
        <div>
          <Input
            id="pPrice"
            type="number"
            placeholder="السعر (€)"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            min="0.01"
            step="0.01"
          />
        </div>
        <div>
          <Button type="submit" className="w-full mt-2 md:mt-0 py-2">إضافة المنتج</Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
