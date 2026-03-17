import React from 'react';

const StatCards = ({ agenzie, utenti, styles }) => {
    
    const stats = {
        agenzie: agenzie?.length || 0,
        gestori: utenti?.filter(u => u?.ruolo === 'GESTORE').length || 0,
        agenti: utenti?.filter(u => u?.ruolo === 'AGENTE').length || 0,
        clienti: utenti?.filter(u => u?.ruolo === 'CLIENTE').length || 0,
        supporto: utenti?.filter(u => u?.ruolo === 'SUPPORTO_AMMINISTRATORE').length || 0,
        annunci: agenzie?.reduce((acc, curr) => acc + (curr.numeroImmobili || 0), 0) || 0
    };

    const cardData = [
        { label: 'AGENZIE', value: stats.agenzie, color: '#3B82F6', icon: '🏢', desc: 'Partner registrati' },
        { label: 'GESTORI', value: stats.gestori, color: '#EAB308', icon: '👤', desc: 'Responsabili' },
        { label: 'AGENTI', value: stats.agenti, color: '#22C55E', icon: '👔', desc: 'Attivi' },
        { label: 'CLIENTI', value: stats.clienti, color: '#A855F7', icon: '👥', desc: 'Utenti finali' },
        { label: 'SUPPORTO', value: stats.supporto, color: '#F97316', icon: '🛠️', desc: 'Staff tecnico' },
        { label: 'ANNUNCI', value: stats.annunci, color: '#EF4444', icon: '🏠', desc: 'Immobili totali' },
    ];

    return (
        <div style={gridStyle}>
            {cardData.map((card, index) => (
                <div key={index} style={{ ...cardStyle, borderTop: `4px solid ${card.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span style={labelStyle}>{card.label}</span>
                            <p style={numberStyle}>{card.value}</p>
                        </div>
                        <span style={{ fontSize: '1.5rem' }}>{card.icon}</span>
                    </div>
                    <small style={descStyle}>{card.desc}</small>
                </div>
            ))}
        </div>
    );
};

// Stili locali
const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
};

const cardStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
};

const labelStyle = { fontSize: '0.75rem', fontWeight: '800', color: '#64748B', letterSpacing: '0.05em' };
const numberStyle = { fontSize: '1.8rem', fontWeight: '800', color: '#1E293B', margin: '5px 0' };
const descStyle = { color: '#94A3B8', fontSize: '0.8rem', fontWeight: '500' };

export default StatCards;