import React, { useState } from 'react';
import { Smartphone } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import '../style/QRCode.css';

export const QRCode = () => {
    const [isClosed, setIsClosed] = useState(false);

    const handleClose = () => {
        setIsClosed(true);
    };

    return (
        <div className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 ${isClosed ? 'hidden' : ''}`}>
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="icon-container flex justify-between">
                    <Smartphone className="w-6 h-6 text-blue-600 mb-2"/>
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="text-red-600 cursor-pointer"
                        onClick={handleClose}
                    />
                </div>
                <p className="text-sm text-gray-600">Scannez pour voir sur mobile</p>
                <img src="/qrcode.png" alt="QR Code" className="w-24 h-24 mt-2 rounded"/>
                <div className="w-24 h-24 bg-gray-200 mt-2 rounded"></div>
            </div>
        </div>
    );
};
