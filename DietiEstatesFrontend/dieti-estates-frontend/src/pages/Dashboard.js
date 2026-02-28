import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import immobileService from '../services/immobileService';
import Logo from '../components/Logo.js';

const Dashboard = () => {
    const [immobili, setImmobili] = useState([]);
    // Stato per i filtri di ricerca
    const [filters, setFilters] = useState({
        citta: '',
        min: 0,
        max: 9999999,
        contratto: ''
    });

    useEffect(() => {
        caricaDati();
    }, []);

    const caricaDati = () => {
        immobileService.getAllImmobili()
            .then(res => setImmobili(res.data))
            .catch(err => alert("Errore: " + err.message));
    };

    // Funzione per la ricerca avanzata
    const gestisciRicerca = (e) => {
        e.preventDefault();
        immobileService.searchImmobili(filters)
            .then(res => setImmobili(res.data))
            .catch(err => console.error(err));
    };

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            {/* HEADER CON LOGO */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <Logo width="60px" height="60px" />
                <h1>Dieti Estates</h1>
            </header>

            {/* BARRA DI RICERCA AVANZATA */}
            <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <form onSubmit={gestisciRicerca} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input name="citta" placeholder="Città" onChange={handleChange} style={inputStyle} />
                    <input name="min" type="number" placeholder="Prezzo Min" onChange={handleChange} style={inputStyle} />
                    <input name="max" type="number" placeholder="Prezzo Max" onChange={handleChange} style={inputStyle} />
                    <select name="contratto" onChange={handleChange} style={inputStyle}>
                        <option value="">Tutti i contratti</option>
                        <option value="VENDITA">Vendita</option>
                        <option value="AFFITTO">Affitto</option>
                    </select>
                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Cerca
                    </button>
                    <button type="button" onClick={caricaDati} style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
                        Reset
                    </button>
                </form>
            </section>

            <hr />

            {/* LISTA IMMOBILI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {immobili.length > 0 ? immobili.map(i => (
                    <div key={i.idImmobile} style={cardStyle}>
                        <Link to={`/immobile/${i.idImmobile}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h3 style={{ margin: '0 0 10px 0' }}>{i.titolo}</h3>
                            <p style={{ color: '#007bff', fontWeight: 'bold' }}>{i.prezzo} €</p>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>{i.citta} ({i.tipoContratto || 'Vendita'})</p>
                        </Link>
                    </div>
                )) : <p>Nessun immobile trovato.</p>}
            </div>
        </div>
    );
};

// Piccoli stili per pulire l'interfaccia
const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flex: '1' };
const cardStyle = { border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'transform 0.2s' };

export default Dashboard;