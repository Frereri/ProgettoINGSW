import { useState, useCallback, useRef } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState({ message: '', type: 'success', duration: 3500 });
  const timerRef = useRef(null);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, message: '' }));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type, duration });
    timerRef.current = setTimeout(hideToast, duration);
  }, [hideToast]);

  return {
    toastProps: { ...toast, onClose: hideToast },
    showToast,
  };
};