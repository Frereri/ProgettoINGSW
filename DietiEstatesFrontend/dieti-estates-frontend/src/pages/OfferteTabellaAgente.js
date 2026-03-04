import React, { useEffect, useState, useCallback } from 'react';import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';

const OfferteTabellaAgente = ({ modo }) => {
    const [offerte, setOfferte] = useState([]);
    const navigate = useNavigate();

    const caricaData = useCallback(async () => {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens.accessToken.toString();
            
            // QUI: Se modo è "gestione", deve puntare all'endpoint FILTRATO (/offerte/attive)
            // Se modo è "storico", punta a quello totale (/offerte/tutte)
            const endpoint = modo === "gestione" ? "/offerte/attive" : "/offerte/tutte";
            const res = await axios.get(`http://localhost:8080/api/agente${endpoint}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOfferte(res.data);
        } catch (err) {
            console.error("Errore:", err);
        }
    }, [modo]);

    useEffect(() => {
        caricaData();
    }, [caricaData, modo]);

    const gestisci = async (idOfferta, stato, prezzo = null) => {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens.accessToken.toString();
            await axios.patch(`http://localhost:8080/api/agente/offerte/${idOfferta}`, null, {
                params: { 
                    stato: stato, 
                    prezzo: prezzo, 
                    nota: `Azione eseguita in modalità ${modo}` 
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Operazione completata con successo!");
            caricaData(); // Rinfresca la lista
        } catch (err) {
            console.error("Errore durante la gestione offerta:", err);
            alert("Errore nell'operazione.");
        }
    };

    return (
        <div style={{ padding: '40px', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
            <button onClick={() => navigate('/agente')} style={{ marginBottom: '20px' }}>← Torna alla Dashboard</button>
            <h2 style={{ color: '#2C3E50' }}>
                {modo === "gestione" ? "📋 Gestione Offerte Attive" : "👁️ Storico Globale Offerte"}
            </h2>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <thead>
                    <tr style={{ backgroundColor: '#5DADE2', color: 'white' }}>
                        <th style={{ padding: '12px' }}>Immobile</th>
                        <th style={{ padding: '12px' }}>Cliente</th>
                        <th style={{ padding: '12px' }}>Prezzo</th>
                        <th style={{ padding: '12px' }}>Stato</th>
                        <th style={{ padding: '12px' }}>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {offerte.length > 0 ? (
                        offerte
                            .filter(o => {
                                if (modo === "gestione") {
                                    // MOSTRA SOLO QUELLE DA GESTIRE
                                    // Se l'agente ha già fatto una controfferta, la palla è al cliente, 
                                    // quindi l'agente non la vede più in "Gestione" ma solo nello "Storico"
                                    return o.stato === 'IN_ATTESA';
                                } else {
                                    // STORICO: Mostra tutto ciò che NON è in attesa (quelle concluse o in negoziazione)
                                    return o.stato === 'ACCETTATA' || o.stato === 'RIFIUTATA' || o.stato === 'CONTROFFERTA';
                                }
                            })
                            .map(o => (
                                <tr key={o.idOfferta} style={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                                    <td style={{ padding: '12px' }}>{o.titoloImmobile}</td>
                                    <td style={{ padding: '12px' }}>{o.nomeCognomeCliente}</td>
                                    <td style={{ padding: '12px' }}>€ {o.prezzoOfferto}</td>
                                    <td style={{ padding: '12px' }}>
                                        {/* Usa la funzione statusBadgeStyle che abbiamo definito prima */}
                                        <span style={statusBadgeStyle(o.stato)}>{o.stato}</span>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        {/* AZIONI: Solo se siamo in gestione e lo stato è IN_ATTESA */}
                                        {modo === "gestione" && o.stato === 'IN_ATTESA' && (
                                            <>
                                                <button onClick={() => gestisci(o.idOfferta, 'ACCETTATA')}>Accetta</button>
                                                <button onClick={() => gestisci(o.idOfferta, 'RIFIUTATA')}>Rifiuta</button>
                                                <button onClick={() => {
                                                    const p = prompt("Inserisci il prezzo della controfferta:");
                                                    if (p) gestisci(o.idOfferta, 'CONTROFFERTA', p);
                                                }}>Controfferta</button>
                                            </>
                                        )}
                                        <button onClick={() => navigate(`/storico/${o.idOfferta}`)}>📜 Vedi Log</button>
                                    </td>
                                </tr>
                            ))
                    ) : (
                        <tr><td colSpan="5" style={{ padding: '20px' }}>Nessuna offerta trovata in questa sezione.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};


const statusBadgeStyle = (status) => {
    let bg = '#eee';
    let color = '#333';

    switch (status) {
        case 'ACCETTATA':
            bg = '#D4EFDF'; color = '#1E8449';
            break;
        case 'RIFIUTATA':
            bg = '#FADBD8'; color = '#943126';
            break;
        case 'CONTROFFERTA':
            bg = '#FEF5E7'; color = '#AF601A';
            break;
        case 'IN_ATTESA':
            bg = '#EBF5FB'; color = '#2E86C1';
            break;
        default:
            bg = '#eee'; color = '#333';
    }

    return {
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.85rem',
        backgroundColor: bg,
        color: color,
        fontWeight: 'bold',
        display: 'inline-block'
    };
};

export default OfferteTabellaAgente;