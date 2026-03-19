import React from 'react';

const TabellaAgenzie = ({ agenzie, onEdit, onDelete, styles }) => {
    return (
        <div style={{ ...styles.formCardStyle, maxWidth: '100%', padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '1.5rem' }}>🏢</span>
                <h3 style={{ margin: 0, color: '#1E293B', fontWeight: '800' }}>Lista Agenzie</h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                            <th style={thStyle}>Nome Agenzia</th>
                            <th style={thStyle}>Partita IVA</th>
                            <th style={{ ...thStyle, textAlign: 'center' }}>Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agenzie.length > 0 ? (
                            agenzie.map((a) => (
                                <tr key={a.idAgenzia} style={rowStyle} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td style={tdStyle}>{a.nomeAgenzia}</td>
                                    <td style={{ ...tdStyle, fontFamily: 'monospace', color: '#64748B' }}>{a.partitaIva}</td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                            <button 
                                                onClick={() => onEdit(a)} 
                                                style={actionBtnStyle('#38BDF8')}
                                                title="Modifica"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                onClick={() => onDelete(a.idAgenzia)} 
                                                style={actionBtnStyle('#F87171')}
                                                title="Elimina"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" style={{ padding: '30px', textAlign: 'center', color: '#94A3B8' }}>
                                    Nessuna agenzia registrata.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Stili locali per la tabella
const thStyle = { textAlign: 'left', padding: '15px', color: '#475569', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle = { padding: '15px', color: '#1E293B', fontSize: '0.95rem', borderBottom: '1px solid #F1F5F9' };
const rowStyle = { transition: 'background-color 0.2s' };
const actionBtnStyle = (color) => ({
    backgroundColor: 'transparent',
    border: `1px solid ${color}`,
    borderRadius: '8px',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

export default TabellaAgenzie;