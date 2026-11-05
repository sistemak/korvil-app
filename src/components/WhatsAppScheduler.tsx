import React, { useEffect } from 'react';

const sendWhatsAppMessage = (phone: string, text: string) => {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

const WhatsAppScheduler: React.FC = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      sendWhatsAppMessage('13997690898', 'Oi Say , sou Teste.');
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return null;
};

export default WhatsAppScheduler;