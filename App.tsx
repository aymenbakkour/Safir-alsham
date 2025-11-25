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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [randomOfferMaxValue, setRandomOfferMaxValue] = useState<number>(40); // New state for custom max value

  const handleAddProduct = useCallback((newProduct: Product) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
  }, []);

  const handleAddToOffer = useCallback((productToAdd: Product) => {
    setOfferItems(prevOffer => [...prevOffer, { ...productToAdd }]);
  }, []);

  const handleRemoveOfferItem = useCallback((id: string) => {
    setOfferItems(prevOffer => prevOffer.filter(item => item.id !== id));
  }, []);

  const handleExportProducts = useCallback(() => {
    if (products.length === 0) {
      alert('لا توجد منتجات لتصديرها.');
      return;
    }

    const headers = ['ID', 'اسم المنتج', 'الفئة', 'السعر'];
    const csvRows = [
      headers.join(','),
      ...products.map(p => `${p.id},"${p.name.replace(/"/g, '""')}","${p.category.replace(/"/g, '""')}",${p.price.toFixed(2)}`)
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'products.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [products]);

  const totalSum = useMemo(() => {
    const itemsTotal = offerItems.reduce((acc, item) => acc + item.price, 0);
    return itemsTotal + deliveryCost + transferCost;
  }, [offerItems, deliveryCost, transferCost]);

  const showPreview = useCallback(() => {
    const offerDetailsHtml = offerItems.map(p => `<div>${p.name} — ${p.price.toFixed(2)} €</div>`).join('');
    
    let additionalCostsHtml = '';
    const hasAdditionalCosts = deliveryCost > 0 || transferCost > 0;
    
    if (hasAdditionalCosts) {
      additionalCostsHtml += '<div style="margin-top: 1rem; text-align: right;">';
      if (deliveryCost > 0) {
        additionalCostsHtml += `<div>تكلفة التوصيل — ${deliveryCost.toFixed(2)} €</div>`;
      }
      if (transferCost > 0) {
        additionalCostsHtml += `<div>تكلفة التحويل — ${transferCost.toFixed(2)} €</div>`;
      }
      additionalCostsHtml += '</div>';
    }

    const html = `
      <h2 style="color:#0d6efd;font-weight:bold;font-size:1.5rem;margin-bottom:0.5rem;">سفير الشام</h2>
      <h4 style="font-size:1.25rem;margin-bottom:0.5rem;">عرض اليوم</h4>
      <p style="margin-bottom:1rem;color:#4b5563;">${extraText}</p>
      <hr style="border-top:1px solid #e5e7eb;margin-bottom:1rem;">
      <div style="text-align:right;margin-bottom:1rem;">${offerDetailsHtml}</div>
      ${hasAdditionalCosts ? '<hr style="border-top:1px solid #e5e7eb;margin-bottom:1rem;">' : ''}
      ${additionalCostsHtml}
      <hr style="border-top:1px solid #e5e7eb;margin-bottom:1rem;">
      <h3 style="font-size:1.75rem;font-weight:bold;">المجموع: ${totalSum.toFixed(2)} €</h3>
    `;
    setPreviewHtml(html);
  }, [offerItems, extraText, deliveryCost, transferCost, totalSum]);

  const handleGenerateRandomOffer = useCallback((maxValue: number) => {
    if (maxValue <= 0) {
      alert('قيمة الحد الأقصى للعرض العشوائي يجب أن تكون أكبر من 0.');
      return;
    }

    setOfferItems([]); // Clear current offer
    setPreviewHtml(''); // Clear current preview

    const availableProducts = products.filter(p => p.category === 'مواد غذائية' && p.price <= maxValue);
    if (availableProducts.length === 0) {
      alert(`لا توجد منتجات "مواد غذائية" يمكن إضافتها لعرض عشوائي بحد أقصى ${maxValue.toFixed(2)}€.`);
      return;
    }

    // Shuffle products to get a random selection
    const shuffledProducts = [...availableProducts].sort(() => Math.random() - 0.5);

    let currentOfferValue = 0;
    const newOffer: Product[] = [];
    const maxOfferValue = maxValue; // Use the provided max value

    for (const product of shuffledProducts) {
      if (currentOfferValue + product.price <= maxOfferValue) {
        newOffer.push(product);
        currentOfferValue += product.price;
      }
    }
    setOfferItems(newOffer);
    setTimeout(() => {
      showPreview();
    }, 0);
  }, [products, showPreview]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return products;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [products, searchTerm]);

  return (
    <div className="max-w-4xl mx-auto py-3">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-5 md:mb-8 text-gray-800">
        سفير الشام – إدارة المنتجات والعروض
      </h2>

      <ProductForm onAddProduct={handleAddProduct} />

      <ProductList
        products={filteredProducts}
        onAddToOffer={handleAddToOffer}
        onExportProducts={handleExportProducts}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

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
        onGenerateRandomOffer={handleGenerateRandomOffer}
        randomOfferMaxValue={randomOfferMaxValue}
        onRandomOfferMaxValueChange={setRandomOfferMaxValue}
      />

      <OfferPreview offerExists={offerItems.length > 0 || deliveryCost > 0 || transferCost > 0} previewHtml={previewHtml} />
    </div>
  );
};

export default App;