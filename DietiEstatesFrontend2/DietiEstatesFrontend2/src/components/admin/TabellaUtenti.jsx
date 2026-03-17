import React from 'react';

const getRoleBadgeStyle = (role) => {
    
    const normalizedRole = role ? role.toUpperCase().trim() : 'DEFAULT';

    const roles = {
        'GESTORE': { bg: '#DBEAFE', text: '#1E40AF', label: 'GESTORE' },
        'SUPPORTO_AMMINISTRATORE': { bg: '#FFEDD5', text: '#9A3412', label: 'SUPPORTO' },
        'AMMINISTRATORE': { bg: '#F1F5F9', text: '#0F172A', label: 'ADMIN' },
        'AGENTE': { bg: '#DCFCE7', text: '#166534', label: 'AGENTE' },
        'CLIENTE': { bg: '#F3E8FF', text: '#6B21A8', label: 'CLIENTE' },
        'DEFAULT': { bg: '#F1F5F9', text: '#475569', label: 'N/D' }
    };

    const config = roles[normalizedRole] || roles['DEFAULT'];

    return {
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '700',
        backgroundColor: config.bg,
        color: config.text,
        display: 'inline-block',
        label: config.label
    };
};

const TabellaUtenti = ({ utenti, onEdit, onDelete, styles, currentUserRole }) => {
    const normalizedCurrentUserRole = currentUserRole?.toUpperCase().trim();

    const canDelete = (targetUser) => {
        const targetRole = targetUser.ruolo?.toUpperCase().trim();
        if (normalizedCurrentUserRole === 'AMMINISTRATORE') return true;
        if (normalizedCurrentUserRole === 'SUPPORTO_AMMINISTRATORE') {
            return ['GESTORE', 'AGENTE', 'CLIENTE'].includes(targetRole);
        }
        return false;
    };

    return (
        <div style={{ ...styles.formCardStyle, maxWidth: '100%', padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                <span style={{ fontSize: '1.5rem' }}>👥</span>
                <h3 style={{ margin: 0, color: '#1E293B', fontWeight: '800' }}>Gestione Utenti</h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                            <th style={thStyle}>Profilo Utente</th>
                            <th style={thStyle}>Ruolo</th>
                            <th style={{ ...thStyle, textAlign: 'center' }}>Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {utenti
                            .filter(u => {
                                const role = u.ruolo ? u.ruolo.toUpperCase().trim() : '';
                                
                                return role !== 'AMMINISTRATORE' && role !== '';
                            })
                            .map(u => (
                                <tr key={u.idUtente || u.id} style={rowStyle}>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '700', color: '#1E293B' }}>{u.nome} {u.cognome}</span>
                                            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>{u.email}</span>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        {/* Visualizzazione del badge */}
                                        <span style={getRoleBadgeStyle(u.ruolo)}>
                                            {getRoleBadgeStyle(u.ruolo).label}
                                        </span>
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                            <button onClick={() => onEdit(u)} style={btnStyle('#38BDF8')} title="Modifica">
                                                ✏️
                                            </button>
                                            {canDelete(u) ? (
                                                <button onClick={() => onDelete(u)} style={btnStyle('#F87171')} title="Elimina">
                                                    🗑️
                                                </button>
                                            ) : (
                                                <span style={lockIconStyle} title="Permessi insufficienti">🔒</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Stili locali
const thStyle = { textAlign: 'left', padding: '15px', color: '#475569', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' };
const tdStyle = { padding: '15px', borderBottom: '1px solid #F1F5F9' };
const rowStyle = { transition: 'background-color 0.2s' };
const btnStyle = (color) => ({
    backgroundColor: 'transparent',
    border: `1px solid ${color}`,
    borderRadius: '8px',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: '1rem'
});
const lockIconStyle = { padding: '6px 10px', fontSize: '1rem', cursor: 'help', opacity: 0.4 };

export default TabellaUtenti;