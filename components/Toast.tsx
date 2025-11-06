import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from './Icons.tsx';

interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 2700);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type];

  const Icon = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    info: CheckCircleIcon, // Using Check for info as well, can be changed
  }[type];

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg text-white transition-transform duration-300 ${bgColor} ${
        isVisible ? 'transform translate-x-0' : 'transform translate-x-full'
      }`}
      role="alert"
    >
      <Icon className="w-6 h-6 mr-3" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20" aria-label="Fechar">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};