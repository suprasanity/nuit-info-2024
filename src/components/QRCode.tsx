import { Smartphone } from 'lucide-react';

const isMobile = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
};

export const QRCode = () => {
    if (isMobile()) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <Smartphone className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Scannez pour voir sur mobile</p>
                <div className="w-24 h-24 bg-gray-200 mt-2 rounded">
                    <img src="/qrcode.png" alt="QR Code" className="w-24 h-24 mt-2 rounded" />
                </div>
            </div>
        </div>
    );
};