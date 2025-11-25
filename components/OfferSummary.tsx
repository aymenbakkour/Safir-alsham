import React, { useCallback, useMemo } from 'react';
import Input from './Input';
import { Product } from '../types';
import Button from './Button';

interface OfferSummaryProps {
  offerItems: Product[];
  deliveryCost: number;
  onDeliveryCostChange: (cost: number) => void;
  transferCost: number;
  onTransferCostChange: (cost: number) => void;
  extraText: string;
  onExtraTextChange: (text: string) => void;
  onShowPreview: () => void;
}

const OfferSummary: React.FC<OfferSummaryProps> = ({
  offerItems,
  deliveryCost,
  onDeliveryCostChange,
  transferCost,
  onTransferCostChange,
  extraText,
  onExtraTextChange,
  onShowPreview,
}) => {
  const totalSum = useMemo(() => {
    const itemsTotal = offerItems.reduce((acc, item) => acc + item.price, 0);
    return itemsTotal + deliveryCost + transferCost;
  }, [offerItems, deliveryCost, transferCost]);

  const handleDeliveryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onDeliveryCostChange(isNaN(value) ? 0 : value);
  }, [onDeliveryCostChange]);

  const handleTransferChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onTransferCostChange(isNaN(value) ? 0 : value);
  }, [onTransferCostChange]);

  const handleExtraTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onExtraTextChange(e.target.value);
  }, [onExtraTextChange]);

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-5">
      <h4 className="text-xl font-bold mb-4">إنشاء عرض</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mt-4">
        <div>
          <Input
            id="delivery"
            type="number"
            placeholder="تكلفة التوصيل (€)"
            value={deliveryCost === 0 ? '' : deliveryCost}
            onChange={handleDeliveryChange}
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Input
            id="transfer"
            type="number"
            placeholder="تكلفة التحويل (€)"
            value={transferCost === 0 ? '' : transferCost}
            onChange={handleTransferChange}
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Input
            id="extraText"
            type="text"
            placeholder="جملة اختيارية تحت العنوان"
            value={extraText}
            onChange={handleExtraTextChange}
          />
        </div>
      </div>

      <h5 className="mt-4 text-lg font-bold">
        المجموع النهائي: <span id="total" className="text-blue-600">{totalSum.toFixed(2)}</span> €
      </h5>

      <Button
        variant="success"
        className="w-full mt-4 py-3"
        onClick={onShowPreview}
        disabled={offerItems.length === 0}
      >
        معاينة العرض
      </Button>
    </div>
  );
};

export default OfferSummary;