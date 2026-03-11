import React, { useState } from 'react';
import Logo from '../components/Logo';
import { signOut } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

// Importa i componenti esistenti o nuovi
import ChangePasswordForm from '../components/ChangePasswordForm';
import ListaAgenti from '../components/gestoreDashboard/ListaAgenti';
import NuovoAgenteForm from '../components/gestoreDashboard/NuovoAgenteForm';
import ImmobiliLista from '../components/ImmobiliLista';
import { PropertyForm } from '../components/PropertyForm';

import { aggiornaAgente, eliminaAgente } from '../services/gestoreService';

const GestoreDashboard = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('menu');
    const [selectedAgenteId, setSelectedAgenteId] = useState(null);
    const [selectedAgente, setSelectedAgente] = useState(null);

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) { console.error(error); }
    };

    const handleAgenteCreato = () => {
        alert("Agente creato con successo!");
        setView('listaAgenti'); // Portalo alla lista dopo la creazione
    };

    const handleEliminaClick = (id) => {
        setSelectedAgenteId(id);
        setView('confermaElimina'); // Una nuova vista o un modal
    };

    const handleEditClick = (agente) => {
        setSelectedAgente(agente);
        setView('modificaAgente');
    };

    // Card specifiche per il Gestore
    const cards = [
        { title: "Visualizza Agenti", icon: "👥", view: "listaAgenti" },
        { title: "Nuovo Agente", icon: "👤➕", view: "nuovoAgente" },
        { title: "Modifica password", icon: "🔒✏️", view: "password" },
        { title: "Immobili dell'Agenzia", icon: "🏠", view: "immobiliAgenzia" },
        { title: "Carica Immobile", icon: "➕🏠", view: "nuovoImmobile" }
        // Aggiungi qui altre card se il gestore deve vedere anche immobili o statistiche
    ];

    return (

        
        <div style={containerStyle}>
            <header style={headerStyle}>
                <Logo width="60px" height="60px" />
                <h2 style={{ margin: 0 }}>AREA GESTORE</h2>
                <div onClick={handleLogout} style={{ ...userIconStyle, cursor: 'pointer' }}>👤</div>
            </header>
            
            <main style={{ flex: 1, padding: '20px' }}>
                {view !== 'menu' && (
                    <button onClick={() => setView('menu')} style={backButtonStyle}>⬅ Indietro</button>
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

                {/* Vista Creazione Agente */}
                {view === 'nuovoAgente' && (
                    <NuovoAgenteForm onSave={handleAgenteCreato} styles={dashboardFormStyles} />
                )}

                {view === 'immobiliAgenzia' && (
                    <ImmobiliLista 
                        styles={dashboardFormStyles} 
                        apiUrl="http://localhost:8080/api/gestore/immobili-agenzia" 
                    />
                )}

                {view === 'nuovoImmobile' && (
                    <div style={dashboardFormStyles.formCardStyle}>
                        <h3>Inserisci Nuovo Immobile</h3>
                        <PropertyForm 
                            isGestore={true} 
                            styles={dashboardFormStyles} 
                            onSubmit={() => { alert("Creato!"); setView('immobiliAgenzia'); }}
                        />
                    </div>
                )}

                {view === 'listaAgenti' && (
                    <ListaAgenti 
                        onElimina={handleEliminaClick} 
                        onEdit={handleEditClick}
                        styles={dashboardFormStyles} 
                    />
                )}

                {view === 'confermaElimina' && (
                    <div style={dashboardFormStyles.formCardStyle}>
                        <h3>Sei sicuro di voler eliminare questo agente?</h3>
                        <p>L'azione è irreversibile. ID Agente: {selectedAgenteId}</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={() => setView('listaAgenti')} 
                                style={{...backButtonStyle, marginBottom: 0}}>Annulla</button>
                            <button 
                                onClick={async () => {
                                    try {
                                        await eliminaAgente(selectedAgenteId); // <--- Ora definita dall'import
                                        alert("Agente eliminato");
                                        setView('listaAgenti');
                                    } catch (err) {
                                        alert("Errore nell'eliminazione");
                                    }
                                }} 
                                style={{...backButtonStyle, backgroundColor: 'red', marginBottom: 0}}>
                                Conferma Eliminazione
                            </button>
                        </div>
                    </div>
                )}

                {view === 'modificaAgente' && (
                    <div style={dashboardFormStyles.formCardStyle}>
                        <h3>Modifica Profilo Agente</h3>
                        {/* Verifichiamo che selectedAgente non sia null prima di renderizzare il form */}
                        {selectedAgente && (
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    await aggiornaAgente(selectedAgente.idUtente, selectedAgente); // <--- Ora definita
                                    alert("Profilo aggiornato");
                                    setView('listaAgenti');
                                } catch (err) {
                                    alert("Errore nell'aggiornamento");
                                }
                            }} style={dashboardFormStyles.formStyle}>
                                <input 
                                    style={dashboardFormStyles.inputStyle}
                                    value={selectedAgente.nome || ''}
                                    onChange={(e) => setSelectedAgente({...selectedAgente, nome: e.target.value})}
                                    placeholder="Nome"
                                />
                                <input 
                                    style={dashboardFormStyles.inputStyle}
                                    value={selectedAgente.cognome || ''}
                                    onChange={(e) => setSelectedAgente({...selectedAgente, cognome: e.target.value})}
                                    placeholder="Cognome"
                                />
                                <button type="submit" style={dashboardFormStyles.submitButtonStyle}>Salva Modifiche</button>
                                <button type="button" onClick={() => setView('listaAgenti')} style={{background: 'none', border: 'none', cursor: 'pointer'}}>Annulla</button>
                            </form>
                        )}
                    </div>
                )}

                {/* Riutilizzo cambio password */}
                {view === 'password' && (
                    <ChangePasswordForm 
                        onUpdate={(data) => console.log("Nuova PW Gestore:", data)} 
                        styles={dashboardFormStyles} 
                    />
                )}
            </main>

            <footer style={footerStyle}>
                <p>Supporto Gestori: assistenza@dietiestates.it</p>
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

export default GestoreDashboard;