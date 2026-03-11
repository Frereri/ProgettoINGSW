import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import { PropertyForm } from './PropertyForm'; 

const ImmobiliLista = ({ styles, apiUrl }) => {
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
            fetchImmobili(); // Ora è definita!
        } catch (err) { 
            alert("Errore durante l'eliminazione"); 
        }
    };

    if (loading) return <div style={{padding: '20px'}}>Caricamento immobili...</div>;

    if (editingProperty) {
        return (
            <div>
                {/* Usiamo backBtnStyle così sparisce il warning unused */}
                <button onClick={() => setEditingProperty(null)} style={backBtnStyle}>⬅ Torna alla lista</button>
                <PropertyForm 
                    initialData={editingProperty} 
                    isGestore={apiUrl.includes('gestore')}
                    onSubmit={() => { setEditingProperty(null); fetchImmobili(); }} 
                    styles={styles} 
                />
            </div>
        );
    }

    return (
        <div style={containerTableStyle}>
            <h3 style={titleStyle}>🏠 Immobili dell'Agenzia</h3>
            <table style={tableStyle}>
                <thead>
                    <tr style={headerRowStyle}>
                        <th>Indirizzo</th>
                        <th>Città</th>
                        <th>Prezzo</th>
                        <th style={{ textAlign: 'center' }}>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {immobili.map(imm => (
                        <tr key={imm.id || imm.idImmobile} style={rowStyle}>
                            <td>{imm.indirizzo}</td>
                            <td>{imm.citta}</td>
                            <td>€ {imm.prezzo?.toLocaleString()}</td>
                            <td style={{ textAlign: 'center' }}>
                                <button onClick={() => setEditingProperty(imm)} style={actionBtnStyle}>✏️</button>
                                <button onClick={() => handleDelete(imm.id || imm.idImmobile)} style={{ ...actionBtnStyle, color: 'red' }}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Stili minimi per coerenza
const backBtnStyle = { marginBottom: '15px', padding: '8px 15px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #ccc' };
const containerTableStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' };
const titleStyle = { color: '#2C3E50', borderBottom: '2px solid #5DADE2', paddingBottom: '10px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '10px' };
const headerRowStyle = { textAlign: 'left', backgroundColor: '#F8F9F9' };
const rowStyle = { borderBottom: '1px solid #eee' };
const actionBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', marginRight: '10px' };

export default ImmobiliLista;