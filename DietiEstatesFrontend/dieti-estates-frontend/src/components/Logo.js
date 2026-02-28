import React from 'react';
import logoUrl from '../dieti-logo.svg';

const Logo = ({ width = "50px", height = "50px" }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
                src={logoUrl} 
                alt="Dieti Estates Logo" 
                style={{ width: width, height: height, objectFit: 'contain' }} 
            />
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#007bff' }}>
                Dieti Estates
            </span>
        </div>
    );
};

export default Logo;