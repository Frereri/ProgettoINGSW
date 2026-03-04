import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios'; // AGGIUNTO
import { fetchAuthSession } from 'aws-amplify/auth'; // AGGIUNTO
import immobileService from '../services/immobileService';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ImmobileDettaglio = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [immobile, setImmobile] = useState(null);
    const [valoreOfferta, setValoreOfferta] = useState(""); // Stato per l'input

    useEffect(() => {
        immobileService.getImmobileById(id)
            .then(res => setImmobile(res.data))
            .catch(err => console.error("Errore nel caricamento:", err));
    }, [id]);

    const handleOfferta = async () => {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens.accessToken.toString();
            const groups = session.tokens.accessToken.payload['cognito:groups'] || [];

            // Controllo se è un cliente (come da traccia)
            if (!groups.includes('Clienti')) {
                alert("Solo i clienti possono effettuare offerte.");
                return;
            }

            const payload = {
                idImmobile: immobile.idImmobile, // Assicurati che il nome del campo sia corretto
                prezzoOfferto: parseFloat(valoreOfferta)
            };

            await axios.post("http://localhost:8080/api/cliente/offerte/crea", payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

            alert("Offerta inviata con successo!");
            navigate('/cliente'); // Torna alla dashboard per vederla in lista
        } catch (err) {
            console.error("Errore invio offerta:", err);
            alert("Errore nell'invio dell'offerta.");
        }
    };

    if (!immobile) return <div style={{ padding: '20px' }}>Caricamento dettagli...</div>;

    const position = (immobile.latitudine && immobile.longitudine) 
                     ? [immobile.latitudine, immobile.longitudine] : null;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <button 
                onClick={() => navigate('/')} 
                style={backButtonStyle}
            >
                ← Torna alla ricerca
            </button>

            <div style={cardStyle}>
                <h1 style={{ color: '#333', marginBottom: '10px' }}>{immobile.titolo}</h1>
                <h2 style={{ color: '#007bff', margin: '0 0 20px 0' }}>{immobile.prezzo.toLocaleString()} €</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                    <p><strong>Città:</strong> {immobile.citta}</p>
                    <p><strong>Contratto:</strong> {immobile.tipoContratto || 'Vendita'}</p>
                    <p><strong>Descrizione:</strong> {immobile.descrizione || 'Nessuna descrizione.'}</p>
                </div>

                {/* SEZIONE OFFERTA */}
                <div style={offertaBoxStyle}>
                    <h3>Effettua un'offerta</h3>
                    <input 
                        type="number" 
                        placeholder="Tua offerta (€)" 
                        value={valoreOfferta}
                        onChange={(e) => setValoreOfferta(e.target.value)}
                        style={inputStyle}
                    />
                    <button onClick={handleOfferta} style={offertaButtonStyle}>Invia Proposta</button>
                    <p><small>Prezzo originale: {immobile.prezzo} €</small></p>
                </div>
            </div>

            {/* MAPPA */}
            <div style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ padding: '10px 20px', backgroundColor: '#eee', borderBottom: '1px solid #ddd' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>Posizione Immobile</h3>
                </div>
                <div style={{ height: '400px', width: '100%' }}>
                    {position ? (
                        <MapContainer center={position} zoom={16} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={position}><Popup>{immobile.titolo}</Popup></Marker>
                        </MapContainer>
                    ) : <p style={{textAlign:'center', padding:'20px'}}>Mappa non disponibile</p>}
                </div>
            </div>
        </div>
    );
};

// STILI
const backButtonStyle = { marginBottom: '20px', cursor: 'pointer', padding: '8px 15px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: 'white' };
const cardStyle = { backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
const offertaBoxStyle = { borderTop: '2px solid #ddd', paddingTop: '20px', marginTop: '20px' };
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 };
const offertaButtonStyle = { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default ImmobileDettaglio;