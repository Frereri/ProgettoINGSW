import React, { useEffect, useState } from 'react';
import { getMieiAgenti } from '../../services/gestoreService';

const ListaAgenti = ({ onEdit, onElimina, styles }) => {
    const [agenti, setAgenti] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        caricaAgenti();
    }, []);

    const caricaAgenti = async () => {
        try {
            const data = await getMieiAgenti();
            setAgenti(data);
        } catch (error) {
            console.error("Errore nel caricamento agenti:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Caricamento in corso...</p>;

    return (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#2C3E50', marginBottom: '20px' }}>I tuoi Collaboratori</h3>
            
            {agenti.length === 0 ? (
                <p>Nessun agente registrato.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                            <th style={tableHeaderStyle}>Nome</th>
                            <th style={tableHeaderStyle}>Email</th>
                            <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agenti.map(agente => (
                            <tr key={agente.idUtente} style={tableRowStyle}>
                                <td style={tableCellStyle}>{agente.nome} {agente.cognome}</td>
                                <td style={tableCellStyle}>{agente.email}</td>
                                <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                                    {/* TASTO MODIFICA */}
                                    <button 
                                        onClick={() => onEdit(agente)}
                                        style={actionButtonStyle("#5DADE2")}
                                    >
                                        ✏️ Modifica
                                    </button>
                                    
                                    {/* TASTO ELIMINA */}
                                    <button 
                                        onClick={() => onElimina(agente.idUtente)}
                                        style={actionButtonStyle("#E74C3C")}
                                    >
                                        🗑️ Elimina
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

// Stili interni al componente per pulizia
const tableHeaderStyle = { padding: '12px', color: '#7F8C8D', fontWeight: '600' };
const tableCellStyle = { padding: '12px', borderBottom: '1px solid #f2f2f2' };
const tableRowStyle = { transition: 'background 0.3s', ':hover': { backgroundColor: '#f9f9f9' } };

const actionButtonStyle = (color) => ({
    backgroundColor: color,
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '6px 12px',
    margin: '0 5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
});

export default ListaAgenti;