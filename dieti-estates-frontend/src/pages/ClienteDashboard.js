import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchAuthSession, updatePassword, signOut } from 'aws-amplify/auth';
import Logo from '../components/Logo';

const ClienteDashboard = () => {
    const navigate = useNavigate();
    const [offerte, setOfferte] = useState([]);
    const [view, setView] = useState('offerte');
    const [pwData, setPwData] = useState({ oldPw: '', newPw: '' });
    const [showOldPw, setShowOldPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);

    useEffect(() => {
        caricaOfferte();
    }, []);

    const caricaOfferte = async () => {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.accessToken?.toString();
            if (!token) return;

            const res = await axios.get("http://localhost:8080/api/cliente/mie-offerte", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOfferte(res.data);
        } catch (err) { 
            console.error("Errore offerte (Endpoint non trovato o vuoto):", err); 
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await updatePassword({ oldPassword: pwData.oldPw, newPassword: pwData.newPw });
            alert("Password aggiornata con successo!");
            setPwData({ oldPw: '', newPw: '' });
        } catch (err) { alert("Errore: " + err.message); }
    };

    const rispondi = async (idOfferta, nuovoStato) => {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.accessToken?.toString();
            
            // Usiamo l'endpoint PATCH che hai creato su Eclipse
            await axios.patch(`http://localhost:8080/api/cliente/offerte/${idOfferta}/rispondi`, null, {
                params: { nuovoStato: nuovoStato },
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(`Offerta ${nuovoStato.toLowerCase()} con successo!`);
            caricaOfferte(); // Ricarichiamo la lista aggiornata
        } catch (err) {
            console.error("Errore nella risposta:", err);
            alert("Errore durante l'operazione.");
        }
    };
    return (
        <div style={containerStyle}>
            <aside style={sidebarStyle}>
                <div style={{textAlign: 'center', marginBottom: '30px'}}>
                    <Logo width="60px" height="60px" />
                    <h2 style={{color: '#5DADE2', fontSize: '1.2rem', marginTop: '10px'}}>Area Cliente</h2>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    {/* TASTO PER TORNARE ALLA RICERCA */}
                    <button style={searchButtonStyle} onClick={() => navigate('/')}>
                        🔍 Cerca Immobili
                    </button>

                    <button 
                        style={view === 'offerte' ? activeMenuButtonStyle : menuButtonStyle} 
                        onClick={() => setView('offerte')}
                    >
                        📊 Le mie Offerte
                    </button>
                    
                    <button 
                        style={view === 'password' ? activeMenuButtonStyle : menuButtonStyle} 
                        onClick={() => setView('password')}
                    >
                        🔑 Cambia Password
                    </button>

                    <button style={logoutButtonStyle} onClick={handleLogout}>
                        🚪 Logout
                    </button>
                </div>
            </aside>

            <main style={{ flex: 1, padding: '40px', backgroundColor: '#f4f7f6' }}>
                {view === 'offerte' && (
                    <div style={cardStyle}>
                        <h2 style={{color: '#2C3E50'}}>Storico Offerte</h2>
                        {offerte.length > 0 ? (
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={{borderBottom: '2px solid #ddd'}}>
                                        <th style={thStyle}>Immobile</th>
                                        <th style={thStyle}>Valore Offerta</th>
                                        <th style={thStyle}>Stato</th>
                                        <th style={thStyle}>Azioni</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {offerte.map(o => (
                                        <tr key={o.idOfferta} style={{borderBottom: '1px solid #eee'}}>
                                            <td style={tdStyle}>{o.titoloImmobile || "Immobile #"+o.immobileId}</td>
                                            <td style={tdStyle}>{o.prezzoOfferto} €</td>
                                            <td style={tdStyle}>
                                                <span style={statusBadgeStyle(o.stato)}>{o.stato}</span>
                                            </td>
                                            <td style={tdStyle}>
                                                {/* LOGICA PULSANTI */}
                                                {o.stato === 'CONTROFFERTA' && (
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <button 
                                                            onClick={() => rispondi(o.idOfferta, 'ACCETTATA')} 
                                                            style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                                        >
                                                            Accetta
                                                        </button>
                                                        <button 
                                                            onClick={() => rispondi(o.idOfferta, 'RIFIUTATA')} 
                                                            style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                                        >
                                                            Rifiuta
                                                        </button>
                                                    </div>
                                                )}
                                                {o.stato === 'IN_ATTESA' && (
                                                    <span style={{ fontSize: '0.85rem', color: '#7F8C8D', fontStyle: 'italic' }}>
                                                        In attesa dell'agente...
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Non hai ancora effettuato offerte. Vai alla ricerca per iniziare!</p>
                        )}
                    </div>
                )}

                {view === 'password' && (
                    <div style={formCardStyle}>
                        <h2 style={{ color: '#2C3E50', marginBottom: '20px' }}>Sicurezza Account</h2>
                        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            
                            {/* Campo Vecchia Password */}
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type={showOldPw ? "text" : "password"} 
                                    placeholder="Password Attuale" 
                                    style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} 
                                    value={pwData.oldPw} 
                                    onChange={e => setPwData({ ...pwData, oldPw: e.target.value })} 
                                    required 
                                />
                                <span 
                                    onClick={() => setShowOldPw(!showOldPw)} 
                                    style={eyeToggleStyle}
                                >
                                    {showOldPw ? "NASCONDI" : "MOSTRA"}
                                </span>
                            </div>

                            {/* Campo Nuova Password */}
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type={showNewPw ? "text" : "password"} 
                                    placeholder="Nuova Password" 
                                    style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} 
                                    value={pwData.newPw} 
                                    onChange={e => setPwData({ ...pwData, newPw: e.target.value })} 
                                    required 
                                />
                                <span 
                                    onClick={() => setShowNewPw(!showNewPw)} 
                                    style={eyeToggleStyle}
                                >
                                    {showNewPw ? "NASCONDI" : "MOSTRA"}
                                </span>
                            </div>

                            <button type="submit" style={submitButtonStyle}>Aggiorna Password</button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

// --- STILI ---

const eyeToggleStyle = {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '0.65rem',
    color: '#A0AEC0',
    fontWeight: '800',
    letterSpacing: '0.5px'
};
const containerStyle = { display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' };
const sidebarStyle = { width: '280px', backgroundColor: '#2C3E50', color: 'white', display: 'flex', flexDirection: 'column', padding: '30px 20px' };

const menuButtonStyle = { 
    backgroundColor: '#34495E', border: 'none', color: 'white', textAlign: 'left', 
    padding: '12px 15px', cursor: 'pointer', borderRadius: '8px', marginBottom: '5px' 
};

const activeMenuButtonStyle = { ...menuButtonStyle, backgroundColor: '#5DADE2', fontWeight: 'bold' };

const searchButtonStyle = { 
    ...menuButtonStyle, backgroundColor: '#27AE60', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' 
};

const logoutButtonStyle = { ...menuButtonStyle, marginTop: 'auto', backgroundColor: '#E74C3C', textAlign: 'center' };

const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const formCardStyle = { ...cardStyle, maxWidth: '450px' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' };
const submitButtonStyle = { padding: '12px', backgroundColor: '#5DADE2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };

const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
const thStyle = { textAlign: 'left', padding: '12px', color: '#7F8C8D' };
const tdStyle = { padding: '12px' };
const statusBadgeStyle = (status) => {
    let bg = '#eee';
    let color = '#333';

    if (status === 'ACCETTATA') { bg = '#D4EFDF'; color = '#1E8449'; }
    else if (status === 'RIFIUTATA') { bg = '#FADBD8'; color = '#943126'; }
    else if (status === 'CONTROFFERTA') { bg = '#FEF5E7'; color = '#AF601A'; } // Arancione per controfferta
    else if (status === 'IN_ATTESA') { bg = '#EBF5FB'; color = '#2E86C1'; }

    return {
        padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem',
        backgroundColor: bg, color: color, fontWeight: 'bold'
    };
};

export default ClienteDashboard;