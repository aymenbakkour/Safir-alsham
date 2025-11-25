import React, { useState, useCallback, useMemo } from 'react';
import { Product } from './types';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import OfferCart from './components/OfferCart';
import OfferSummary from './components/OfferSummary';
import OfferPreview from './components/OfferPreview';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [offerItems, setOfferItems] = useState<Product[]>([]);
  const [deliveryCost, setDeliveryCost] = useState<number>(0);
  const [transferCost, setTransferCost] = useState<number>(0);
  const [extraText, setExtraText] = useState<string>('');
  const [previewHtml, setPreviewHtml] = useState<string>('');

  const handleAddProduct = useCallback((newProduct: Product) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
  }, []);

  const handleAddToOffer = useCallback((productToAdd: Product) => {
    setOfferItems(prevOffer => [...prevOffer, { ...productToAdd }]);
  }, []);

  const handleRemoveOfferItem = useCallback((id: string) => {
    setOfferItems(prevOffer => prevOffer.filter(item => item.id !== id));
  }, []);

  const totalSum = useMemo(() => {
    const itemsTotal = offerItems.reduce((acc, item) => acc + item.price, 0);
    return itemsTotal + deliveryCost + transferCost;
  }, [offerItems, deliveryCost, transferCost]);

  const showPreview = useCallback(() => {
    const offerDetailsHtml = offerItems.map(p => `<div>${p.name} — ${p.price.toFixed(2)} €</div>`).join('');
    const html = `
      <h2 style="color:#0d6efd;font-weight:bold;font-size:1.5rem;margin-bottom:0.5rem;">سفير الشام</h2>
      <h4 style="font-size:1.25rem;margin-bottom:0.5rem;">عرض اليوم</h4>
      <p style="margin-bottom:1rem;color:#4b5563;">${extraText}</p>
      <hr style="border-top:1px solid #e5e7eb;margin-bottom:1rem;">
      <div style="text-align:right;margin-bottom:1rem;">${offerDetailsHtml}</div>
      <hr style="border-top:1px solid #e5e7eb;margin-bottom:1rem;">
      <h3 style="font-size:1.75rem;font-weight:bold;">المجموع: ${totalSum.toFixed(2)} €</h3>
    `;
    setPreviewHtml(html);
  }, [offerItems, extraText, totalSum]);


  return (
    <div className="max-w-4xl mx-auto py-3">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-5 md:mb-8 text-gray-800">
        سفير الشام – إدارة المنتجات والعروض
      </h2>

      <ProductForm onAddProduct={handleAddProduct} />

      <ProductList products={products} onAddToOffer={handleAddToOffer} />

      <OfferCart offerItems={offerItems} onRemoveOfferItem={handleRemoveOfferItem} />

      <OfferSummary
        offerItems={offerItems}
        deliveryCost={deliveryCost}
        onDeliveryCostChange={setDeliveryCost}
        transferCost={transferCost}
        onTransferCostChange={setTransferCost}
        extraText={extraText}
        onExtraTextChange={setExtraText}
        onShowPreview={showPreview}
      />

      <OfferPreview previewHtml={previewHtml} offerExists={offerItems.length > 0} />
    </div>
  );
};

export default App;