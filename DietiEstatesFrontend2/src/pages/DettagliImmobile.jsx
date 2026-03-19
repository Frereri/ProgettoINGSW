import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import immobileService from '../services/immobileService';
import offertaService from '../services/offertaService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

let DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const InfoRow = ({ label, value, icon }) => (
    <div style={infoRowStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>{icon}</span>
            <span style={{ color: '#7F8C8D', fontWeight: '500' }}>{label}</span>
        </div>
        <span style={{ color: '#2C3E50', fontWeight: '700' }}>{value}</span>
    </div>
);

const ServiceBadge = ({ label, active, icon }) => (
    <div style={{
        padding: '8px 14px',
        borderRadius: '8px',
        backgroundColor: active ? '#EBF5FB' : '#F8F9F9',
        color: active ? '#2E86C1' : '#BDC3C7',
        fontSize: '13px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        border: `1px solid ${active ? '#AED6F1' : '#EAECEE'}`,
        opacity: active ? 1 : 0.6
    }}>
        <span>{icon}</span> {label}
    </div>
);

const DettagliImmobile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [immobile, setImmobile] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [offerta, setOfferta] = useState('');
    const [messaggioOfferta, setMessaggioOfferta] = useState({ tipo: '', testo: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        immobileService.getImmobileById(id)
            .then(res => {
                setImmobile(res.data);
                if (res.data.immagini?.length > 0) {
                    const coverIndex = res.data.immagini.findIndex(img => img.copertina);
                    if (coverIndex !== -1) setCurrentIndex(coverIndex);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const gestisciInvioOfferta = async (e) => {
        e.preventDefault();
        setMessaggioOfferta({ tipo: '', testo: 'Invio in corso...' });

        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.idToken?.toString(); 
            const userSub = session.tokens?.idToken?.payload?.sub;

            if (!token) {
                setMessaggioOfferta({ tipo: 'error', testo: 'Devi effettuare il login' });
                return;
            }

            const offertaData = {
                idImmobile: parseInt(id),
                prezzoOfferto: parseFloat(offerta),
                idCliente: userSub,
                idAgente: immobile.agente?.idUtente || immobile.idAgente,
                stato: 'PENDENTE'
            };

            await offertaService.inviaOfferta(offertaData, token);

            setMessaggioOfferta({ tipo: 'success', testo: 'Offerta inviata con successo!' });
            setOfferta('');
        } catch (err) {
            console.error("Errore dettagliato:", err);
            setMessaggioOfferta({ 
                tipo: 'error', 
                testo: err.response?.data?.message || 'Errore durante l\'invio' 
            });
        }
    };

    if (loading) return <div style={statusMsg}>Caricamento...</div>;
    if (!immobile) return <div style={statusMsg}>Immobile non trovato.</div>;

    const immagini = immobile.immagini || [];
    const position = (immobile.latitudine && immobile.longitudine) ? [immobile.latitudine, immobile.longitudine] : null;

    return (
        <div style={pageWrapper}>
            <Navbar />
            <main style={container}>
                <button onClick={() => navigate(-1)} style={backBtn}>❮ Torna alla ricerca</button>
                
                <div style={layoutGrid}>
                    {/* COLONNA SINISTRA */}
                    <div style={leftCol}>
                        <div style={galleryWrapper}>
                            {immagini.length > 0 ? (
                                <>
                                    <img src={immagini[currentIndex].urlImmagine} alt="Proprietà" style={mainImg} />
                                    {immagini.length > 1 && (
                                        <>
                                            <button onClick={() => setCurrentIndex(prev => (prev - 1 + immagini.length) % immagini.length)} style={navArrowLeft}>❮</button>
                                            <button onClick={() => setCurrentIndex(prev => (prev + 1) % immagini.length)} style={navArrowRight}>❯</button>
                                            <div style={imgCounter}>{currentIndex + 1} / {immagini.length}</div>
                                        </>
                                    )}
                                </>
                            ) : <div style={noImg}>📷 Nessuna immagine</div>}
                        </div>

                        <div style={contentCard}>
                            <h3 style={sectionTitle}>Dettagli Proprietà</h3>
                            <div style={featuresGridStyle}>
                                <InfoRow icon="📏" label="Superficie" value={`${immobile.superficie} m²`} />
                                <InfoRow icon="🚪" label="Locali" value={immobile.numeroStanze} />
                                <InfoRow icon="🛏️" label="Letti" value={immobile.numeroLetti} />
                                <InfoRow icon="🚿" label="Bagni" value={immobile.numeroBagni} />
                                <InfoRow icon="✨" label="Stato" value={immobile.stato} />
                                <InfoRow icon="⚡" label="Classe En." value={immobile.classeEnergetica} />
                                
                                {/* Campi dinamici */}
                                {immobile.giardino && (
                                    <InfoRow icon="🌳" label="Mq Giardino" value={`${immobile.superficieGiardino} m²`} />
                                )}
                                {immobile.tipoImmobile === 'APPARTAMENTO' && (
                                    <InfoRow icon="🏢" label="Piano" value={immobile.piano} />
                                )}
                            </div>

                            <h3 style={{...sectionTitle, marginTop: '40px'}}>Descrizione</h3>
                            <p style={descriptionText}>{immobile.descrizione}</p>

                            <h3 style={{...sectionTitle, marginTop: '40px'}}>Servizi della casa</h3>
                            <div style={badgesContainer}>
                                <ServiceBadge label="Climatizzazione" active={immobile.climatizzazione} icon="❄️" />
                                <ServiceBadge label="Box Auto" active={immobile.boxAuto} icon="🚗" />
                                <ServiceBadge label="Terrazzo" active={immobile.terrazzo} icon="🌇" />
                                <ServiceBadge label="Ascensore" active={immobile.ascensore} icon="🛗" />
                                <ServiceBadge label="Portineria" active={immobile.portineria} icon="💂" />
                                <ServiceBadge label="Giardino" active={immobile.giardino} icon="🌳" />
                                <ServiceBadge label="Piscina" active={immobile.piscina} icon="🏊" />
                            </div>

                            <h3 style={{...sectionTitle, marginTop: '40px'}}>Nelle vicinanze</h3>
                            <div style={badgesContainer}>
                                <ServiceBadge label="Scuole" active={immobile.vicinoScuole} icon="🎓" />
                                <ServiceBadge label="Trasporti" active={immobile.vicinoTrasporti} icon="🚌" />
                                <ServiceBadge label="Parchi" active={immobile.vicinoParchi} icon="🌳" />
                            </div>
                        </div>
                    </div>

                    {/* COLONNA DESTRA */}
                    <div style={rightCol}>
                        <div style={stickySidebar}>
                            <div style={mainInfoCard}>
                                <span style={contractBadge(immobile.tipoContratto)}>{immobile.tipoContratto}</span>
                                <h1 style={propTitle}>{immobile.titolo}</h1>
                                <p style={propAddress}>📍 {immobile.indirizzo}, {immobile.citta}</p>
                                <div style={priceTag}>{immobile.prezzo?.toLocaleString()} €</div>
                            </div>

                            <div style={offerSection}>
                                <h3 style={{ margin: '0 0 15px 0' }}>Fai un'offerta</h3>
                                <form onSubmit={gestisciInvioOfferta} style={offerForm}>
                                    <input type="number" placeholder="Importo €" min={1} value={offerta} onChange={(e) => setOfferta(e.target.value)} style={offerInput} />
                                    <button type="submit" style={offerSubmitBtn}>Invia</button>
                                </form>
                                {messaggioOfferta.testo && <div style={msgFeedback}>{messaggioOfferta.testo}</div>}
                            </div>

                            <div style={mapContainer}>
                                {position ? (
                                    <MapContainer center={position} zoom={15} style={{ height: '100%' }} zoomControl={false}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <Marker position={position} />
                                    </MapContainer>
                                ) : <div style={noImg}>Mappa non disponibile</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

// --- STILI ---
const pageWrapper = { display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fff' };
const container = { flex: 1, maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', width: '100%' };
const statusMsg = { padding: '100px', textAlign: 'center' };
const backBtn = { border: 'none', background: 'none', color: '#3498DB', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px', fontSize: '1rem' };
const layoutGrid = { display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '30px' };
const leftCol = { display: 'flex', flexDirection: 'column', gap: '25px' };
const rightCol = { display: 'flex', flexDirection: 'column' };
const stickySidebar = { position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', gap: '20px' };

const galleryWrapper = { position: 'relative', height: '480px', backgroundColor: '#F4F7F6', borderRadius: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #EAECEE' };
const mainImg = { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' };
const imgCounter = { position: 'absolute', bottom: '15px', right: '15px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem' };

const navArrow = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.95)', border: 'none', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.5rem', color: '#2C3E50', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', zIndex: 10 };
const navArrowLeft = { ...navArrow, left: '20px' };
const navArrowRight = { ...navArrow, right: '20px' };

const contentCard = { padding: '35px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #EEE' };
const sectionTitle = { fontSize: '1.3rem', color: '#2C3E50', marginBottom: '20px', fontWeight: '800', borderLeft: '4px solid #3498DB', paddingLeft: '15px' };
const featuresGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 50px' };
const infoRowStyle = { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F2F4F4' };
const descriptionText = { lineHeight: '1.8', color: '#566573', fontSize: '1.05rem' };

const mainInfoCard = { padding: '30px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #EEE' };
const propTitle = { color: '#2C3E50', fontSize: '1.8rem', fontWeight: '800', margin: '15px 0 5px 0' };
const propAddress = { color: '#7F8C8D', marginBottom: '20px' };
const priceTag = { fontSize: '2.4rem', color: '#27AE60', fontWeight: '800' };
const contractBadge = (tipo) => ({ padding: '5px 12px', borderRadius: '5px', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: tipo === 'VENDITA' ? '#27AE60' : '#E67E22' });

const offerSection = { padding: '25px', backgroundColor: '#2C3E50', borderRadius: '16px', color: '#fff' };
const offerForm = { display: 'flex', gap: '10px' };
const offerInput = { flex: 1, padding: '12px', borderRadius: '8px', border: 'none' };
const offerSubmitBtn = { padding: '12px 20px', backgroundColor: '#3498DB', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const msgFeedback = { marginTop: '10px', fontSize: '0.9rem', textAlign: 'center' };

const mapContainer = { height: '280px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #EEE' };
const badgesContainer = { display: 'flex', flexWrap: 'wrap', gap: '10px' };
const noImg = { color: '#BDC3C7', fontWeight: 'bold' };

export default DettagliImmobile;