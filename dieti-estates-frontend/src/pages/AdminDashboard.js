import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import axios from 'axios';
import Logo from '../components/Logo';
import { fetchAuthSession } from 'aws-amplify/auth';
import { StatCards } from '../components/adminDashboard/StatCards';
import ChangePasswordForm from '../components/ChangePasswordForm';
import { AgencyTable } from '../components/adminDashboard/AgencyTable';
import { UserTable } from '../components/adminDashboard/UserTable';
import { StaffForm } from '../components/adminDashboard/StaffForm';

const AdminDashboard = () => {
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();
    const [view, setView] = useState('overview'); 
    const [agenzie, setAgenzie] = useState([]);
    const [utenti, setUtenti] = useState([]);
    const [formData, setFormData] = useState({
        email: '', nome: '', cognome: '', idAgenzia: '', password: ''
    });

    const [newAgenzia, setNewAgenzia] = useState({ nomeAgenzia: '', partitaIva: '' });
    const [editingAgenzia, setEditingAgenzia] = useState(null);
    const [editingUtente, setEditingUtente] = useState(null);
    
    useEffect(() => {
        const fetchIniziali = async () => {
            await getRole();
            await caricaAgenzie();
            await caricaUtenti();
        };
        fetchIniziali();
    }, []);

    const getRole = async () => {
        try {
            const session = await fetchAuthSession();
            const role = session.tokens.idToken.payload["custom:ruolo"] || 
                        session.tokens.accessToken.payload["cognito:groups"]?.[0]; 
            
            console.log("Ruolo recuperato da sessione:", role);
            setUserRole(role);
        } catch (err) {
            console.error("Errore recupero ruolo", err);
        }
    };

    const caricaAgenzie = () => {
        axios.get("http://localhost:8080/api/agenzia")
            .then(res => setAgenzie(res.data))
            .catch(err => console.error("Errore agenzie", err));
    };

    const caricaUtenti = async () => {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.accessToken?.toString();
            
            const res = await axios.get("http://localhost:8080/api/utente", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(res.data)
            setUtenti(res.data);
        } catch (err) {
            console.error("Errore utenti", err);
            if(err.response?.status === 401) alert("Sessione scaduta o non autorizzata");
        }
    };

    const handleCreateAgenzia = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/agenzia", newAgenzia);
            alert("Agenzia creata!");
            setNewAgenzia({ nomeAgenzia: '', partitaIva: '' });
            caricaAgenzie();
        } catch (err) { alert("Errore creazione agenzia"); }
    };

    const handleUpdateAgenzia = async (e) => {
        e.preventDefault();
        try {
            // Usiamo PUT e passiamo l'ID nell'URL
            await axios.put(`http://localhost:8080/api/agenzia/${editingAgenzia.idAgenzia}`, editingAgenzia);
            
            alert("Agenzia aggiornata!");
            setEditingAgenzia(null);
            caricaAgenzie();
        } catch (err) { 
            console.error(err);
            alert("Errore durante l'aggiornamento"); 
        }
    };

    const handleDeleteAgenzia = async (id) => {
        if (window.confirm("Eliminando l'agenzia eliminerai i vincoli con i gestori. Procedere?")) {
            try {
                await axios.delete(`http://localhost:8080/api/agenzia/${id}`);
                caricaAgenzie();
            } catch (err) { alert("Errore: controlla se ci sono gestori legati a questa agenzia"); }
        }
    };

    const handleUpdateUtente = async (e) => {
        e.preventDefault();
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.accessToken?.toString();
            // Nota: Assicurati che il tuo backend abbia un endpoint PUT o POST per l'aggiornamento utente
            await axios.post(`http://localhost:8080/api/utente`, editingUtente, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Utente aggiornato!");
            setEditingUtente(null);
            caricaUtenti();
        } catch (err) { alert("Errore aggiornamento utente"); }
    };

    const handleDeleteUtente = async (user) => {
        const userId = typeof user === 'string' ? user : (user.idUtente || user.id);

        if (!userId) {
            console.error("Non riesco a trovare l'ID. Chiavi disponibili:", Object.keys(user));
            return;
        }

        if (window.confirm(`Sei sicuro di voler eliminare l'utente?`)) {
            try {
                const session = await fetchAuthSession();
                const token = session.tokens?.accessToken?.toString();

                await axios.delete(`http://localhost:8080/api/utente/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                alert("Utente eliminato con successo dal database");
                caricaUtenti();
            } catch (err) {
                console.error("Errore durante l'eliminazione:", err);
                alert("Errore durante l'eliminazione: " + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    const handleSubmitStaff = async (e, type) => {
        e.preventDefault();
        const endpoint = type === 'gestore' ? '/registra-gestore' : '/registra-supporto';
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.accessToken?.toString();
            await axios.post(`http://localhost:8080/api/amministratore${endpoint}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`${type.toUpperCase()} creato con successo!`);
            setFormData({ email: '', nome: '', cognome: '', idAgenzia: '' });
            setView('overview');
        } catch (err) { alert("Errore: " + (err.response?.data || err.message)); }
    };

    const handleUpdatePassword = async (data) => {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.accessToken?.toString();

            await axios.post(
                "http://localhost:8080/api/utente/update-password", 
                data,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert("Password aggiornata con successo!");
            setView('overview'); // Torna alla dashboard dopo il successo
        } catch (err) {
            alert("Errore: " + (err.response?.data || "Impossibile aggiornare la password"));
        }
    };

    const dashboardStyles = {
        statsGridStyle, 
        statCardStyle, 
        labelStyle, 
        statNumberStyle,
        formCardStyle, 
        formStyle, 
        inputStyle, 
        eyeToggleStyle, 
        submitButtonStyle,
        tableStyle,
        actionBtnEdit,
        actionBtnDelete
    };

    if (!userRole) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Caricamento permessi in corso...</p>
            </div>
        );
    }

    return (
        <div style={adminContainerStyle}>
            <aside style={sidebarStyle}>
                <div style={{textAlign: 'center', marginBottom: '30px'}}>
                    <Logo width="60px" height="60px" />
                    {/* Cambia il titolo dinamicamente in base al ruolo */}
                    <h2 style={{color: '#5DADE2', fontSize: '1.2rem', marginTop: '10px'}}>
                        {userRole === 'Supporto' ? 'Support Panel' : 'Admin Panel'}
                    </h2>
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <button style={view === 'overview' ? activeMenuButtonStyle : menuButtonStyle} onClick={() => setView('overview')}>🏠 Dashboard</button>
                    <button style={view === 'agenzieList' ? activeMenuButtonStyle : menuButtonStyle} onClick={() => setView('agenzieList')}>🏢 Gestione Agenzie</button>
                    <button style={view === 'utentiList' ? activeMenuButtonStyle : menuButtonStyle} onClick={() => setView('utentiList')}>👥 Gestione Utenti</button>
                    
                    {/* MOSTRA SOLO SE NON È SUPPORTO */}
                    {userRole !== 'Supporto' && (
                        <>
                            <button style={view === 'createGestore' ? activeMenuButtonStyle : menuButtonStyle} onClick={() => setView('createGestore')}>👤 Nuovo Gestore</button>
                            <button style={view === 'createSupporto' ? activeMenuButtonStyle : menuButtonStyle} onClick={() => setView('createSupporto')}>🛠️ Nuovo Supporto</button>
                        </>
                    )}
                    
                    <button style={view === 'changePassword' ? activeMenuButtonStyle : menuButtonStyle} onClick={() => setView('changePassword')}>🔑 Password</button>
                    <button style={logoutButtonStyle} onClick={handleLogout}>🚪 Logout</button>
                </div>
            </aside>

            <main style={{ flex: 1, padding: '40px', backgroundColor: '#f4f7f6', overflowY: 'auto' }}>                  
                {/* 1. OVERVIEW */}
                {view === 'overview' && (
                    <div>
                        <h1 style={{ color: '#2C3E50', marginBottom: '30px' }}>Stato del Sistema</h1>
                        <StatCards agenzie={agenzie} utenti={utenti} styles={dashboardStyles} />
                    </div>
                )}

                {/* VISTA AGENZIE */}
                {view === 'agenzieList' && (
                    <div>
                        {/* FORM DI CREAZIONE (Risolve il warning: ora handleCreateAgenzia è usato!) */}
                        {!editingAgenzia && (
                            <div style={{...formCardStyle, maxWidth: '100%', marginBottom: '20px'}}>
                                <h3>➕ Registra Nuova Agenzia</h3>
                                <form onSubmit={handleCreateAgenzia} style={{display: 'flex', gap: '10px'}}>
                                    <input placeholder="Nome Agenzia" style={inputStyle} value={newAgenzia.nomeAgenzia} onChange={e => setNewAgenzia({...newAgenzia, nomeAgenzia: e.target.value})} required />
                                    <input placeholder="Partita IVA" style={inputStyle} value={newAgenzia.partitaIva} onChange={e => setNewAgenzia({...newAgenzia, partitaIva: e.target.value})} required />
                                    <button type="submit" style={{...submitButtonStyle, marginTop: 0}}>Salva</button>
                                </form>
                            </div>
                        )}

                        {/* FORM DI MODIFICA (Appare solo se clicchi sulla matita) */}
                        {editingAgenzia && (
                            <div style={{...formCardStyle, maxWidth: '100%', marginBottom: '20px', border: '2px solid #F1C40F'}}>
                                <h3>✏️ Modifica Agenzia: {editingAgenzia.nomeAgenzia}</h3>
                                <form onSubmit={handleUpdateAgenzia} style={{display: 'flex', gap: '10px'}}>
                                    <input style={inputStyle} value={editingAgenzia.nomeAgenzia} onChange={e => setEditingAgenzia({...editingAgenzia, nomeAgenzia: e.target.value})} />
                                    <input style={inputStyle} value={editingAgenzia.partitaIva} onChange={e => setEditingAgenzia({...editingAgenzia, partitaIva: e.target.value})} />
                                    <button type="submit" style={submitButtonStyle}>Aggiorna</button>
                                    <button type="button" onClick={() => setEditingAgenzia(null)} style={{...actionBtnDelete, backgroundColor: '#95A5A6'}}>Annulla</button>
                                </form>
                            </div>
                        )}

                        <AgencyTable 
                            agenzie={agenzie} 
                            onEdit={setEditingAgenzia} 
                            onDelete={handleDeleteAgenzia} 
                            styles={dashboardStyles} 
                        />
                    </div>
                )}

                {/* VISTA UTENTI */}
                {view === 'utentiList' && (
                    <div style={{...formCardStyle, maxWidth: '100%'}}>
                        <h2>Gestione Utenti</h2>
                        
                        {/* Form Modifica Utente Rapida */}
                        {editingUtente && (
                            <div style={{marginBottom: '20px', padding: '15px', border: '1px solid #F1C40F', borderRadius: '8px'}}>
                                <h4>Modifica {editingUtente.email}</h4>
                                <form onSubmit={handleUpdateUtente} style={{display: 'flex', gap: '10px'}}>
                                    <input style={inputStyle} value={editingUtente.nome} onChange={e => setEditingUtente({...editingUtente, nome: e.target.value})} />
                                    <input style={inputStyle} value={editingUtente.cognome} onChange={e => setEditingUtente({...editingUtente, cognome: e.target.value})} />
                                    <button type="submit" style={submitButtonStyle}>Salva</button>
                                    <button type="button" onClick={() => setEditingUtente(null)} style={actionBtnDelete}>X</button>
                                </form>
                            </div>
                        )}

                        <UserTable 
                            utenti={utenti} 
                            onEdit={setEditingUtente} 
                            onDelete={handleDeleteUtente} 
                            styles={dashboardStyles} 
                            currentUserRole={userRole}
                        />
                    </div>
                )}

                {/* 4. CAMBIO PASSWORD */}
                {view === 'changePassword' && (
                    <ChangePasswordForm 
                        styles={dashboardStyles} 
                        onUpdate={(data) => handleUpdatePassword(data)} 
                    />
                )}

                {/* CREAZIONE (GESTORE E SUPPORTO) */}
                {(view === 'createGestore' || view === 'createSupporto') && (
                    userRole === 'Supporto' ? (
                        <div style={{textAlign: 'center'}}>🚫 Non hai i permessi per questa sezione.</div>
                    ) : (
                        <StaffForm 
                            type={view === 'createGestore' ? 'gestore' : 'supporto'}
                            formData={formData}
                            setFormData={setFormData}
                            agenzie={agenzie}
                            onSubmit={handleSubmitStaff}
                            styles={dashboardStyles}
                        />
                    )
                )}
            </main>
        </div>
    );
};

