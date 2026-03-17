import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword } from 'aws-amplify/auth';

import Logo from '../components/Logo';
import ChangePasswordForm from '../components/ChangePasswordForm';
import ListaAgenti from '../components/gestore/ListaAgenti';
import NuovoAgenteForm from '../components/gestore/NuovoAgenteForm';
import ListaImmobili from '../components/ListaImmobili';
import ImmobileForm from '../components/ImmobileForm';
import { useAuth } from '../context/useAuth';

const GestoreDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [view, setView] = useState('menu');
    
    const [selectedAgente, setSelectedAgente] = useState(null);
    const [selectedAgenteId, setSelectedAgenteId] = useState(null);

    const handleLogout = async () => {
        try {
            await logout(); 
            navigate('/login');
        } catch (error) { 
            console.error("Logout error:", error); 
        }
    };

    const handleEditAgente = (agente) => {
        setSelectedAgente(agente);
        setView('modificaAgente');
    };

    const handleEliminaAgente = (id) => {
        setSelectedAgenteId(id);
        setView('confermaElimina');
    };

    const handlePasswordUpdate = async (pwData) => {
        try {
            await updatePassword({
                oldPassword: pwData.vecchiaPassword,
                newPassword: pwData.nuovaPassword
            });

            alert("Password aggiornata con successo!");
            setView('menu');
        } catch (err) {
            console.error("Errore durante il cambio password:", err);
            
            if (err.name === 'NotAuthorizedException') {
                alert("La vecchia password non è corretta.");
            } else if (err.name === 'LimitExceededException') {
                alert("Troppi tentativi. Riprova più tardi.");
            } else {
                alert("Errore: " + err.message);
            }
            
            throw err;
        }
    };

    const menuCards = [
        { id: "listaAgenti", title: "Visualizza Agenti", icon: "👥", desc: "Gestisci i tuoi collaboratori" },
        { id: "nuovoAgente", title: "Nuovo Agente", icon: "👤➕", desc: "Registra un nuovo membro" },
        { id: "immobiliAgenzia", title: "Immobili Agenzia", icon: "🏠", desc: "Catalogo completo immobili" },
        { id: "nuovoImmobile", title: "Carica Immobile", icon: "➕🏠", desc: "Pubblica un nuovo annuncio" },
        { id: "password", title: "Sicurezza", icon: "🔒", desc: "Cambia la tua password" }
    ];

    const renderView = () => {
        switch (view) {
            case 'nuovoAgente':
                return <NuovoAgenteForm onSave={() => setView('listaAgenti')} styles={dashboardStyles} />;
            
            case 'listaAgenti':
                return <ListaAgenti 
                    styles={dashboardStyles}
                    onEdit={handleEditAgente} 
                    onElimina={handleEliminaAgente}
                />;
            
            case 'immobiliAgenzia':
                return (
                    <ListaImmobili 
                        apiUrl="http://localhost:8080/api/gestore/immobili-agenzia" 
                        styles={dashboardStyles} 
                    />
                );

            case 'nuovoImmobile':
                return (
                    <ImmobileForm 
                        isGestore={true} 
                        onSave={() => setView('immobiliAgenzia')} 
                        styles={dashboardStyles} 
                    />
                );

            case 'password':
                return (
                    <div style={formWrapperStyle}>
                        <ChangePasswordForm styles={dashboardStyles} onUpdate={handlePasswordUpdate} />
                    </div>
                );

            default:
                return (
                    <div style={gridStyle}>
                        {menuCards.map((card) => (
                            <div key={card.id} style={cardStyle} onClick={() => setView(card.id)}>
                                <div style={iconWrapperStyle}>{card.icon}</div>
                                <h4 style={cardTitleStyle}>{card.title}</h4>
                                <p style={cardDescStyle}>{card.desc}</p>
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <div style={containerStyle}>
            {/* Header */}
            <header style={headerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Logo width="45px" height="45px" />
                    <div style={dividerStyle} />
                    <h2 style={brandTitleStyle}>Gestore<span style={{fontWeight: '400'}}>Dashboard</span></h2>
                </div>
                
                <div style={headerActionsStyle}>
                    <div style={userBadgeStyle}>
                        <span style={onlineIndicator} />
                        Amministratore Agenzia
                    </div>
                    <button onClick={handleLogout} style={logoutBtnStyle} title="Logout">
                        🚪 Esci
                    </button>
                </div>
            </header>

            {/* Area Contenuto */}
            <main style={mainContentStyle}>
                {view !== 'menu' && (
                    <button onClick={() => setView('menu')} style={backButtonStyle}>
                        ← Torna al Pannello Principale
                    </button>
                )}
                
                <div style={viewContainerStyle}>
                    {renderView()}
                </div>
            </main>

            <footer style={footerStyle}>
                <p>© 2024 DietiEstates Professional • Supporto: <a href="mailto:assistenza@dietiestates.it" style={{color: '#3498DB'}}>assistenza@dietiestates.it</a></p>
            </footer>
        </div>
    );
};


const dashboardStyles = {
    formCardStyle: { 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '20px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '900px', 
        margin: '0 auto' 
    },
    formStyle: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputStyle: { 
        width: '100%', 
        padding: '12px', 
        borderRadius: '10px', 
        border: '1px solid #E2E8F0',
        fontSize: '14px'
    },
    submitButtonStyle: { 
        width: '100%', 
        padding: '14px', 
        backgroundColor: '#0EA5E9', 
        color: 'white', 
        border: 'none', 
        borderRadius: '10px', 
        fontWeight: 'bold', 
        cursor: 'pointer' 
    },
    tableHeaderStyle: { padding: '12px', color: '#64748B', fontWeight: '600', textAlign: 'left' },
    tableCellStyle: { padding: '12px', borderBottom: '1px solid #F1F5F9' }
};
const containerStyle = { 
    display: 'flex', 
    flexDirection: 'column', 
    minHeight: '100vh', 
    backgroundColor: '#F8FAFC',
    fontFamily: "'Inter', sans-serif"
};

const headerStyle = { 
    backgroundColor: '#FFFFFF', 
    padding: '0 40px', 
    height: '80px',
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    zIndex: 10
};

const brandTitleStyle = { margin: 0, fontSize: '1.2rem', color: '#1E293B', letterSpacing: '-0.5px' };
const dividerStyle = { width: '1px', height: '30px', backgroundColor: '#E2E8F0' };

const headerActionsStyle = { display: 'flex', alignItems: 'center', gap: '20px' };
const userBadgeStyle = { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    fontSize: '0.85rem', 
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: '500'
};

const onlineIndicator = { width: '8px', height: '8px', backgroundColor: '#22C55E', borderRadius: '50%' };

const logoutBtnStyle = {
    backgroundColor: 'transparent',
    border: '1px solid #E2E8F0',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#64748B',
    fontWeight: '600',
    transition: 'all 0.2s'
};

const mainContentStyle = { flex: 1, padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%' };
const viewContainerStyle = { animation: 'fadeIn 0.4s ease-out' };

const gridStyle = { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
    gap: '25px' 
};

const cardStyle = { 
    backgroundColor: 'white', 
    padding: '30px', 
    borderRadius: '20px', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    border: '1px solid #F1F5F9'
};

const iconWrapperStyle = { 
    fontSize: '32px', 
    marginBottom: '15px',
    backgroundColor: '#F0F9FF',
    width: '70px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '18px',
    color: '#0EA5E9'
};

const cardTitleStyle = { margin: '0 0 8px 0', color: '#1E293B', fontSize: '1.1rem' };
const cardDescStyle = { margin: 0, color: '#94A3B8', fontSize: '0.85rem', lineHeight: '1.4' };

const backButtonStyle = { 
    padding: '10px 0', 
    marginBottom: '25px', 
    backgroundColor: 'transparent', 
    color: '#64748B', 
    border: 'none', 
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center'
};

const formWrapperStyle = { maxWidth: '600px', margin: '0 auto' };

const footerStyle = { padding: '20px', textAlign: 'center', fontSize: '0.8rem', color: '#94A3B8', borderTop: '1px solid #E2E8F0' };

export default GestoreDashboard;