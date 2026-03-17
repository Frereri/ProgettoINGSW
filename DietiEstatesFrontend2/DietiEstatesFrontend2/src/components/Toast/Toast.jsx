import React, { useState, useCallback } from 'react';

// ─── Stili ────────────────────────────────────────────────────────────────────

const STYLES = `
  @keyframes toastFadeIn {
    from { opacity: 0; transform: scale(0.88); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes toastFadeOut {
    from { opacity: 1; transform: scale(1); }
    to   { opacity: 0; transform: scale(0.88); }
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
    setTimeout(onClose, 300);
  };

  if (!message) return null;

  const color = COLORS[type] || COLORS.info;

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'flex-start',   // non più 'center'
    justifyContent: 'center',
    paddingTop: '20px',          // regola questo valore a piacere
    zIndex: 9999,
    pointerEvents: 'none',
  };

  const toastStyle = {
    backgroundColor: color.bg,
    color: 'white',
    padding: '24px 32px',
    borderRadius: '18px',
    boxShadow: '0 16px 48px rgba(0,0,0,0.28)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '17px',
    fontWeight: '500',
    minWidth: '340px',
    maxWidth: '480px',
    position: 'relative',
    overflow: 'hidden',
    animation: `${leaving ? 'toastFadeOut' : 'toastFadeIn'} 0.3s ease forwards`,
    pointerEvents: 'auto',
  };

  const progressStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '5px',
    backgroundColor: color.progress,
    borderRadius: '0 0 18px 18px',
    animation: `toastProgress ${duration}ms linear forwards`,
  };

  return (
    <>
      <style>{STYLES}</style>
      <div style={overlayStyle}>
        <div style={toastStyle}>
          <span style={{ fontSize: '28px', flexShrink: 0 }}>{ICONS[type]}</span>
          <span style={{ flex: 1, lineHeight: '1.4' }}>{message}</span>
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255,255,255,0.25)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '18px',
              width: '28px',
              height: '28px',
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
      </div>
    </>
  );
};


export default Toast;
