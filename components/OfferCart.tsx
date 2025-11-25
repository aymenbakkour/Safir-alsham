import React from 'react';
import { Product } from '../types';
import Button from './Button';

interface OfferCartProps {
  offerItems: Product[];
  onRemoveOfferItem: (id: string) => void;
}

const OfferCart: React.FC<OfferCartProps> = ({ offerItems, onRemoveOfferItem }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-5">
      <h4 className="text-xl font-bold mb-4">عناصر العرض</h4>
      <div id="offerItems" className="space-y-2">
        {offerItems.length === 0 ? (
          <p className="text-gray-500 text-center">لم يتم إضافة أي منتجات للعرض بعد.</p>
        ) : (
          offerItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-2 border-b border-gray-200 last:border-b-0">
              <span className="text-gray-700">{item.name}</span>
              <span className="text-gray-600">{item.price.toFixed(2)} €</span>
              <Button
                variant="danger"
                size="sm"
                className="w-7 h-7 flex items-center justify-center text-lg leading-none p-0"
                onClick={() => onRemoveOfferItem(item.id)}
                title="إزالة من العرض"
              >
                ×
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OfferCart;