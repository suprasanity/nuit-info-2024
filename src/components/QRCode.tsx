import React from 'react';
import { Smartphone } from 'lucide-react';

export const QRCode = () => {
  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <Smartphone className="w-6 h-6 text-blue-600 mb-2" />
        <p className="text-sm text-gray-600">Scannez pour voir sur mobile</p>
        {/* QR Code placeholder - to be replaced with actual QR code */}
        <div className="w-24 h-24 bg-gray-200 mt-2 rounded"></div>
      </div>
    </div>
  );
};