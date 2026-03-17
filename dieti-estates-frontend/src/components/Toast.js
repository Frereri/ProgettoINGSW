import React, { useState, useCallback } from 'react';

// ─── Stili ────────────────────────────────────────────────────────────────────

const STYLES = `
  @keyframes toastSlideIn {
    from { transform: translateX(120px); opacity: 0; }
    to   { transform: translateX(0);     opacity: 1; }
  }
  @keyframes toastSlideOut {
    from { transform: translateX(0);     opacity: 1; }
    to   { transform: translateX(120px); opacity: 0; }
  }
  @keyframes toastProgress {
    from { width: 100%; }
    to   { width: 0%; }
  }
`;

const COLORS = {
  success: { bg: '#2ECC71', progress: '#27AE60' },
  error:   { bg: '#E74C3C', progress: '#C0392B' },
  info:    { bg: '#5DADE2', progress: '#2E86C1' },
  warning: { bg: '#F39C12', progress: '#D68910' },
};

const ICONS = {
  success: '✅',
  error:   '❌',
  info:    'ℹ️',
  warning: '⚠️',
};

// ─── Componente Toast ─────────────────────────────────────────────────────────

const Toast = ({ message, type = 'success', duration = 3500, onClose }) => {
  const [leaving, setLeaving] = React.useState(false);

  const handleClose = () => {
    setLeaving(true);
    setTimeout(onClose, 280);
  };


  if (!message) return null;

  const color = COLORS[type] || COLORS.info;

  const toastStyle = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    backgroundColor: color.bg,
    color: 'white',
    padding: '14px 18px',
    borderRadius: '14px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    zIndex: 9999,
    fontSize: '15px',
    fontWeight: '500',
    minWidth: '280px',
    maxWidth: '380px',
    animation: `${leaving ? 'toastSlideOut' : 'toastSlideIn'} 0.3s ease forwards`,
    overflow: 'hidden',
  };

  const progressStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '4px',
    backgroundColor: color.progress,
    borderRadius: '0 0 14px 14px',
    animation: `toastProgress ${duration}ms linear forwards`,
  };

  return (
    <>
      <style>{STYLES}</style>
      <div style={toastStyle}>
        <span style={{ fontSize: '20px', flexShrink: 0 }}>{ICONS[type]}</span>
        <span style={{ flex: 1, lineHeight: '1.4' }}>{message}</span>
        <button
          onClick={handleClose}
          style={{
            background: 'rgba(255,255,255,0.25)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          ×
        </button>
        <div style={progressStyle} />
      </div>
    </>
  );
};

// ─── Hook useToast ─────────────────────────────────────────────────────────────
//
// Usa questo hook nelle tue pagine per mostrare i toast senza dover
// gestire manualmente lo stato ogni volta.
//
// Esempio d'uso:
//   const { toastProps, showToast } = useToast();
//   ...
//   showToast("Salvato!", "success");
//   ...
//   <Toast {...toastProps} />

export const useToast = () => {
  const [toast, setToast] = useState({ message: '', type: 'success', duration: 3500 });
  const timerRef = React.useRef(null);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, message: '' }));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    // Cancella eventuale timer precedente
    if (timerRef.current) clearTimeout(timerRef.current);
    
    setToast({ message, type, duration });
    
    // Gestisci il timer QUI nell'hook, non nel componente
    timerRef.current = setTimeout(() => {
      hideToast();
    }, duration);
  }, [hideToast]);

  return {
    toastProps: { ...toast, onClose: hideToast },
    showToast,
  };
};
export default Toast;
