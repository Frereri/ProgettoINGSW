import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import immobileService from '../services/immobileService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/useAuth';

const Dashboard = () => {
    const [immobili, setImmobili] = useState([]);
    const { user } = useAuth();
    
    const initialFilters = useMemo(() => ({ citta: '', min: '', max: '', contratto: '' }), []);
    const [filters, setFilters] = useState(initialFilters);
    const isDirty = JSON.stringify(filters) !== JSON.stringify(initialFilters);

    const caricaDati = useCallback((currentFilters) => {
        immobileService.getAllImmobili(0, 50, currentFilters)
            .then(res => {
                const data = res.data?.content || res.data || [];
                setImmobili(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                console.error("Errore API:", err);
                setImmobili([]);
            });
    }, []);

    useEffect(() => { caricaDati(initialFilters); }, [caricaDati, initialFilters]); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        caricaDati(filters);
    };

    const handleReset = () => {
        setFilters(initialFilters);
        caricaDati(initialFilters);
    };

    const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400&h=300&auto=format&fit=crop"; 

    return (
        <div style={pageWrapper}>
            <Navbar />
            
            <main style={mainContent}>
                {/* SEZIONE TITOLO */}
                <section style={headerSection}>
                    <h1 style={mainTitle}>Dieti Estates</h1>
                    <p style={subTitle}>La tua nuova casa ti aspetta. Esplora le migliori proposte.</p>

                    {/* Barra di ricerca */}
                    <form onSubmit={handleSearch} style={searchContainer}>
                        <div style={inputGroup}>
                            <label style={labelStyle}>Città</label>
                            <input name="citta" value={filters.citta} placeholder="Es: Napoli" onChange={handleChange} style={inputField} />
                        </div>
                        <div style={inputGroup}>
                            <label style={labelStyle}>Min €</label>
                            <input name="min" type="number" value={filters.min} placeholder="0" onChange={handleChange} style={inputField} />
                        </div>
                        <div style={inputGroup}>
                            <label style={labelStyle}>Max €</label>
                            <input name="max" type="number" value={filters.max} placeholder="Nessun limite" onChange={handleChange} style={inputField} />
                        </div>
                        <div style={inputGroup}>
                            <label style={labelStyle}>Tipo</label>
                            <select name="contratto" value={filters.contratto} onChange={handleChange} style={inputField}>
                                <option value="">Tutti</option>
                                <option value="VENDITA">Vendita</option>
                                <option value="AFFITTO">Affitto</option>
                            </select>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                            <button type="submit" style={searchButton}>Cerca</button>
                            <button 
                                type="button" 
                                onClick={handleReset} 
                                disabled={!isDirty}
                                style={{...searchButton, backgroundColor: isDirty ? '#95A5A6' : '#ECF0F1', color: isDirty ? 'white' : '#BDC3C7'}}
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </section>

                {/* GRIGLIA */}
                <div style={gridContainer}>
                    {immobili.length > 0 ? immobili.map(i => (
                        <div key={i.idImmobile} style={cardStyle}>
                            <Link to={`/immobile/${i.idImmobile}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={imageWrapper}>
                                    <span style={{...badge, backgroundColor: i.tipoContratto === 'VENDITA' ? '#27AE60' : '#E67E22'}}>
                                        {i.tipoContratto}
                                    </span>
                                    <img 
                                        src={i.immagini?.find(img => img.copertina)?.urlImmagine || i.immagini?.[0]?.urlImmagine || FALLBACK_IMAGE} 
                                        alt={i.titolo} 
                                        style={cardImg}
                                        onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                                    />
                                </div>
                                <div style={cardInfo}>
                                    <h3 style={cardTitle}>{i.titolo}</h3>
                                    <p style={cardPrice}>{i.prezzo?.toLocaleString()} €</p>
                                    <p style={cardLocation}>📍 {i.citta}</p>
                                </div>
                            </Link>
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0' }}>
                            <p style={{ color: '#BDC3C7', fontSize: '1.2rem' }}>Caricamento immobili in corso...</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

// --- STILI ---
const pageWrapper = { display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', backgroundColor: '#F4F7F6' };
const mainContent = { flex: '1', width: '100%' };

const headerSection = {
    backgroundColor: '#fff',
    padding: '60px 20px',
    textAlign: 'center',
    borderBottom: '1px solid #EAEAEA'
};

const mainTitle = { fontSize: '3rem', color: '#2C3E50', margin: '0 0 10px 0', fontWeight: '800' };
const subTitle = { fontSize: '1.2rem', color: '#7F8C8D', marginBottom: '40px' };

const searchContainer = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    flexWrap: 'wrap',
    padding: '20px'
};

const inputGroup = { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', flex: '1', minWidth: '180px' };
const labelStyle = { fontSize: '0.85rem', fontWeight: 'bold', color: '#34495E', textTransform: 'uppercase' };

const inputField = {
    padding: '12px 15px',
    borderRadius: '6px',
    border: '1px solid #DCDFE3',
    fontSize: '1rem',
    width: '100%',
    outline: 'none',
    backgroundColor: '#2C3E50'
};

const searchButton = {
    padding: '12px 30px',
    backgroundColor: '#2C3E50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    height: '46px'
};

const gridContainer = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '30px',
    padding: '40px 4%',
    width: '100%',
    boxSizing: 'border-box'
};

const cardStyle = {
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease',
    border: '1px solid #F0F0F0'
};

const imageWrapper = { position: 'relative', height: '220px' };
const cardImg = { width: '100%', height: '100%', objectFit: 'cover' };
const badge = { position: 'absolute', top: '12px', left: '12px', padding: '5px 10px', borderRadius: '4px', color: 'white', fontSize: '0.7rem', fontWeight: 'bold' };
const cardInfo = { padding: '20px' };
const cardTitle = { fontSize: '1.1rem', margin: '0 0 8px 0', color: '#2C3E50', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const cardPrice = { fontSize: '1.4rem', color: '#27AE60', fontWeight: 'bold', margin: '0' };
const cardLocation = { fontSize: '0.9rem', color: '#95A5A6', marginTop: '8px' };

export default Dashboard;