import React, { useState, useEffect } from 'react';
import Logo from '../components/Logo'; // Usato ora!
import { useNavigate } from 'react-router-dom';
import { signOut, fetchAuthSession } from 'aws-amplify/auth';

import { PropertyForm } from '../components/PropertyForm';
import ChangePasswordForm from '../components/ChangePasswordForm';
import OfferteTabellaAgente from '../components/agenteDashboard/OfferteTabellaAgente'; 
import StoricoOffertaDettaglio from '../components/agenteDashboard/StoricoOffertaDettaglio';
import ImmobiliLista from '../components/ImmobiliLista';
import OffertaManualeForm from '../components/agenteDashboard/OffertaManualeForm';

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

    const handleSeeLog = (id) => {
        setSelectedOffertaId(id);
        setView('dettaglioLog');
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) { console.error(error); }
    };

    const handleSaveProperty = () => {
        alert("Operazione completata con successo!");
        setView('menu'); // Torna al menu principale
        // Qui potresti aggiungere una logica per rinfrescare ImmobiliLista se necessario
    };

    const cards = [
        { title: "I miei immobili", icon: "🏠📝", view: "listaImmobili" },
        { title: "OFFERTE - Storico", icon: "📋👁️", view: "storico" },
        { title: "Inserisci immobile", icon: "🏠➕", view: "nuovoImmobile" },
        { title: "Modifica password", icon: "🔒✏️", view: "password" },
        { title: "Gestisci Offerte", icon: "📋🖊️", view: "gestioneOfferte" },
        { title: "Offerta manuale", icon: "⌨️", view: "offertaManuale" }
    ];

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <Logo width="60px" height="60px" />
                <h2 style={{ margin: 0 }}>AREA AGENTE</h2>
                <div onClick={handleLogout} style={{ ...userIconStyle, cursor: 'pointer' }}>👤</div>
            </header>
            
            <main style={{ flex: 1, padding: '20px' }}>
                {view !== 'menu' && (
                    <button onClick={() => {
                        if (view === 'dettaglioLog') setView('storico');
                        else setView('menu');
                    }} style={backButtonStyle}>⬅ Indietro</button>
                )}

                {view === 'menu' && (
                    <div style={gridStyle}>
                        {cards.map((card, index) => (
                            <div key={index} style={cardStyle} onClick={() => setView(card.view)}>
                                <div style={{ fontSize: '40px' }}>{card.icon}</div>
                                <p style={{ fontWeight: 'bold' }}>{card.title}</p>
                            </div>
                        ))}
                    </div>
                )}

                {view === 'listaImmobili' && (
                    <ImmobiliLista 
                        styles={dashboardFormStyles} 
                        apiUrl={`http://localhost:8080/api/immobile/mio-organico/${idAgente}`} 
                    />
                )}

                {view === 'offertaManuale' && (
                    <OffertaManualeForm styles={dashboardFormStyles} />
                )}

                {view === 'nuovoImmobile' && (
                    <PropertyForm onSave={handleSaveProperty} styles={dashboardFormStyles} />
                )}

                {view === 'password' && (
                    <ChangePasswordForm 
                        onUpdate={(data) => console.log("Nuova PW:", data)} 
                        styles={dashboardFormStyles} 
                    />
                )}

                {view === 'gestioneOfferte' && (
                    <OfferteTabellaAgente modo="gestione" onSeeLog={handleSeeLog} />
                )}

                {view === 'storico' && (
                    <OfferteTabellaAgente modo="storico" onSeeLog={handleSeeLog} />
                )}

                {view === 'dettaglioLog' && (
                    <StoricoOffertaDettaglio idOfferta={selectedOffertaId} />
                )}
            </main>

            <footer style={footerStyle}>
                <p>assistenza@dietiestates.it | +39 3927309033</p>
            </footer>
        </div>
    );
};

const containerStyle = { display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#e0e0e0' };
const headerStyle = { backgroundColor: '#5DADE2', padding: '10px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '20px' };
const cardStyle = { backgroundColor: 'white', border: '2px solid #2C3E50', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', cursor: 'pointer' };
const footerStyle = { backgroundColor: '#2C3E50', color: 'white', padding: '10px', textAlign: 'center' };
const userIconStyle = { fontSize: '25px', border: '2px solid white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const backButtonStyle = { padding: '10px 20px', marginBottom: '20px', backgroundColor: '#2C3E50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const dashboardFormStyles = {
    formCardStyle: { backgroundColor: 'white', padding: '30px', borderRadius: '15px', maxWidth: '600px', margin: '0 auto' },
    formStyle: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputStyle: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd' },
    submitButtonStyle: { padding: '15px', backgroundColor: '#5DADE2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    eyeToggleStyle: { position: 'absolute', right: '10px', top: '10px', border: 'none', background: 'none', cursor: 'pointer', color: '#5DADE2', fontSize: '12px' }
};

export default AgenteDashboard;