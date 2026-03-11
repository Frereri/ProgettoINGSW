import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import immobileService from '../services/immobileService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import offertaService from '../services/offertaService';

// Configurazione Icona Mappa
let DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ServiceBadge = ({ label, active, icon }) => (
    <div style={{
        padding: '10px 18px',
        borderRadius: '25px',
        backgroundColor: active ? '#E8F5E9' : '#F5F5F5',
        color: active ? '#2E7D32' : '#9E9E9E',
        fontSize: '14px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        border: `1px solid ${active ? '#2E7D32' : '#E0E0E0'}`,
        boxShadow: active ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
    }}>
        <span>{icon}</span>
        {label}
    </div>
);

const ImmobileDettaglio = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [immobile, setImmobile] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0); // Usiamo solo questo per le foto
    const [offerta, setOfferta] = useState('');
    const [messaggioOfferta, setMessaggioOfferta] = useState({ tipo: '', testo: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        immobileService.getImmobileById(id)
            .then(res => {
                setImmobile(res.data);
                
                // SINCRONIZZAZIONE COPERTINA:
                // Troviamo l'indice dell'immagine che ha copertina === true
                if (res.data.immagini && res.data.immagini.length > 0) {
                    const coverIndex = res.data.immagini.findIndex(img => img.copertina === true);
                    if (coverIndex !== -1) {
                        setCurrentIndex(coverIndex); // Impostiamo currentIndex sulla copertina
                    }
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const gestisciInvioOfferta = (e) => {
        e.preventDefault();
        if (!offerta || offerta <= 0) {
            setMessaggioOfferta({ tipo: 'error', testo: 'Inserisci un importo valido' });
            return;
        }
        offertaService.inviaOfferta(id, offerta)
            .then(() => {
                setMessaggioOfferta({ tipo: 'success', testo: 'Offerta inviata con successo!' });
                setOfferta(''); 
            })
            .catch(err => {
                const msg = err.response?.status === 401 
                    ? "Devi essere loggato come Cliente" 
                    : "Errore durante l'invio dell'offerta.";
                setMessaggioOfferta({ tipo: 'error', testo: msg });
            });
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Caricamento in corso...</div>;
    if (!immobile) return <div style={{ padding: '50px', textAlign: 'center' }}>Immobile non trovato.</div>;

    const immagini = immobile.immagini || [];
    const position = (immobile.latitudine && immobile.longitudine) ? [immobile.latitudine, immobile.longitudine] : null;

    const nextPhoto = () => setCurrentIndex((prev) => (prev + 1) % immagini.length);
    const prevPhoto = () => setCurrentIndex((prev) => (prev - 1 + immagini.length) % immagini.length);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F4F7F6' }}>
            <Navbar />
            
            <div style={{ flex: 1, maxWidth: '1200px', margin: '20px auto', padding: '0 20px', width: '100%' }}>
                <button onClick={() => navigate(-1)} style={backBtn}>❮ Torna alla ricerca</button>
                
                <div style={mainGrid}>
                    {/* COLONNA SINISTRA */}
                    <div style={leftColumn}>
                        <div style={mainImageWrapper}>
                            {immagini.length > 0 ? (
                                <>
                                    <img 
                                        src={immagini[currentIndex].urlImmagine} 
                                        alt="Proprietà" 
                                        style={mainImageStyle} 
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/800x500?text=Immagine+non+disponibile'; }}
                                    />
                                    {immagini.length > 1 && (
                                        <>
                                            <button onClick={prevPhoto} style={arrowLeft}>❮</button>
                                            <button onClick={nextPhoto} style={arrowRight}>❯</button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div style={noImagePlaceholder}>📷 Nessuna immagine disponibile</div>
                            )}
                        </div>

                        <div style={descriptionCard}>
                            <h3>Descrizione</h3>
                            <p style={{ lineHeight: '1.6', color: '#444' }}>{immobile.descrizione}</p>
                        </div>

                        <div style={statsGrid}>
                            <div style={statItem}><strong>Mq</strong><span>{immobile.superficie}</span></div>
                            <div style={statItem}><strong>Locali</strong><span>{immobile.numeroStanze}</span></div>
                            <div style={statItem}><strong>Letti</strong><span>{immobile.numeroLetti}</span></div>
                            <div style={statItem}><strong>Bagni</strong><span>{immobile.numeroBagni}</span></div>
                            <div style={statItem}><strong>Stato</strong><span style={{color: '#27AE60'}}>{immobile.stato}</span></div>
                            <div style={statItem}><strong>Classe</strong><span>{immobile.classeEnergetica}</span></div>
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {/* RISOLUZIONE BOX AUTO: Usiamo !! per forzare booleano */}
                            <ServiceBadge label="Climatizzazione" active={!!immobile.climatizzazione} icon="❄️" />
                            <ServiceBadge label="Box Auto" active={!!immobile.boxAuto} icon="🚗" />
                            <ServiceBadge label="Terrazzo" active={!!immobile.terrazzo} icon="🌇" />

                            {immobile.tipoImmobile === 'APPARTAMENTO' && (
                                <>
                                    <ServiceBadge label="Ascensore" active={!!immobile.ascensore} icon="🛗" />
                                    <ServiceBadge label="Portineria" active={!!immobile.portineria} icon="💂" />
                                </>
                            )}

                            {immobile.tipoImmobile === 'VILLA' && (
                                <>
                                    <ServiceBadge label="Piscina" active={!!immobile.piscina} icon="🏊" />
                                    <ServiceBadge label="Giardino" active={!!immobile.giardino} icon="🌳" />
                                </>
                            )}
                        </div>
                    </div>

                    {/* COLONNA DESTRA */}
                    <div style={rightColumn}>
                        <div style={infoCard}>
                            <span style={{...tipoContrattoBadge, backgroundColor: immobile.tipoContratto === 'VENDITA' ? '#27AE60' : '#E67E22'}}>
                                {immobile.tipoContratto}
                            </span>
                            <h1 style={titleStyle}>{immobile.titolo}</h1>
                            <p style={addressStyle}>📍 {immobile.indirizzo}, {immobile.citta}</p>
                            <h2 style={priceLarge}>{immobile.prezzo?.toLocaleString()} €</h2>

                            <div style={badgeGrid}>
                                <ServiceBadge label="Scuole" active={!!immobile.vicinoScuole} icon="🎓" />
                                <ServiceBadge label="Parchi" active={!!immobile.vicinoParchi} icon="🌳" />
                                <ServiceBadge label="Trasporti" active={!!immobile.vicinoTrasporti} icon="🚌" />
                            </div>
                        </div>

                        <div style={offerCard}>
                            <h3 style={{ marginTop: 0 }}>Fai un'offerta</h3>
                            <form onSubmit={gestisciInvioOfferta}>
                                <div style={inputGroup}>
                                    <input 
                                        type="number" 
                                        placeholder="Importo €" 
                                        value={offerta}
                                        onChange={(e) => setOfferta(e.target.value)}
                                        style={offerInput}
                                    />
                                    <button type="submit" style={offerBtn}>Invia</button>
                                </div>
                                {messaggioOfferta.testo && (
                                    <p style={{ color: messaggioOfferta.tipo === 'success' ? '#2ECC71' : '#E74C3C', marginTop: '10px' }}>
                                        {messaggioOfferta.testo}
                                    </p>
                                )}
                            </form>
                        </div>

                        <div style={mapWrapperDetail}>
                            {position ? (
                                <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={position}><Popup>{immobile.indirizzo}</Popup></Marker>
                                </MapContainer>
                            ) : <div style={noImagePlaceholder}>Mappa non disponibile</div>}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

// --- STILI (Invariati) ---
const mainGrid = { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '25px', marginBottom: '40px' };
const leftColumn = { display: 'flex', flexDirection: 'column', gap: '20px' };
const rightColumn = { display: 'flex', flexDirection: 'column', gap: '20px' };
const descriptionCard = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const infoCard = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const titleStyle = { margin: '15px 0 5px 0', fontSize: '1.8rem', color: '#2C3E50' };
const addressStyle = { color: '#7F8C8D', margin: '0 0 15px 0' };
const priceLarge = { fontSize: '2.2rem', color: '#2C3E50', fontWeight: '800', margin: '10px 0' };
const statItem = { display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #eee', padding: '10px', borderRadius: '8px' };
const offerCard = { backgroundColor: '#2C3E50', color: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' };
const inputGroup = { display: 'flex', gap: '10px', marginTop: '15px' };
const offerInput = { flex: 1, padding: '12px', borderRadius: '6px', border: 'none', fontSize: '1rem' };
const offerBtn = { padding: '12px 20px', backgroundColor: '#3498DB', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const mapWrapperDetail = { height: '300px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const backBtn = { marginBottom: '15px', cursor: 'pointer', border: 'none', background: 'none', color: '#3498DB', fontWeight: 'bold', fontSize: '1rem' };
const mainImageWrapper = { position: 'relative', width: '100%', height: '400px', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const mainImageStyle = { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' };
const arrowBase = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.7)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem', zIndex: 2 };
const arrowLeft = { ...arrowBase, left: '15px' };
const arrowRight = { ...arrowBase, right: '15px' };
const tipoContrattoBadge = { padding: '5px 12px', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 'bold', color: 'white', textTransform: 'uppercase' };
const badgeGrid = { display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '20px 0' };
const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', padding: '20px', backgroundColor: '#F8F9FA', borderRadius: '10px', margin: '20px 0' };
const noImagePlaceholder = { height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEE', color: '#999' };

export default ImmobileDettaglio;