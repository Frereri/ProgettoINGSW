import React from 'react';

// Funzione interna per gestire i colori dei ruoli
const getRoleBadgeStyle = (role) => {
    let bgColor = '#BDC3C7'; // Default grigio
    if (role === 'GESTORE') bgColor = '#3498DB'; // Blu
    if (role === 'SUPPORTO_AMMINISTRATORE') bgColor = '#E67E22'; // Arancione
    if (role === 'AMMINISTRATORE') bgColor = '#2C3E50'; // Nero/Blu scuro
    if (role === 'AGENTE') bgColor = '#2ECC71'; // Verde

    return {
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        backgroundColor: bgColor,
        color: 'white',
        whiteSpace: 'nowrap'
    };
};

export const UserTable = ({ utenti, onEdit, onDelete, styles, currentUserRole }) => {
    const normalizedCurrentUserRole = currentUserRole?.toUpperCase().trim();

    const canDelete = (targetUser) => {
        // Uniformiamo il ruolo dell'utente nella riga
        const targetRole = targetUser.ruolo?.toUpperCase().trim();
        
        // DEBUG per te: vedi cosa sta confrontando il sistema
        // console.log(`Io sono: ${normalizedCurrentUserRole}, sto guardando: ${targetRole}`);

        // 1. Se sono AMMINISTRATORE, posso eliminare tutti
        if (normalizedCurrentUserRole === 'AMMINISTRATORE') return true;
        
        // 2. Se sono SUPPORTO, posso eliminare solo GESTORE o AGENTE
        if (normalizedCurrentUserRole === 'SUPPORTO' || normalizedCurrentUserRole === 'SUPPORTO_AMMINISTRATORE') {
            return targetRole === 'GESTORE' || targetRole === 'AGENTE' || targetRole === 'CLIENTE';
        }
        
        return false;
    };

    return (
        <div style={{ ...styles.formCardStyle, maxWidth: '100%' }}>
            <h2>👥 Gestione Utenti</h2>
            <table style={styles.tableStyle}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #eee' }}>
                        <th style={{ textAlign: 'left', padding: '10px' }}>Utente</th>
                        <th style={{ textAlign: 'left', padding: '10px' }}>Ruolo</th>
                        <th style={{ textAlign: 'center', padding: '10px' }}>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {utenti.map(u => (
                        <tr key={u.idUtente || u.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>
                                <strong>{u.nome} {u.cognome}</strong> <br/>
                                <span style={{ fontSize: '0.85rem', color: '#7F8C8D' }}>{u.email}</span>
                            </td>
                            <td style={{ padding: '10px' }}>
                                <span style={getRoleBadgeStyle(u.ruolo)}>
                                    {u.ruolo === 'SUPPORTO_AMMINISTRATORE' ? 'SUPPORTO' : u.ruolo}
                                </span>
                            </td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                {/* Modifica sempre permessa */}
                                <button 
                                    onClick={() => onEdit(u)} 
                                    style={styles.actionBtnEdit}
                                >
                                    ✏️
                                </button>

                                {/* Logica condizionale per l'eliminazione */}
                                {canDelete(u) ? (
                                    <button 
                                        onClick={() => onDelete(u)} 
                                        style={styles.actionBtnDelete}
                                    >
                                        🗑️
                                    </button>
                                ) : (
                                    <span 
                                        title="Permessi insufficienti per eliminare questo ruolo" 
                                        style={{ marginLeft: '10px', cursor: 'not-allowed', opacity: 0.5 }}
                                    >
                                        🚫
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};