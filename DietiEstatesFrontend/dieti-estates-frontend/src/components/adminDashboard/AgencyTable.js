import React from 'react';

export const AgencyTable = ({ agenzie, onEdit, onDelete, styles }) => {
    return (
        <div style={{ ...styles.formCardStyle, maxWidth: '100%' }}>
            <h3>🏢 Lista Agenzie</h3>
            <table style={styles.tableStyle}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #eee' }}>
                        <th style={{ textAlign: 'left', padding: '10px' }}>Nome</th>
                        <th style={{ textAlign: 'left', padding: '10px' }}>P.IVA</th>
                        <th style={{ textAlign: 'center', padding: '10px' }}>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {agenzie.map(a => (
                        <tr key={a.idAgenzia} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>{a.nomeAgenzia}</td>
                            <td style={{ padding: '10px' }}>{a.partitaIva}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                <button 
                                    onClick={() => onEdit(a)} 
                                    style={styles.actionBtnEdit}
                                >
                                    ✏️
                                </button>
                                <button 
                                    onClick={() => onDelete(a.idAgenzia)} 
                                    style={styles.actionBtnDelete}
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};