// --- STILI DASHBOARD ---
const eyeToggleStyle = {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#3498DB',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    padding: '5px'
};
const actionBtnEdit = { 
    backgroundColor: '#F1C40F', 
    color: 'white', 
    border: 'none', 
    padding: '8px 12px', 
    borderRadius: '6px', 
    cursor: 'pointer', 
    fontSize: '0.85rem',
    marginRight: '8px'
};

const labelStyle = {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: '#95A5A6',
    letterSpacing: '1px',
    display: 'block',
    marginBottom: '10px'
};

const statNumberStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0',
    color: '#2C3E50'
};

const statCardStyle = { 
    backgroundColor: 'white', 
    padding: '20px', 
    borderRadius: '8px', 
    textAlign: 'left', // Cambiato in left per un look più professionale
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
};

const statsGridStyle = { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
    gap: '20px', 
    marginTop: '20px' 
};
const adminContainerStyle = { display: 'flex', height: '100vh', fontFamily: 'Segoe UI, sans-serif' };
const sidebarStyle = { width: '260px', backgroundColor: '#2C3E50', color: 'white', display: 'flex', flexDirection: 'column', padding: '20px' };
const formCardStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', width: '100%', boxSizing: 'border-box' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '10px' };
const actionBtnDelete = { backgroundColor: '#E74C3C', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' };
const menuButtonStyle = { backgroundColor: 'transparent', border: 'none', color: '#BDC3C7', textAlign: 'left', padding: '12px', cursor: 'pointer', fontSize: '0.95rem', borderRadius: '8px', width: '100%' };
const activeMenuButtonStyle = { ...menuButtonStyle, backgroundColor: '#34495E', color: 'white', fontWeight: 'bold' };
const logoutButtonStyle = { ...menuButtonStyle, marginTop: 'auto', color: '#E74C3C' };
const submitButtonStyle = { padding: '12px 20px', backgroundColor: '#27AE60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' };
export default AdminDashboard;