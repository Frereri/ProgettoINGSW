import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';

import Logo from '../components/Logo';
import ChangePasswordForm from '../components/ChangePasswordForm';
import StatCards from '../components/admin/StatCards';
import TabellaAgenzie from '../components/admin/TabellaAgenzie';
import TabellaUtenti from '../components/admin/TabellaUtenti';
import StaffForm from '../components/admin/StaffForm';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState('');
    const [view, setView] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agenzie, setAgenzie] = useState([]);
    const [utenti, setUtenti] = useState([]);
    const [formData, setFormData] = useState({
        email: '', nome: '', cognome: '', idAgenzia: '', password: ''
    });

    const [editingAgenzia, setEditingAgenzia] = useState(null);
    const [editingUtente, setEditingUtente] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.accessToken?.toString();
            const role = session.tokens.idToken.payload["custom:ruolo"] || 
                         session.tokens.accessToken.payload["cognito:groups"]?.[0];
            
            setUserRole(role);

            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [resAgenzie, resUtenti] = await Promise.all([
                axios.get("http://localhost:8080/api/agenzia"),
                axios.get("http://localhost:8080/api/utente", config)
            ]);

            setAgenzie(resAgenzie.data);
            setUtenti(resUtenti.data);
        } catch (err) {
            console.error("Errore nel caricamento dati:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSaveAgenzia = async (e) => {
        e.preventDefault();
        const isEdit = !!editingAgenzia?.idAgenzia;
        const url = isEdit 
            ? `http://localhost:8080/api/agenzia/${editingAgenzia.idAgenzia}` 
            : "http://localhost:8080/api/agenzia";
        
        try {
            if (isEdit) await axios.put(url, editingAgenzia);
            else await axios.post(url, editingAgenzia);
            
            alert(isEdit ? "Agenzia aggiornata!" : "Agenzia creata!");
            setEditingAgenzia(null);
            fetchData();
        } catch (err) { alert("Errore nel salvataggio agenzia"); }
    };

    const handleDeleteAgenzia = async (id) => {
        if (!window.confirm("Eliminando l'agenzia eliminerai i vincoli con i gestori. Procedere?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/agenzia/${id}`);
            fetchData();
        } catch (err) { alert("Errore: controlla se ci sono gestori legati a questa agenzia"); }
    };

    const handleUpdateUtente = async (e) => {
        e.preventDefault();
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.accessToken?.toString();
            await axios.post(`http://localhost:8080/api/utente`, editingUtente, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Utente aggiornato!");
            setEditingUtente(null);
            fetchData();
        } catch (err) { alert("Errore aggiornamento utente"); }
    };

    const handleDeleteUtente = async (user) => {
        const userId = user.idUtente || user.id;
        if (!window.confirm(`Sei sicuro di voler eliminare l'utente?`)) return;
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.accessToken?.toString();
            await axios.delete(`http://localhost:8080/api/utente/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Utente eliminato");
            fetchData();
        } catch (err) { alert("Errore durante l'eliminazione"); }
    };

    const handleSubmitStaff = async (e, type) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const endpoint = type === 'gestore' ? '/registra-gestore' : '/registra-supporto';
        const payload = {
            ...formData,
            ruolo: type === 'gestore' ? 'GESTORE' : 'SUPPORTO_AMMINISTRATORE'
        };

        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.accessToken?.toString();
            
            await axios.post(`http://localhost:8080/api/amministratore${endpoint}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert(`${type.toUpperCase()} creato con successo!`);
            setFormData({ email: '', nome: '', cognome: '', idAgenzia: '', password: '' });
            setView('overview');
            fetchData();
        } catch (err) {
            const errorMessage = err.response?.data;
            if (errorMessage && errorMessage.includes("UsernameExistsException")) {
                alert("Errore: Un utente con questa email è già registrato.");
            } else {
                alert("Errore: " + (errorMessage || err.message));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    if (loading) return <div style={loadingContainerStyle}>Caricamento in corso...</div>;

    return (
        <div style={adminContainerStyle}>
            {/* SIDEBAR NAV */}
            <aside style={sidebarStyle}>
                <div style={sidebarHeaderStyle}>
                    <Logo width="50px" height="50px" />
                    <div style={{ marginTop: '10px' }}>
                        <span style={roleBadgeStyle}>
                            {userRole === 'Supporto' ? 'SUPPORT PANEL' : 'ADMIN PANEL'}
                        </span>
                    </div>
                </div>
                
                <nav style={navContainerStyle}>
                    <MenuButton active={view === 'overview'} onClick={() => setView('overview')} icon="🏠">Dashboard</MenuButton>
                    <MenuButton active={view === 'agenzieList'} onClick={() => setView('agenzieList')} icon="🏢">Agenzie</MenuButton>
                    <MenuButton active={view === 'utentiList'} onClick={() => setView('utentiList')} icon="👥">Utenti</MenuButton>
                    
                    {userRole !== 'Supporto' && (
                        <>
                            <div style={navDividerStyle}>Registrazioni</div>
                            <MenuButton active={view === 'createGestore'} onClick={() => setView('createGestore')} icon="👤">Nuovo Gestore</MenuButton>
                            <MenuButton active={view === 'createSupporto'} onClick={() => setView('createSupporto')} icon="🛠️">Nuovo Supporto</MenuButton>
                        </>
                    )}
                    
                    <div style={navDividerStyle}>Account</div>
                    <MenuButton active={view === 'changePassword'} onClick={() => setView('changePassword')} icon="🔑">Sicurezza</MenuButton>
                    <button style={logoutButtonStyle} onClick={handleLogout}>🚪 Esci</button>
                </nav>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main style={mainContentStyle}>
                <div style={contentWrapperStyle}>
                    {view === 'overview' && (
                        <>
                            <header style={contentHeaderStyle}>
                                <h1 style={{ color: '#0F172A', fontSize: '2.2rem', fontWeight: '800', marginBottom: '10px' }}>
                                    Bentornato
                                </h1>
                                <p>Ecco una panoramica del tuo sistema oggi.</p>
                            </header>
                            <StatCards agenzie={agenzie} utenti={utenti} styles={dashboardFormStyles} />
                        </>
                    )}

                    {view === 'agenzieList' && (
                        <div style={viewContainerStyle}>
                            <h2 style={viewTitleStyle}>Gestione Agenzie</h2>
                            {/* Form Dinamico: Crea o Modifica */}
                            <div style={dashboardFormStyles.formCardStyle}>
                                <h3>{editingAgenzia ? '✏️ Modifica' : '➕ Registra'} Agenzia</h3>
                                <form onSubmit={handleSaveAgenzia} style={horizontalFormStyle}>
                                    <input 
                                        placeholder="Nome Agenzia" 
                                        style={dashboardFormStyles.inputStyle} 
                                        value={editingAgenzia?.nomeAgenzia || ''} 
                                        onChange={e => setEditingAgenzia({...editingAgenzia, nomeAgenzia: e.target.value})} 
                                        required 
                                    />
                                    <input 
                                        placeholder="Partita IVA" 
                                        style={dashboardFormStyles.inputStyle} 
                                        value={editingAgenzia?.partitaIva || ''} 
                                        onChange={e => setEditingAgenzia({...editingAgenzia, partitaIva: e.target.value})} 
                                        required 
                                    />
                                    <button type="submit" style={dashboardFormStyles.submitButtonStyle}>
                                        {editingAgenzia ? 'Aggiorna' : 'Salva'}
                                    </button>
                                    {editingAgenzia && (
                                        <button type="button" onClick={() => setEditingAgenzia(null)} style={cancelButtonStyle}>Annulla</button>
                                    )}
                                </form>
                            </div>
                            <TabellaAgenzie 
                                agenzie={agenzie} 
                                onEdit={setEditingAgenzia} 
                                onDelete={handleDeleteAgenzia} 
                                styles={dashboardFormStyles} 
                            />
                        </div>
                    )}

                    {view === 'utentiList' && (
                        <div style={viewContainerStyle}>
                            <h2 style={viewTitleStyle}>Gestione Utenti</h2>
                            {editingUtente && (
                                <div style={editPopupStyle}>
                                    <h4>Modifica Profilo: {editingUtente.email}</h4>
                                    <form onSubmit={handleUpdateUtente} style={horizontalFormStyle}>
                                        <input style={dashboardFormStyles.inputStyle} value={editingUtente.nome} onChange={e => setEditingUtente({...editingUtente, nome: e.target.value})} />
                                        <input style={dashboardFormStyles.inputStyle} value={editingUtente.cognome} onChange={e => setEditingUtente({...editingUtente, cognome: e.target.value})} />
                                        <button type="submit" style={dashboardFormStyles.submitButtonStyle}>Salva</button>
                                        <button type="button" onClick={() => setEditingUtente(null)} style={cancelButtonStyle}>Chiudi</button>
                                    </form>
                                </div>
                            )}
                            <TabellaUtenti 
                                utenti={utenti} 
                                onEdit={setEditingUtente} 
                                onDelete={handleDeleteUtente} 
                                styles={dashboardFormStyles} 
                                currentUserRole={userRole}
                            />
                        </div>
                    )}

                    {view === 'changePassword' && (
                        <div style={centerFormWrapper}>
                            <ChangePasswordForm styles={dashboardFormStyles} onUpdate={(data) => setView('overview')} />
                        </div>
                    )}

                    {view.includes('create') && (
                        <StaffForm 
                            type={view === 'createGestore' ? 'gestore' : 'supporto'}
                            formData={formData}
                            setFormData={setFormData}
                            agenzie={agenzie}
                            onSubmit={handleSubmitStaff}
                            styles={dashboardFormStyles}
                            loading={isSubmitting}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

const MenuButton = ({ children, active, onClick, icon }) => (
    <button onClick={onClick} style={active ? activeMenuButtonStyle : menuButtonStyle}>
        <span style={{ marginRight: '10px' }}>{icon}</span>
        {children}
    </button>
);

// --- STILI ---
const adminContainerStyle = { display: 'flex', height: '100vh', backgroundColor: '#F8FAFC', color: '#1E293B' };

const sidebarStyle = { 
    width: '280px', 
    backgroundColor: '#0F172A', 
    color: 'white', 
    display: 'flex', 
    flexDirection: 'column', 
    padding: '30px 20px',
    boxShadow: '4px 0 10px rgba(0,0,0,0.05)'
};

const sidebarHeaderStyle = { textAlign: 'center', marginBottom: '40px', borderBottom: '1px solid #1E293B', paddingBottom: '20px' };
const sidebarTitleStyle = { fontSize: '1.1rem', fontWeight: '800', letterSpacing: '1px', margin: '10px 0 5px 0' };
const roleBadgeStyle = { fontSize: '0.65rem', backgroundColor: '#38BDF8', color: '#0F172A', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' };

const navContainerStyle = { display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 };
const navDividerStyle = { fontSize: '0.7rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', margin: '20px 0 10px 10px', letterSpacing: '1px' };

const menuButtonStyle = { 
    backgroundColor: 'transparent', border: 'none', color: '#94A3B8', textAlign: 'left', 
    padding: '12px 15px', cursor: 'pointer', fontSize: '0.95rem', borderRadius: '12px', 
    transition: 'all 0.2s', display: 'flex', alignItems: 'center' 
};
const activeMenuButtonStyle = { ...menuButtonStyle, backgroundColor: '#1E293B', color: '#38BDF8', fontWeight: '700' };
const logoutButtonStyle = { ...menuButtonStyle, marginTop: 'auto', color: '#F87171' };

const mainContentStyle = { flex: 1, overflowY: 'auto', position: 'relative' };
const contentWrapperStyle = { padding: '40px', maxWidth: '1200px', margin: '0 auto' };
const contentHeaderStyle = { marginBottom: '40px' };
const viewContainerStyle = { display: 'flex', flexDirection: 'column', gap: '25px' };
const viewTitleStyle = { fontSize: '1.8rem', fontWeight: '800', color: '#0F172A' };

const horizontalFormStyle = { display: 'flex', gap: '15px', alignItems: 'center', marginTop: '15px' };
const cancelButtonStyle = { backgroundColor: '#94A3B8', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer' };
const editPopupStyle = { backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', padding: '20px', borderRadius: '12px', marginBottom: '20px' };
const centerFormWrapper = { display: 'flex', justifyContent: 'center', paddingTop: '20px' };
const loadingContainerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: '#64748B' };

const dashboardFormStyles = {
    formCardStyle: { backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E2E8F0' },
    inputStyle: { padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#1E293B', fontSize: '0.95rem', width: '100%' },
    submitButtonStyle: { padding: '12px 24px', backgroundColor: '#0EA5E9', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', transition: 'background 0.2s' },
    formStyle: { display: 'flex', flexDirection: 'column', gap: '20px' }
};

export default AdminDashboard;