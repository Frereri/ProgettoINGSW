import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';

const GestoreDashboard = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('immobili');
    const [formData, setFormData] = useState({ email: '', nome: '', cognome: '' });

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    const handleCreateAgente = async (e) => {
        e.preventDefault();
        try {
            const session = await fetchAuthSession();
            const token = session.tokens.accessToken.toString();
            await axios.post("http://localhost:8080/api/gestore/registra-agente", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Agente creato!");
            setFormData({ email: '', nome: '', cognome: '' });
        } catch (err) {
            alert("Errore: " + err.message);
        }
    };

    return (
        <div style={containerStyle}>
            <aside style={sidebarStyle}>
                <h2 style={{color: '#5DADE2'}}>Gestore Panel</h2>
                <hr style={{borderColor: '#444', marginBottom: '20px'}}/>
                <button style={menuButtonStyle} onClick={() => setView('immobili')}>🏠 Immobili Agenzia</button>
                <button style={menuButtonStyle} onClick={() => setView('createAgente')}>👤 Nuovo Agente</button>
                <button style={{...menuButtonStyle, marginTop: 'auto', backgroundColor: '#E74C3C'}} onClick={handleLogout}>🚪 Logout</button>
            </aside>
            <main style={{flex: 1, padding: '40px', backgroundColor: '#f4f7f6'}}>
                {view === 'createAgente' && (
                    <div style={cardStyle}>
                        <h2>Registra Nuovo Agente</h2>
                        <form onSubmit={handleCreateAgente} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                            <input style={inputStyle} placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                            <input style={inputStyle} placeholder="Nome" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required />
                            <input style={inputStyle} placeholder="Cognome" value={formData.cognome} onChange={e => setFormData({...formData, cognome: e.target.value})} required />
                            <button type="submit" style={submitButtonStyle}>Crea Agente</button>
                        </form>
                    </div>
                )}
                {view === 'immobili' && <h1>Benvenuto! Seleziona un'azione.</h1>}
            </main>
        </div>
    );
};

// DEFINIZIONE STILI MANCANTI
const containerStyle = { display: 'flex', minHeight: '100vh' };
const sidebarStyle = { width: '260px', backgroundColor: '#2C3E50', color: 'white', display: 'flex', flexDirection: 'column', padding: '20px' };
const menuButtonStyle = { backgroundColor: '#34495E', color: 'white', border: 'none', padding: '12px', marginBottom: '10px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' };
const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', maxWidth: '500px' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #ddd' };
const submitButtonStyle = { padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' };

export default GestoreDashboard;