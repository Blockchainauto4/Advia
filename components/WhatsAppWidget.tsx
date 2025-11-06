import React from 'react';
import { WhatsAppIcon } from './Icons';

export const WhatsAppWidget: React.FC = () => {
    const phoneNumber = '5511932046970';
    const message = 'ola vim atravéz do site advocacia aí. Preciso de suporte';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 flex items-center justify-center"
            aria-label="Contatar via WhatsApp"
        >
            <WhatsAppIcon className="w-8 h-8" />
        </a>
    );
};
