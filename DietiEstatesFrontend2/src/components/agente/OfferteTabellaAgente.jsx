import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const TabellaOfferteAgente = ({ modo, onVediStorico }) => {
    const [offerte, setOfferte] = useState([]);
    const [caricamento, setCaricamento] = useState(true);

    const caricaDati = useCallback(async () => {
        setCaricamento(true);
        try {
            const session = await fetchAuthSession();
            const token = session.tokens.accessToken.toString();
            
            const endpoint = modo === "gestione" ? "/offerte/attive" : "/offerte-ricevute";
            const res = await axios.get(`http://localhost:8080/api/agente${endpoint}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOfferte(res.data);
        } catch (err) {
            console.error("Errore caricamento offerte:", err);
        } finally {
            setCaricamento(false);
        }
    }, [modo]);

    useEffect(() => {
        caricaDati();
    }, [caricaDati]);

    const gestisciAzione = async (idOfferta, stato, prezzo = null) => {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens.accessToken.toString();
            await axios.patch(`http://localhost:8080/api/agente/offerte/${idOfferta}`, null, {
                params: { 
                    stato: stato, 
                    prezzo: prezzo, 
                    nota: `Azione eseguita dall'agente in modalità ${modo}` 
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            caricaDati();
        } catch (err) {
            console.error("Errore gestione offerta:", err);
            alert("Errore nell'operazione.");
        }
    };

    return (
        <div style={tabellaContainerStyle}>
            <div style={headerTabellaStyle}>
                <h3 style={{ margin: 0, color: '#1E293B' }}>
                    {modo === "gestione" ? "📋 Offerte da Gestire" : "👁️ Storico Offerte"}
                </h3>
                <span style={badgeConteggioStyle}>{offerte.length} Totali</span>
            </div>

            <div style={scrollContainerStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Immobile</th>
                            <th style={thStyle}>Cliente</th>
                            <th style={thStyle}>Prezzo</th>
                            <th style={thStyle}>Stato</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offerte.length > 0 ? (
                            offerte
                                .filter(o => modo === "gestione" ? o.stato === 'IN_ATTESA' : o.stato !== 'IN_ATTESA')
                                .map(o => (
                                    <tr key={o.idOfferta} style={trStyle}>
                                        <td style={tdStyle}><strong>{o.titoloImmobile}</strong></td>
                                        <td style={tdStyle}>{o.nomeCognomeCliente}</td>
                                        <td style={tdPrezzoStyle}>€ {o.prezzoOfferto?.toLocaleString()}</td>
                                        <td style={tdStyle}>
                                            <span style={statusBadgeStyle(o.stato)}>{o.stato}</span>
                                        </td>
                                        <td style={tdAzioniStyle}>
                                            {modo === "gestione" && (
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={() => gestisciAzione(o.idOfferta, 'ACCETTATA')} style={btnAccettaStyle}>Accetta</button>
                                                    <button onClick={() => gestisciAzione(o.idOfferta, 'RIFIUTATA')} style={btnRifiutaStyle}>Rifiuta</button>
                                                    <button onClick={() => {
                                                        const p = prompt("Inserisci prezzo controfferta:");
                                                        if (p) gestisciAzione(o.idOfferta, 'CONTROFFERTA', p);
                                                    }} style={btnControStyle}>Controfferta</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                                    {caricamento ? "Caricamento in corso..." : "Nessuna offerta trovata."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- STILI ---
const tabellaContainerStyle = { backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' };
const headerTabellaStyle = { padding: '20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC' };
const badgeConteggioStyle = { backgroundColor: '#E0F2FE', color: '#0369A1', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' };
const scrollContainerStyle = { overflowX: 'auto' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
const thStyle = { padding: '16px', backgroundColor: '#F8FAFC', color: '#64748B', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' };
const trStyle = { borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.2s' };
const tdStyle = { padding: '16px', color: '#1E293B', fontSize: '0.95rem' };
const tdPrezzoStyle = { ...tdStyle, fontWeight: 'bold', color: '#0EA5E9' };
const tdAzioniStyle = { padding: '16px', display: 'flex', gap: '10px', alignItems: 'center' };

const btnBase = { padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', transition: 'opacity 0.2s' };
const btnAccettaStyle = { ...btnBase, backgroundColor: '#22C55E', color: 'white' };
const btnRifiutaStyle = { ...btnBase, backgroundColor: '#EF4444', color: 'white' };
const btnControStyle = { ...btnBase, backgroundColor: '#F59E0B', color: 'white' };
const btnLogStyle = { ...btnBase, backgroundColor: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0' };

const statusBadgeStyle = (status) => {
    const config = {
        'ACCETTATA': { bg: '#DCFCE7', color: '#166534' },
        'RIFIUTATA': { bg: '#FEE2E2', color: '#991B1B' },
        'CONTROFFERTA': { bg: '#FEF3C7', color: '#92400E' },
        'IN_ATTESA': { bg: '#E0F2FE', color: '#075985' }
    };
    const s = config[status] || { bg: '#F1F5F9', color: '#475569' };
    return { padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', backgroundColor: s.bg, color: s.color };
};

export default TabellaOfferteAgente;