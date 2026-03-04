import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import axios from 'axios';
import Logo from '../components/Logo';
import { fetchAuthSession } from 'aws-amplify/auth';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('overview'); // 'overview', 'createGestore', 'createSupporto'
    const [agenzie, setAgenzie] = useState([]);

    // Form unico per entrambi (visto che i dati base sono simili)
    const [formData, setFormData] = useState({
        email: '',
        nome: '',
        cognome: '',
        idAgenzia: ''
    });

    useEffect(() => {
        // Carichiamo le agenzie per il dropdown del Gestore
        axios.get("http://localhost:8080/api/agenzia")
            .then(res => {
            console.log("Dati agenzie ricevuti:", res.data);
            setAgenzie(res.data);
        })
        .catch(err => console.error("Errore caricamento agenzie", err));
}, []);

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    const handleSubmit = async (e, type) => {
        e.preventDefault();
        const endpoint = type === 'gestore' ? '/registra-gestore' : '/registra-supporto';
        
        try {
            // 1. Recuperiamo la sessione attuale
            const session = await fetchAuthSession();
            const token = session.tokens?.accessToken?.toString(); // Estraiamo il token stringa

            if (!token) {
                alert("Sessione scaduta o non valida. Effettua di nuovo il login.");
                return;
            }

            // 2. Inviamo la richiesta includendo il token nell'Header
            await axios.post(
                `http://localhost:8080/api/amministratore${endpoint}`, 
                formData, 
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Il formato standard è 'Bearer <token>'
                    }
                }
            );

            alert(`${type.toUpperCase()} creato con successo!`);
            setFormData({ email: '', nome: '', cognome: '', agenziaId: '' });
            setView('overview');
        } catch (err) {
            console.error("Dettaglio errore:", err.response);
            alert("Errore nella creazione: " + (err.response?.data || err.message));
        }
    };

    return (
        <div style={adminContainerStyle}>
            {/* Sidebar Simil-Agente */}

            <aside style={sidebarStyle}>
                <div style={{textAlign: 'center', marginBottom: '30px'}}>
                    <Logo width="60px" height="60px" />
                    <h2 style={{color: '#5DADE2', fontSize: '1.2rem', marginTop: '10px'}}>Admin Panel</h2>
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <button 
                        style={view === 'overview' ? activeMenuButtonStyle : menuButtonStyle} 
                        onClick={() => setView('overview')}
                    >
                        🏠 Home Dashboard
                    </button>
                    
                    <button 
                        style={view === 'createGestore' ? activeMenuButtonStyle : menuButtonStyle} 
                        onClick={() => setView('createGestore')}
                    >
                        👤 Nuovo Gestore
                    </button>
                    
                    <button 
                        style={view === 'createSupporto' ? activeMenuButtonStyle : menuButtonStyle} 
                        onClick={() => setView('createSupporto')}
                    >
                        🛠️ Nuovo Supporto
                    </button>

                    <button 
                        style={logoutButtonStyle} 
                        onClick={handleLogout}
                    >
                        🚪 Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '40px', backgroundColor: '#f4f7f6' }}>
                {view === 'overview' && (
                    <div>
                        <h1>Bentornato, Amministratore</h1>
                        <p>Seleziona un'operazione dal menu a sinistra per gestire la piattaforma.</p>
                        <div style={statsGridStyle}>
                            <div style={statCardStyle}><h3>Agenzie Attive</h3><p>{agenzie.length}</p></div>
                        </div>
                    </div>
                )}

                {(view === 'createGestore' || view === 'createSupporto') && (
                    <div style={formCardStyle}>
                        <h2>Registra {view === 'createGestore' ? 'Gestore' : 'Supporto'}</h2>
                        <form onSubmit={(e) => handleSubmit(e, view === 'createGestore' ? 'gestore' : 'supporto')} style={formStyle}>
                            <input placeholder="Email" style={inputStyle} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                            <input placeholder="Nome" style={inputStyle} value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required />
                            <input placeholder="Cognome" style={inputStyle} value={formData.cognome} onChange={e => setFormData({...formData, cognome: e.target.value})} required />
                            
                            {view === 'createGestore' && (
                                <select 
                                    style={inputStyle} 
                                    value={formData.idAgenzia} 
                                    onChange={e => setFormData({...formData, idAgenzia: e.target.value})} 
                                    required
                                >
                                    <option value="">Seleziona un'agenzia...</option>
                                    {agenzie.map((a) => (
                                        <option key={a.idAgenzia} value={a.idAgenzia}>
                                            {a.nomeAgenzia}
                                        </option>
                                    ))}
                                </select>
                            )}

                            <button type="submit" style={submitButtonStyle}>Conferma Registrazione</button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

// --- STILI DASHBOARD ---

const menuButtonStyle = { 
    backgroundColor: '#34495E', 
    border: 'none', 
    color: 'white', 
    textAlign: 'left', 
    padding: '12px 15px', 
    cursor: 'pointer', 
    fontSize: '0.9rem', 
    borderRadius: '8px', 
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 0px #22313F', // Effetto spessore del tasto
    display: 'block',
    width: '100%'
};

const activeMenuButtonStyle = {
    ...menuButtonStyle,
    backgroundColor: '#5DADE2', 
    boxShadow: '0 4px 0px #3498DB',
    fontWeight: 'bold',
    transform: 'translateY(-2px)' // Si alza quando è attivo
};

const logoutButtonStyle = {
    ...menuButtonStyle,
    marginTop: '50px',
    backgroundColor: '#E74C3C',
    boxShadow: '0 4px 0px #C0392B',
    textAlign: 'center'
};

const submitButtonStyle = { 
    padding: '15px', 
    backgroundColor: '#27AE60', // Verde per dare l'idea di "azione positiva"
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontWeight: 'bold',
    fontSize: '1rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginTop: '10px'
};
const adminContainerStyle = { display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' };
const sidebarStyle = { width: '250px', backgroundColor: '#2C3E50', color: 'white', display: 'flex', flexDirection: 'column', padding: '20px', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' };
const formCardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: '500px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' };
const statsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' };
const statCardStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' };

export default AdminDashboard;