import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import immobileService from '../services/immobileService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Dashboard = () => {
    const [immobili, setImmobili] = useState([]);
    
    // Stabilizziamo i filtri iniziali
    const initialFilters = useMemo(() => ({ citta: '', min: '', max: '', contratto: '' }), []);
    const [filters, setFilters] = useState(initialFilters);

    const isDirty = JSON.stringify(filters) !== JSON.stringify(initialFilters);

    // Carica dati ottimizzata
    const caricaDati = useCallback((currentFilters) => {
        immobileService.getAllImmobili(0, 50, currentFilters) // Carichiamo un numero alto per ora
            .then(res => {
                const data = res.data.content || res.data;
                setImmobili(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                console.error("Errore API:", err);
                setImmobili([]);
            });
    }, []);

    useEffect(() => { 
        caricaDati(initialFilters); 
    }, [caricaDati, initialFilters]); 

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

    // Immagine di riserva se il cloud storage fallisce (441)
    const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400&h=300&auto=format&fit=crop"; 

    const handleImageError = (e) => {
        e.target.onerror = null; 
        e.target.src = FALLBACK_IMAGE;
    };

    return (
        <div style={{ backgroundColor: '#fdfdfd', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', flex: 1, width: '100%' }}>
                
                <form onSubmit={handleSearch} style={searchBarStyle}>
                    <input name="citta" value={filters.citta} placeholder="Città (es. Napoli)" onChange={handleChange} style={inputStyle} />
                    <input name="min" type="number" value={filters.min} placeholder="Min €" onChange={handleChange} style={inputStyle} />
                    <input name="max" type="number" value={filters.max} placeholder="Max €" onChange={handleChange} style={inputStyle} />
                    <select name="contratto" value={filters.contratto} onChange={handleChange} style={inputStyle}>
                        <option value="">Qualsiasi Contratto</option>
                        <option value="VENDITA">Vendita</option>
                        <option value="AFFITTO">Affitto</option>
                    </select>
                    
                    <button type="submit" style={{
                        ...btnSearchStyle, 
                        backgroundColor: isDirty ? '#2980B9' : '#2C3E50'
                    }}>
                        Cerca
                    </button>

                    <button 
                        type="button" 
                        onClick={handleReset} 
                        style={{
                            ...btnResetStyle, 
                            backgroundColor: isDirty ? '#E67E22' : '#BDC3C7',
                            cursor: isDirty ? 'pointer' : 'default'
                        }}
                        disabled={!isDirty}
                    >
                        Reset
                    </button>
                </form>

                <div style={gridStyle}>
                    {immobili.length > 0 ? immobili.map(i => (
                        <div key={i.idImmobile} style={cardStyle}>
                            <Link to={`/immobile/${i.idImmobile}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={imgContainerCard}>
                                    {/* Badge Vendita/Affitto */}
                                    <span style={{
                                        ...badgeStyle,
                                        backgroundColor: i.tipoContratto === 'VENDITA' ? '#27AE60' : '#E67E22'
                                    }}>
                                        {i.tipoContratto}
                                    </span>
                                    <img 
                                        src={
                                            i.immagini && i.immagini.length > 0 
                                                ? (i.immagini.find(img => img.copertina === true)?.urlImmagine || i.immagini[0].urlImmagine)
                                                : FALLBACK_IMAGE
                                        } 
                                        alt={i.titolo} 
                                        style={imgStyle} 
                                        onError={handleImageError} 
                                    />
                                </div>
                                <div style={{ padding: '15px' }}>
                                    <h3 style={titleStyle}>{i.titolo}</h3>
                                    <p style={priceStyle}>{i.prezzo?.toLocaleString()} €</p>
                                    <p style={cityStyle}>📍 {i.citta}</p>
                                </div>
                            </Link>
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', marginTop: '50px' }}>
                            <p style={{ color: '#999' }}>Nessun immobile trovato con i filtri selezionati.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

// --- STILI ---
const searchBarStyle = { display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' };
const inputStyle = { padding: '12px', borderRadius: '5px', border: '1px solid #ddd', flex: '1', minWidth: '150px', fontSize: '14px' };
const btnSearchStyle = { padding: '10px 25px', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' };
const btnResetStyle = { padding: '10px 25px', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', transition: '0.3s' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' };
const cardStyle = { border: 'none', borderRadius: '12px', backgroundColor: '#fff', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'transform 0.2s' };
const imgContainerCard = { width: '100%', height: '200px', position: 'relative', overflow: 'hidden' };
const imgStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const badgeStyle = { position: 'absolute', top: '10px', left: '10px', padding: '5px 10px', color: 'white', fontSize: '11px', fontWeight: 'bold', borderRadius: '4px', zIndex: 1 };
const titleStyle = { fontSize: '1rem', margin: '0 0 8px 0', height: '1.2em', overflow: 'hidden', color: '#333' };
const priceStyle = { color: '#2C3E50', fontWeight: 'bold', fontSize: '1.3rem', margin: '0' };
const cityStyle = { color: '#7f8c8d', fontSize: '0.85rem', marginTop: '5px' };

export default Dashboard;