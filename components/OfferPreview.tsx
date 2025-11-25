import React, { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import Button from './Button';

interface OfferPreviewProps {
  previewHtml: string;
  offerExists: boolean;
}

const OfferPreview: React.FC<OfferPreviewProps> = ({ previewHtml, offerExists }) => {
  const previewRef = useRef<HTMLDivElement>(null);

  const downloadImage = useCallback(() => {
    if (previewRef.current) {
      html2canvas(previewRef.current, { useCORS: true, backgroundColor: '#FFFFFF' }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'offer.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  }, []);

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      <h4 className="text-xl font-bold mb-4">معاينة العرض</h4>
      <div
        id="preview"
        ref={previewRef}
        className="border-2 border-blue-600 p-4 md:p-6 rounded-xl bg-white text-center min-h-[150px] flex flex-col justify-center items-center"
      >
        {offerExists ? (
          <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
        ) : (
          <p className="text-gray-500">قم بإنشاء عرض للمعاينة هنا.</p>
        )}
      </div>
      <Button
        className="w-full mt-4 py-3"
        onClick={downloadImage}
        disabled={!offerExists}
      >
        تصدير كصورة
      </Button>
    </div>
  );
};

export default OfferPreview;