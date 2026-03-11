import React from 'react';


export const StatCards = ({ agenzie, utenti, styles }) => {
    const { statsGridStyle, statCardStyle, labelStyle, statNumberStyle } = styles;
    

    return (
    <div style={statsGridStyle}>
        {/* CARD AGENZIE */}
        <div style={{...statCardStyle, borderLeft: '5px solid #3498DB'}}>
        <span style={labelStyle}>🏢 AGENZIE</span>
        <p style={statNumberStyle}>{agenzie.length}</p>
        <small style={{color: '#7F8C8D'}}>Agenzie partner registrate</small>
        </div>

        {/* CARD GESTORI */}
        <div style={{...statCardStyle, borderLeft: '5px solid #F1C40F'}}>
        <span style={labelStyle}>👤 GESTORI</span>
        <p style={statNumberStyle}>
        {/* Aggiunto il controllo && u.ruolo per evitare errori se l'array è vuoto o sporco */}
        {utenti ? utenti.filter(u => u && u.ruolo === 'GESTORE').length : 0}
        </p>
        <small style={{color: '#7F8C8D'}}>Responsabili di agenzia</small>
        </div>

        {/* CARD AGENTI */}
        <div style={{...statCardStyle, borderLeft: '5px solid #2ECC71'}}>
        <span style={labelStyle}>👔 AGENTI</span>
        <p style={statNumberStyle}>
        {utenti.filter(u => u.ruolo === 'AGENTE').length}
        </p>
        <small style={{color: '#7F8C8D'}}>Agenti immobiliari attivi</small>
        </div>

        {/* CARD CLIENTI */}
        <div style={{...statCardStyle, borderLeft: '5px solid #9B59B6'}}>
        <span style={labelStyle}>👥 CLIENTI</span>
        <p style={statNumberStyle}>
        {utenti.filter(u => u.ruolo === 'CLIENTE').length}
        </p>
        <small style={{color: '#7F8C8D'}}>Utenti finali registrati</small>
        </div>

        {/* CARD SUPPORTO */}
        <div style={{...statCardStyle, borderLeft: '5px solid #E67E22'}}>
        <span style={labelStyle}>🛠️ STAFF SUPPORTO</span>
        <p style={statNumberStyle}>
        {utenti.filter(u => u.ruolo === 'SUPPORTO_AMMINISTRATORE').length}
        </p>
        <small style={{color: '#7F8C8D'}}>Assistenza tecnica</small>
        </div>

        {/* CARD ANNUNCI (Esempio basato sulla somma degli immobili nelle agenzie) */}
        <div style={{...statCardStyle, borderLeft: '5px solid #E74C3C'}}>
        <span style={labelStyle}>🏠 ANNUNCI TOTALI</span>
        <p style={statNumberStyle}>
        {agenzie.reduce((acc, curr) => acc + (curr.numeroImmobili || 0), 0)}
        </p>
        <small style={{color: '#7F8C8D'}}>Immobili pubblicati</small>
        </div>
    </div>
    );

};