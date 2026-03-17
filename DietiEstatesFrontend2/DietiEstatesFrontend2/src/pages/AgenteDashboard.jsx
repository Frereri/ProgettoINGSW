import React, { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import { signOut, fetchAuthSession } from 'aws-amplify/auth';

import ImmobileForm from '../components/ImmobileForm';
import ChangePasswordForm from '../components/ChangePasswordForm';
import OfferteTabellaAgente from '../components/agente/OfferteTabellaAgente'; 
import StoricoOffertaDettaglio from '../components/agente/StoricoOffertaDettaglio';
import ImmobiliLista from '../components/ListaImmobili';
import OffertaManualeForm from '../components/agente/OffertaManualeForm';

const AgenteDashboard = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('menu');
    const [selectedOffertaId, setSelectedOffertaId] = useState(null);
    const [idAgente, setIdAgente] = useState(null);

    useEffect(() => {
        const getUserId = async () => {
            try {
                const session = await fetchAuthSession();
                const sub = session.tokens.idToken.payload.sub;
                setIdAgente(sub);
            } catch (error) {
                console.error("Errore recupero sessione:", error);
            }
        };
        getUserId();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut({ global: true });
            localStorage.clear(); 
            sessionStorage.clear();
            
            navigate('/login', { replace: true });
            window.location.reload();
        } catch (error) { 
            console.error("Errore durante il logout:", error); 
        }
    };

    const cards = [
        { title: "I miei immobili", icon: "🏠", view: "listaImmobili", desc: "Gestisci i tuoi annunci" },
        { title: "Inserisci immobile", icon: "➕", view: "nuovoImmobile", desc: "Pubblica un nuovo annuncio" },
        { title: "Gestisci Offerte", icon: "📩", view: "gestioneOfferte", desc: "Accetta o rifiuta proposte" },
        { title: "Storico Offerte", icon: "📜", view: "storico", desc: "Consulta i log passati" },
        { title: "Offerta manuale", icon: "⌨️", view: "offertaManuale", desc: "Inserisci offerta cartacea" },
        { title: "Sicurezza", icon: "🔒", view: "password", desc: "Cambia la tua password" }
    ];

    return (
        <div style={containerStyle}>
            {/* Header */}
            <header style={headerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Logo width="45px" height="45px" />
                    <h2 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '1px' }}>DASHBOARD AGENTE</h2>
                </div>
                <button onClick={handleLogout} style={logoutButtonStyle}>
                    Esci <span>🚪</span>
                </button>
            </header>
            
            <main style={{ flex: 1, padding: '40px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    
                    {/* Pulsante Indietro */}
                    {view !== 'menu' && (
                        <button onClick={() => {
                            if (view === 'dettaglioLog') setView('storico');
                            else setView('menu');
                        }} style={backButtonStyle}>
                            ← Torna al menu principale
                        </button>
                    )}

                    {/* Vista Menu*/}
                    {view === 'menu' && (
                        <div style={gridStyle}>
                            {cards.map((card, index) => (
                                <div key={index} style={cardStyle} onClick={() => setView(card.view)}>
                                    <div style={iconWrapperStyle}>{card.icon}</div>
                                    <div style={{ textAlign: 'center' }}>
                                        <h3 style={{ margin: '10px 0 5px 0', color: '#1E293B' }}>{card.title}</h3>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>{card.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Vista I Miei Immobili */}
                    {view === 'listaImmobili' && (
                        <ImmobiliLista 
                            styles={dashboardFormStyles} 
                            apiUrl={`http://localhost:8080/api/immobile/mio-organico/${idAgente}`} 
                        />
                    )}

                    {/* Vista Nuovo Immobile */}
                    {view === 'nuovoImmobile' && (
                        <ImmobileForm 
                            onSave={() => setView('listaImmobili')} 
                            styles={dashboardFormStyles} 
                            isGestore={false}
                        />
                    )}

                    {/* Altre viste */}
                    {view === 'offertaManuale' && <OffertaManualeForm styles={dashboardFormStyles} />}
                    {view === 'password' && <ChangePasswordForm styles={dashboardFormStyles} />}
                    {view === 'gestioneOfferte' && <OfferteTabellaAgente modo="gestione" onSeeLog={(id) => { setSelectedOffertaId(id); setView('dettaglioLog'); }} />}
                    {view === 'storico' && <OfferteTabellaAgente modo="storico" onSeeLog={(id) => { setSelectedOffertaId(id); setView('dettaglioLog'); }} />}
                    {view === 'dettaglioLog' && <StoricoOffertaDettaglio idOfferta={selectedOffertaId} />}
                </div>
            </main>

            <footer style={footerStyle}>
                <p>© 2024 DietiEstates | Supporto: assistenza@dietiestates.it</p>
            </footer>
        </div>
    );
};

// --- STILI ---

const containerStyle = { 
    display: 'flex', 
    flexDirection: 'column', 
    minHeight: '100vh', 
    backgroundColor: '#F8FAFC',
    fontFamily: "'Inter', sans-serif"
};

const headerStyle = { 
    backgroundColor: '#0F172A',
    padding: '15px 40px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    color: 'white',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
};

const logoutButtonStyle = {
    backgroundColor: 'transparent',
    color: '#94A3B8',
    border: '1px solid #334155',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
};

const gridStyle = { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
    gap: '25px' 
};

const cardStyle = { 
    backgroundColor: 'white', 
    padding: '30px', 
    borderRadius: '20px', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    cursor: 'pointer',
    transition: 'transform 0.2s, boxShadow 0.2s',
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
    border: '1px solid #E2E8F0'
};

const iconWrapperStyle = {
    fontSize: '2.5rem',
    backgroundColor: '#F1F5F9',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    marginBottom: '15px'
};

const backButtonStyle = { 
    padding: '10px 0', 
    marginBottom: '30px', 
    backgroundColor: 'transparent', 
    color: '#64748B', 
    border: 'none', 
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem'
};

const footerStyle = { 
    padding: '20px', 
    textAlign: 'center', 
    color: '#64748B', 
    fontSize: '0.9rem',
    borderTop: '1px solid #E2E8F0'
};

const dashboardFormStyles = {
    formCardStyle: { 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '24px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
        maxWidth: '800px', 
        margin: '0 auto' 
    },
    formStyle: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputStyle: { 
        padding: '12px 16px', 
        borderRadius: '12px', 
        border: '1px solid #E2E8F0', 
        backgroundColor: '#F8FAFC',
        color: '#1E293B',       
        fontSize: '1rem',
        width: '100%',
        appearance: 'none',
    },
    submitButtonStyle: { 
        padding: '16px', 
        backgroundColor: '#0F172A', 
        color: 'white', 
        border: 'none', 
        borderRadius: '12px', 
        cursor: 'pointer', 
        fontWeight: 'bold',
        fontSize: '1rem',
        marginTop: '10px'
    }
};

export default AgenteDashboard;