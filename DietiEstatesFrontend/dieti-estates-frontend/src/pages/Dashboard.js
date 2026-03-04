import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Aggiunto useNavigate qui
import immobileService from '../services/immobileService';
import Logo from '../components/Logo.js';
import { fetchAuthSession } from 'aws-amplify/auth';
const Navbar = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null); // Memorizziamo il ruolo

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const session = await fetchAuthSession();
            // Controlliamo che i token siano validi e presenti
            if (session && session.tokens) {
                const groups = session.tokens.accessToken.payload['cognito:groups'] || [];
                
                // Debug: vedi cosa arriva esattamente da Cognito
                console.log("Gruppi da Cognito:", groups);

                if (groups.includes('Gestori')) {
                    setUserRole('GESTORI');
                } else if (groups.includes('Clienti')) {
                    setUserRole('CLIENTI');
                }
            } else {
                // Se non c'è sessione, resettiamo il ruolo
                setUserRole(null);
            }
        } catch (err) {
            console.log("Nessuna sessione attiva");
            setUserRole(null);
        }
    };

    const handleAreaPersonale = () => {
        console.log("Ruolo attuale in stato:", userRole);
        if (userRole === 'AMMINISTRATORE') navigate('/admin');
        else if (userRole === 'CLIENTI') navigate('/cliente');
        else if (userRole === 'GESTORI') navigate('/gestore');
        else if (userRole === 'SUPPORTO') navigate('/supportp');
        else if (userRole === 'AGENTI') navigate('/agente');
        else {
            navigate('/'); 
            console.warn("Nessuna corrispondenza trovata per il ruolo:", userRole   );
            alert("Ruolo non riconosciuto. Controlla la console.");
        }
    };

    return (
        <nav style={navStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                <Logo width="40px" height="40px" />
                <h2 style={{ margin: 0 }}>DietiEstates25</h2>
            </div>

            {userRole ? (
                /* Se loggato, mostriamo il tasto Area Personale */
                <button onClick={handleAreaPersonale} style={areaPersonaleStyle}>
                    👤 La mia Area
                </button>
            ) : (
                /* Se non loggato, mostriamo Accedi */
                <button onClick={() => navigate('/login')} style={loginButtonStyle}>
                    Accedi / Registrati
                </button>
            )}
        </nav>
    );
};

const Dashboard = () => {
    const [immobili, setImmobili] = useState([]);
    const [page, setPage] = useState(0); // Stato per la pagina attuale
    const [totalPages, setTotalPages] = useState(0); // Per sapere quante pagine ci sono
    
    const [filters, setFilters] = useState({
        citta: '',
        min: 0,
        max: 9999999,
        contratto: ''
    });

    useEffect(() => {
        caricaDati(0); // Carica la prima pagina all'avvio
    }, []);

    // Modificata per supportare la paginazione
    const caricaDati = (p) => {
        setPage(p);
        // Passiamo page e size (es. 10 immobili per volta)
        immobileService.getAllImmobili(p, 10) 
            .then(res => {
                // Se il backend restituisce un oggetto Page di Spring:
                setImmobili(res.data.content || res.data); 
                setTotalPages(res.data.totalPages || 0);
            })
            .catch(err => alert("Errore: " + err.message));
    };

    const gestisciRicerca = (e) => {
        e.preventDefault();
        immobileService.searchImmobili(filters)
            .then(res => setImmobili(res.data.content || res.data))
            .catch(err => console.error(err));
    };

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
            {/* 1. Inseriamo la Navbar qui! */}
            <Navbar />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                {/* BARRA DI RICERCA */}
                <section style={filterSectionStyle}>
                    <form onSubmit={gestisciRicerca} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <input name="citta" placeholder="Città" onChange={handleChange} style={inputStyle} />
                        <input name="min" type="number" placeholder="Prezzo Min" onChange={handleChange} style={inputStyle} />
                        <input name="max" type="number" placeholder="Prezzo Max" onChange={handleChange} style={inputStyle} />
                        <select name="contratto" onChange={handleChange} style={inputStyle}>
                            <option value="">Tutti i contratti</option>
                            <option value="VENDITA">Vendita</option>
                            <option value="AFFITTO">Affitto</option>
                        </select>
                        <button type="submit" style={searchButtonStyle}>Cerca</button>
                    </form>
                </section>

                {/* LISTA IMMOBILI */}
                <div style={gridStyle}>
                    {immobili.length > 0 ? immobili.map(i => (
                        <div key={i.idImmobile} style={cardStyle}>
                            <Link to={`/immobile/${i.idImmobile}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={imagePlaceholderStyle}>Foto Immobile</div>
                                <h3 style={{ margin: '10px 0' }}>{i.titolo}</h3>
                                <p style={{ color: '#2C3E50', fontWeight: 'bold', fontSize: '1.2rem' }}>{i.prezzo} €</p>
                                <p style={{ color: '#666' }}>{i.citta}</p>
                            </Link>
                        </div>
                    )) : <p>Nessun immobile trovato.</p>}
                </div>

                {/* 2. CONTROLLI PAGINAZIONE */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
                        <button disabled={page === 0} onClick={() => caricaDati(page - 1)}>Precedente</button>
                        <span>Pagina {page + 1} di {totalPages}</span>
                        <button disabled={page >= totalPages - 1} onClick={() => caricaDati(page + 1)}>Successiva</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- STILI ---

const areaPersonaleStyle = {
    padding: '10px 20px',
    backgroundColor: '#3498DB',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold'
};

const navStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '15px 50px', 
    backgroundColor: '#2C3E50', 
    color: 'white', 
    alignItems: 'center',
    marginBottom: '20px' 
};

const loginButtonStyle = {
    padding: '8px 20px', 
    backgroundColor: '#5DADE2', 
    border: 'none',
    borderRadius: '5px', 
    color: 'white', 
    cursor: 'pointer', 
    fontWeight: 'bold'
};


const filterSectionStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' };
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', flex: '1', minWidth: '150px' };
const cardStyle = { backgroundColor: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'transform 0.2s' };
const imagePlaceholderStyle = { width: '100%', height: '150px', backgroundColor: '#eee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' };
const searchButtonStyle = { padding: '10px 25px', backgroundColor: '#2C3E50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };

export default Dashboard;