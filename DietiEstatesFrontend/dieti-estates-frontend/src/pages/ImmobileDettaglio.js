import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import immobileService from '../services/immobileService';

// Fix per l'icona del marker che a volte non appare in React
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

    useEffect(() => {
        immobileService.getImmobileById(id)
            .then(res => setImmobile(res.data))
            .catch(err => console.error("Errore nel caricamento:", err));
    }, [id]);

    if (!immobile) return <div style={{ padding: '20px' }}>Caricamento dettagli...</div>;

    // Verifichiamo che le coordinate esistano per evitare il crash 'lat of null'
    const position = (immobile.latitudine && immobile.longitudine) 
                     ? [immobile.latitudine, immobile.longitudine] 
                     : null;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <button 
                onClick={() => navigate('/')} 
                style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 15px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
                ← Torna alla ricerca
            </button>

            {/* SEZIONE DETTAGLI TESTUALI */}
            <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <h1 style={{ color: '#333', marginBottom: '10px' }}>{immobile.titolo}</h1>
                <h2 style={{ color: '#007bff', margin: '0 0 20px 0' }}>{immobile.prezzo.toLocaleString()} €</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <p><strong>Città:</strong> {immobile.citta}</p>
                    <p><strong>Contratto:</strong> {immobile.tipoContratto || 'Vendita'}</p>
                    <p><strong>Descrizione:</strong> {immobile.descrizione || 'Nessuna descrizione disponibile.'}</p>
                </div>
            </div>

            {/* SEZIONE MAPPA (Il riquadro tipo Immobiliare.it) */}
            <div style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ padding: '10px 20px', backgroundColor: '#eee', borderBottom: '1px solid #ddd' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>Posizione Immobile</h3>
                </div>
                
                <div style={{ height: '400px', width: '100%' }}>
                    {position ? (
                        <MapContainer 
                            center={position} 
                            zoom={16} 
                            scrollWheelZoom={false}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={position}>
                                <Popup>
                                    <strong>{immobile.titolo}</strong><br />
                                    {immobile.citta}
                                </Popup>
                            </Marker>
                        </MapContainer>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#f0f0f0', color: '#666' }}>
                            <p>Mappa non disponibile: coordinate mancanti nel database.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImmobileDettaglio;