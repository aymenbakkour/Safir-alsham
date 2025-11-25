import React, { useState, useCallback, useMemo } from 'react';
import { Product } from '../types';
import Button from './Button';
import Input from './Input'; // Import Input component

interface ProductListProps {
  products: Product[];
  onAddToOffer: (product: Product) => void;
  onExportProducts: () => void;
  searchTerm: string; // New prop for search term
  onSearchChange: (term: string) => void; // New prop for search handler
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToOffer, onExportProducts, searchTerm, onSearchChange }) => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = useCallback((category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  }, []);

  const categorizedProducts = useMemo(() => {
    const categories: Record<string, Product[]> = {};
    products.forEach(p => {
      if (!categories[p.category]) {
        categories[p.category] = [];
      }
      categories[p.category].push(p);
    });
    return categories;
  }, [products]);

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-5">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-bold">المنتجات</h4>
        {products.length > 0 && (
          <Button
            variant="primary"
            size="sm"
            onClick={onExportProducts}
            className="flex-shrink-0"
          >
            تصدير إلى Excel
          </Button>
        )}
      </div>

      <div className="mb-4">
        <Input
          id="productSearch"
          type="text"
          placeholder="بحث عن منتج..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div id="productsArea">
        {Object.entries(categorizedProducts).map(([category, productsInCat]) => (
          <div key={category} className="mb-3 last:mb-0">
            <div
              className="bg-gray-200 p-2 md:p-3 rounded-md cursor-pointer font-bold text-gray-800 flex justify-between items-center"
              onClick={() => toggleCategory(category)}
            >
              {category}
              <span className="text-lg">
                {openCategories[category] ? '−' : '+'}
              </span>
            </div>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${openCategories[category] ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
            >
              {(productsInCat as Product[]).map(product => (
                <div key={product.id} className="flex items-center justify-between p-2 border-b border-gray-200 last:border-b-0">
                  <div className="flex-1 font-medium text-gray-700">{product.name}</div>
                  <div className="w-20 text-center text-gray-600">{product.price.toFixed(2)} €</div>
                  <div className="w-16 flex justify-center">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-8 h-8 flex items-center justify-center text-lg leading-none p-0"
                      title="إضافة للعرض"
                      onClick={() => onAddToOffer(product)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-gray-500 text-center mt-4">لا توجد منتجات بعد. أضف منتجًا جديدًا!</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;