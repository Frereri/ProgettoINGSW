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
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

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
            console.error("Errore caricamento offerte:", err); 
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (err) { console.error("Logout error:", err); }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        try {
            await updatePassword({ oldPassword: pwData.oldPw, newPassword: pwData.newPw });
            setMessage({ text: "Password aggiornata con successo!", type: 'success' });
            setPwData({ oldPw: '', newPw: '' });
        } catch (err) { 
            setMessage({ text: "Errore: " + err.message, type: 'error' }); 
        }
    };

    const rispondi = async (idOfferta, nuovoStato) => {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.accessToken?.toString();
            
            await axios.patch(`http://localhost:8080/api/cliente/offerte/${idOfferta}/rispondi`, null, {
                params: { nuovoStato: nuovoStato },
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage({ text: `Offerta ${nuovoStato.toLowerCase()} con successo!`, type: 'success' });
            caricaOfferte();
        } catch (err) {
            setMessage({ text: "Errore durante l'operazione.", type: 'error' });
        }
    };

    return (
        <div style={containerStyle}>
            {/* SIDEBAR */}
            <aside style={sidebarStyle}>
                <div style={logoSectionStyle} onClick={() => navigate('/')}>
                    <Logo width="70px" height="70px" />
                    <h2 style={sidebarTitleStyle}>Area Cliente</h2>
                </div>

                <nav style={navContainerStyle}>
                    <button style={searchButtonStyle} onClick={() => navigate('/')}>
                        🔍 Torna alla Ricerca
                    </button>

                    <div style={navDividerStyle}>MENU</div>

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
                        🔑 Sicurezza Account
                    </button>

                    <button style={logoutButtonStyle} onClick={handleLogout}>
                        🚪 Esci
                    </button>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main style={mainContentStyle}>
                <header style={headerStyle}>
                    <h1 style={titleStyle}>
                        {view === 'offerte' ? 'Gestione Proposte' : 'Impostazioni Sicurezza'}
                    </h1>
                    <p style={subtitleStyle}>Bentornato nella tua area riservata.</p>
                </header>

                {message.text && (
                    <div style={message.type === 'success' ? successoStyle : erroreStyle}>
                        {message.text}
                    </div>
                )}

                {view === 'offerte' && (
                    <div style={gridStyle}>
                        {offerte.length > 0 ? (
                            offerte.map(o => (
                                <div key={o.idOfferta} style={offerCardStyle}>
                                    <div style={cardHeaderStyle}>
                                        <h3 style={cardTitleStyle}>{o.titoloImmobile || "Proposta Immobiliare"}</h3>
                                        <span style={statusBadgeStyle(o.stato)}>{o.stato}</span>
                                    </div>
                                    <div style={cardBodyStyle}>
                                        <div style={infoRowStyle}>
                                            <span style={labelStyle}>Prezzo offerto:</span>
                                            <span style={valueStyle}>{o.prezzoOfferto.toLocaleString()} €</span>
                                        </div>
                                        {o.note && <p style={noteStyle}>"{o.note}"</p>}
                                    </div>
                                    
                                    <div style={cardFooterStyle}>
                                        {o.stato === 'CONTROFFERTA' ? (
                                            <div style={actionGroupStyle}>
                                                <button 
                                                    onClick={() => rispondi(o.idOfferta, 'ACCETTATA')} 
                                                    style={btnAccettaStyle}
                                                >
                                                    Accetta
                                                </button>
                                                <button 
                                                    onClick={() => rispondi(o.idOfferta, 'RIFIUTATA')} 
                                                    style={btnRifiutaStyle}
                                                >
                                                    Rifiuta
                                                </button>
                                            </div>
                                        ) : (
                                            <span style={statusInfoStyle}>
                                                {o.stato === 'IN_ATTESA' ? '⏳ In attesa di revisione' : '✅ Pratica conclusa'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={emptyStateStyle}>
                                <p>Non hai ancora inviato proposte. Inizia a cercare la tua prossima casa!</p>
                                <button onClick={() => navigate('/')} style={btnSearchSmall}>Cerca ora</button>
                            </div>
                        )}
                    </div>
                )}

                {view === 'password' && (
                    <div style={formContainerStyle}>
                        <form onSubmit={handleChangePassword} style={formStyle}>
                            <div style={inputGroupStyle}>
                                <label style={inputLabelStyle}>Password Attuale</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type={showOldPw ? "text" : "password"} 
                                        style={inputStyle} 
                                        value={pwData.oldPw} 
                                        onChange={e => setPwData({ ...pwData, oldPw: e.target.value })} 
                                        required 
                                    />
                                    <span onClick={() => setShowOldPw(!showOldPw)} style={eyeToggleStyle}>
                                        {showOldPw ? "Nascondi" : "Mostra"}
                                    </span>
                                </div>
                            </div>

                            <div style={inputGroupStyle}>
                                <label style={inputLabelStyle}>Nuova Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type={showNewPw ? "text" : "password"} 
                                        style={inputStyle} 
                                        value={pwData.newPw} 
                                        onChange={e => setPwData({ ...pwData, newPw: e.target.value })} 
                                        required 
                                    />
                                    <span onClick={() => setShowNewPw(!showNewPw)} style={eyeToggleStyle}>
                                        {showNewPw ? "Nascondi" : "Mostra"}
                                    </span>
                                </div>
                            </div>

                            <button type="submit" style={submitButtonStyle}>Aggiorna Credenziali</button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

// --- STILI ---

const containerStyle = { display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' };

const sidebarStyle = { 
    width: '300px', 
    backgroundColor: '#1E293B', 
    color: 'white', 
    display: 'flex', 
    flexDirection: 'column', 
    padding: '40px 24px',
    boxShadow: '4px 0 10px rgba(0,0,0,0.05)'
};

const logoSectionStyle = { textAlign: 'center', marginBottom: '40px', cursor: 'pointer' };
const sidebarTitleStyle = { fontSize: '1.1rem', marginTop: '15px', color: '#94A3B8', fontWeight: '500', letterSpacing: '1px' };

const navContainerStyle = { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 };
const navDividerStyle = { color: '#475569', fontSize: '0.7rem', fontWeight: 'bold', margin: '20px 0 10px 10px', letterSpacing: '1px' };

const menuButtonStyle = { 
    backgroundColor: 'transparent', border: 'none', color: '#94A3B8', textAlign: 'left', 
    padding: '14px 18px', cursor: 'pointer', borderRadius: '12px', fontSize: '0.95rem',
    transition: 'all 0.2s', fontWeight: '500'
};

const activeMenuButtonStyle = { ...menuButtonStyle, backgroundColor: '#334155', color: '#38BDF8', fontWeight: '600' };

const searchButtonStyle = { 
    backgroundColor: '#0EA5E9', color: 'white', border: 'none', padding: '16px', 
    borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' 
};

const logoutButtonStyle = { ...menuButtonStyle, marginTop: 'auto', color: '#F87171' };

const mainContentStyle = { flex: 1, padding: '50px 60px', overflowY: 'auto' };
const headerStyle = { marginBottom: '40px' };
const titleStyle = { fontSize: '2rem', color: '#0F172A', fontWeight: '800', margin: 0 };
const subtitleStyle = { color: '#64748B', marginTop: '5px' };

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' };

const offerCardStyle = { 
    backgroundColor: 'white', borderRadius: '20px', padding: '24px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #E2E8F0',
    display: 'flex', flexDirection: 'column', gap: '20px'
};

const cardHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' };
const cardTitleStyle = { fontSize: '1.1rem', margin: 0, color: '#1E293B', fontWeight: '700', flex: 1, paddingRight: '10px' };

const cardBodyStyle = { padding: '15px 0', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' };
const infoRowStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' };
const labelStyle = { color: '#64748B', fontSize: '0.9rem' };
const valueStyle = { fontWeight: '700', color: '#0EA5E9' };
const noteStyle = { fontSize: '0.85rem', color: '#94A3B8', fontStyle: 'italic', margin: '10px 0 0 0' };

const cardFooterStyle = { marginTop: '5px' };
const actionGroupStyle = { display: 'flex', gap: '12px' };

const btnAccettaStyle = { 
    flex: 1, backgroundColor: '#10B981', color: 'white', border: 'none', 
    padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' 
};
const btnRifiutaStyle = { 
    flex: 1, backgroundColor: '#EF4444', color: 'white', border: 'none', 
    padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' 
};

const statusInfoStyle = { fontSize: '0.9rem', color: '#64748B', fontWeight: '500' };

const statusBadgeStyle = (status) => {
    let bg = '#F1F5F9'; let color = '#475569';
    if (status === 'ACCETTATA') { bg = '#DCFCE7'; color = '#166534'; }
    else if (status === 'RIFIUTATA') { bg = '#FEE2E2'; color = '#991B1B'; }
    else if (status === 'CONTROFFERTA') { bg = '#FEF3C7'; color = '#92400E'; }
    else if (status === 'IN_ATTESA') { bg = '#E0F2FE'; color = '#075985'; }
    return { padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', backgroundColor: bg, color: color };
};

const formContainerStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '24px', maxWidth: '500px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '25px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const inputLabelStyle = { fontSize: '0.9rem', fontWeight: '600', color: '#475569' };
const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', outline: 'none', fontSize: '1rem' };
const eyeToggleStyle = { position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '0.7rem', color: '#0EA5E9', fontWeight: 'bold' };
const submitButtonStyle = { backgroundColor: '#0F172A', color: 'white', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', marginTop: '10px' };

const successoStyle = { backgroundColor: '#DCFCE7', color: '#166534', padding: '16px', borderRadius: '12px', marginBottom: '20px', fontWeight: '500' };
const erroreStyle = { backgroundColor: '#FEE2E2', color: '#991B1B', padding: '16px', borderRadius: '12px', marginBottom: '20px', fontWeight: '500' };
const emptyStateStyle = { gridColumn: '1/-1', textAlign: 'center', padding: '100px 0', color: '#64748B' };
const btnSearchSmall = { backgroundColor: '#0EA5E9', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', marginTop: '15px', fontWeight: 'bold' };

export default ClienteDashboard;