import React from 'react';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';

const AgenteDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error("Errore durante il logout:", error);
        }
    };

    const cards = [
        { title: "Dettaglio Immobile", icon: "🏠📝", path: "/immobili" },
        { title: "OFFERTE - Visualizza storico", icon: "📋👁️", path: "/storico" },
        { title: "Inserisci nuovo immobile", icon: "🏠➕", path: "/nuovo-immobile" },
        { title: "Modifica password", icon: "🔒✏️", path: "/cambio-password" },
        { title: "OFFERTE - Gestisci Offerte", icon: "📋🖊️", path: "/gestione-offerte" },
        { title: "Inserisci Offerta manualmente", icon: "⌨️", path: "/offerta-manuale" }
    ];

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <Logo width="80px" height="80px" />
                <h2 style={{ margin: 0 }}>AGENTE IMMOBILIARE</h2>
                {/* Cliccando sull'omino fai il logout */}
                <div 
                    onClick={handleLogout} 
                    style={{ ...userIconStyle, cursor: 'pointer' }} 
                    title="Logout"
                >
                    👤
                </div>
            </header>

            <div style={gridStyle}>
                {cards.map((card, index) => (
                    <div 
                        key={index} 
                        style={cardStyle}
                        onClick={() => navigate(card.path)}
                    >
                        <div style={{ fontSize: '40px' }}>{card.icon}</div>
                        <p style={{ fontWeight: 'bold', textAlign: 'center' }}>{card.title}</p>
                    </div>
                ))}
            </div>
            
            <footer style={footerStyle}>
                <p>assistenza@dietiestates.it | +39 3927309033</p>
            </footer>
        </div>
    );
};

// ... i tuoi stili rimangono identici ...
const containerStyle = { display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#e0e0e0' };
const headerStyle = { backgroundColor: '#5DADE2', padding: '10px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '40px', flex: 1 };
const cardStyle = { backgroundColor: 'white', border: '2px solid #2C3E50', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', cursor: 'pointer', transition: 'transform 0.2s' };
const footerStyle = { backgroundColor: '#2C3E50', color: 'white', padding: '20px', textAlign: 'center' };
const userIconStyle = { fontSize: '30px', border: '2px solid white', borderRadius: '50%', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' };

export default AgenteDashboard;