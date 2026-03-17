import React from 'react';

const Footer = () => {
    return (
        <footer style={footerStyle}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h3 style={{ margin: 0 }}>DietiEstates</h3>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>La tua casa, il nostro impegno.</p>
                </div>
                <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem' }}>
                    <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
                    <span style={{ cursor: 'pointer' }}>Termini e Condizioni</span>
                    <span style={{ cursor: 'pointer' }}>Contatti</span>
                </div>
                <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>© 2026 DietiEstates</p>
            </div>
        </footer>
    );
};

const footerStyle = {
    backgroundColor: '#2C3E50',
    color: 'white',
    padding: '40px 20px',
    marginTop: '50px',
    borderTop: '5px solid #3498DB'
};

export default Footer;