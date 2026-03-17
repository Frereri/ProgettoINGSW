import React, { useEffect, useState, useCallback } from 'react';
import { getMieiAgenti } from '../../services/gestoreService';
import { useAuth } from '../../context/useAuth';

const ListaAgenti = ({ onEdit, onElimina }) => {
    const [agenti, setAgenti] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const caricaAgenti = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMieiAgenti();
            setAgenti(data);
        } catch (err) {
            console.error("Errore nel caricamento agenti:", err);
            setError("Impossibile caricare la lista dei collaboratori.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        caricaAgenti();
    }, [caricaAgenti]);

    if (loading) return <div style={statusMessageStyle}>Caricamento in corso...</div>;
    if (error) return <div style={{ ...statusMessageStyle, color: '#E74C3C' }}>{error}</div>;

    return (
        <div style={tableContainerStyle}>
            <div style={tableHeaderContainer}>
                <h3 style={tableTitleStyle}>I tuoi Collaboratori</h3>
                <span style={badgeStyle}>{agenti.length} Agenti</span>
            </div>
            
            {agenti.length === 0 ? (
                <p style={emptyStateStyle}>Nessun agente registrato nella tua agenzia.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                        <thead>
                            <tr style={headerRowStyle}>
                                <th style={thStyle}>Nominativo</th>
                                <th style={thStyle}>Email Aziendale</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agenti.map(agente => (
                                <tr key={agente.idUtente} style={trStyle}>
                                    <td style={tdStyle}>
                                        <div style={nameContainer}>
                                            <span style={avatarStyle}>{agente.nome[0]}{agente.cognome[0]}</span>
                                            {agente.nome} {agente.cognome}
                                        </div>
                                    </td>
                                    <td style={tdStyle}>{agente.email}</td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        <button 
                                            onClick={() => onEdit(agente)}
                                            style={actionBtnStyle("#F1F5F9", "#475569")}
                                            title="Modifica"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            onClick={() => onElimina(agente.idUtente)}
                                            style={actionBtnStyle("#FEE2E2", "#EF4444")}
                                            title="Elimina"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// --- STILI ---
const tableContainerStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #E2E8F0' };
const tableHeaderContainer = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' };
const tableTitleStyle = { color: '#0F172A', fontSize: '1.25rem', fontWeight: '700', margin: 0 };
const badgeStyle = { backgroundColor: '#F1F5F9', color: '#475569', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const headerRowStyle = { borderBottom: '2px solid #F1F5F9' };
const thStyle = { padding: '15px', color: '#64748B', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' };
const trStyle = { borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' };
const tdStyle = { padding: '16px', color: '#1E293B', fontSize: '0.95rem' };
const nameContainer = { display: 'flex', alignItems: 'center', gap: '12px' };
const avatarStyle = { width: '32px', height: '32px', backgroundColor: '#E0F2FE', color: '#0EA5E9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' };
const actionBtnStyle = (bg, color) => ({ backgroundColor: bg, color: color, border: 'none', borderRadius: '8px', padding: '8px 12px', margin: '0 4px', cursor: 'pointer', transition: 'transform 0.1s' });
const statusMessageStyle = { textAlign: 'center', padding: '40px', color: '#64748B', fontWeight: '500' };
const emptyStateStyle = { textAlign: 'center', padding: '40px', color: '#94A3B8', fontStyle: 'italic' };

export default ListaAgenti;