import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import ImmobileForm from './ImmobileForm';

const ListaImmobili = ({ styles, apiUrl }) => {
    const [immobili, setImmobili] = useState([]);
    const [editingProperty, setEditingProperty] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchImmobili = useCallback(async () => {
        if (!apiUrl) return;
        
        try {
            setLoading(true);
            const session = await fetchAuthSession();
            const token = session.tokens.accessToken.toString();
            const res = await axios.get(apiUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setImmobili(res.data);
        } catch (err) { 
            console.error("Errore fetch immobili:", err); 
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    useEffect(() => { 
        if (apiUrl) fetchImmobili(); 
    }, [fetchImmobili, apiUrl]);

    const handleDelete = async (id) => {
        if (!id) return;
        if (!window.confirm("Sei sicuro di voler eliminare questo immobile?")) return;
        
        try {
            const session = await fetchAuthSession();
            const token = session.tokens.accessToken.toString();
            await axios.delete(`http://localhost:8080/api/immobile/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Immobile eliminato correttamente");
            fetchImmobili();
        } catch (err) { 
            alert("Errore durante l'eliminazione"); 
        }
    };

    if (loading) return <div style={{padding: '20px'}}>Caricamento immobili...</div>;

    // Vista di Modifica
    if (editingProperty) {
        return (
            <div>
                <button onClick={() => setEditingProperty(null)} style={backBtnStyle}>
                    ⬅ Torna alla lista
                </button>
                <ImmobileForm 
                    initialData={editingProperty} 
                    isGestore={apiUrl.includes('gestore')}
                    onSave={() => { 
                        setEditingProperty(null); 
                        fetchImmobili(); 
                    }} 
                    styles={styles} 
                />
            </div>
        );
    }

    return (
        <div style={containerTableStyle}>
            <h3 style={titleStyle}>🏠 Gestione Immobili</h3>
            <table style={tableStyle}>
                <thead>
                    <tr style={tableHeaderRowStyle}>
                        <th style={tableHeaderStyle}>Indirizzo</th>
                        <th style={tableHeaderStyle}>Città</th>
                        <th style={tableHeaderStyle}>Prezzo</th>
                        <th style={tableHeaderStyle}>Contratto</th>
                        <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {immobili.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                Nessun immobile trovato.
                            </td>
                        </tr>
                    ) : (
                        immobili.map(imm => (
                            <tr key={imm.idImmobile} style={tableRowStyle}>
                                <td style={tableCellStyle}>{imm.indirizzo}</td>
                                <td style={tableCellStyle}>{imm.citta} ({imm.provincia})</td>
                                <td style={tableCellStyle}>€ {imm.prezzo?.toLocaleString()}</td>
                                <td style={tableCellStyle}>
                                    <span style={badgeStyle(imm.tipoContratto)}>
                                        {imm.tipoContratto}
                                    </span>
                                </td>
                                <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                                    <button 
                                        onClick={() => setEditingProperty(imm)} 
                                        style={{ ...actionBtnStyle, color: '#3498db' }}
                                        title="Modifica"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(imm.idImmobile)} 
                                        style={{ ...actionBtnStyle, color: '#e74c3c' }}
                                        title="Elimina"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

// --- STILI ---

const containerTableStyle = { 
    backgroundColor: 'white', 
    padding: '25px', 
    borderRadius: '15px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)' 
};

const titleStyle = { 
    color: '#2C3E50', 
    marginBottom: '20px', 
    fontSize: '22px',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '10px'
};

const tableStyle = { 
    width: '100%', 
    borderCollapse: 'collapse' 
};

const tableHeaderRowStyle = {
    backgroundColor: '#F8F9FA',
    textAlign: 'left'
};

const tableHeaderStyle = { 
    padding: '12px 15px', 
    color: '#7F8C8D', 
    fontWeight: '600',
    fontSize: '14px',
    textTransform: 'uppercase',
    borderBottom: '2px solid #eee'
};

const tableCellStyle = { 
    padding: '15px', 
    borderBottom: '1px solid #f2f2f2',
    fontSize: '15px',
    color: '#2C3E50'
};

const tableRowStyle = {
    transition: 'background 0.2s',
    cursor: 'default'
};

const backBtnStyle = { 
    marginBottom: '20px', 
    padding: '10px 20px', 
    cursor: 'pointer', 
    borderRadius: '8px', 
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    fontWeight: '500',
    transition: 'all 0.3s'
};

const actionBtnStyle = { 
    background: 'none', 
    border: 'none', 
    cursor: 'pointer', 
    fontSize: '18px', 
    margin: '0 8px',
    transition: 'transform 0.2s'
};

const badgeStyle = (tipo) => ({
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: tipo === 'VENDITA' ? '#EBF5FB' : '#E8F8F5',
    color: tipo === 'VENDITA' ? '#2E86C1' : '#1E8449'
});

export default ListaImmobili;