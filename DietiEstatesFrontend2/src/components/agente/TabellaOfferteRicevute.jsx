import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const TabellaOfferteRicevute = () => {
    const [offerte, setOfferte] = useState([]);
    const [loading, setLoading] = useState(true);

    const caricaOfferte = async () => {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens.accessToken.toString();
            const res = await axios.get("http://localhost:8080/api/agente/offerte-ricevute", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOfferte(res.data);
        } catch (err) {
            console.error("Errore caricamento offerte:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { caricaOfferte(); }, []);

    const gestisciAzione = async (idOfferta, stato, prezzo = null) => {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens.accessToken.toString();
            await axios.patch(`http://localhost:8080/api/agente/offerte/${idOfferta}`, null, {
                params: { stato, prezzo, nota: "Gestione tramite pannello offerte ricevute" },
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Stato offerta aggiornato!");
            caricaOfferte();
        } catch (err) {
            alert("Errore durante l'operazione.");
        }
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h3 style={{ margin: 0, color: '#1E293B' }}>📩 Offerte Ricevute</h3>
                <p style={{ margin: '5px 0 0 0', color: '#64748B', fontSize: '0.9rem' }}>
                    Gestisci le proposte economiche inviate dai clienti.
                </p>
            </div>

            <div style={tableWrapperStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Immobile</th>
                            <th style={thStyle}>Cliente</th>
                            <th style={thStyle}>Proposta</th>
                            <th style={thStyle}>Stato attuale</th>
                            <th style={thStyle}>Azioni rapida</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offerte.length > 0 ? (
                            offerte.map(o => (
                                <tr key={o.idOfferta} style={trStyle}>
                                    <td style={tdStyle}><strong>{o.titoloImmobile}</strong></td>
                                    <td style={tdStyle}>{o.nomeCognomeCliente}</td>
                                    <td style={tdPrezzoStyle}>€ {o.prezzoOfferto?.toLocaleString()}</td>
                                    <td style={tdStyle}>
                                        <span style={statusBadgeStyle(o.stato)}>{o.stato}</span>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => gestisciAzione(o.idOfferta, 'ACCETTATA')} style={btnAccetta}>✓</button>
                                            <button onClick={() => gestisciAzione(o.idOfferta, 'RIFIUTATA')} style={btnRifiuta}>✕</button>
                                            <button onClick={() => {
                                                const p = prompt("Importo controfferta (€):");
                                                if(p) gestisciAzione(o.idOfferta, 'CONTROFFERTA', p);
                                            }} style={btnContro}>⇄</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={tdEmptyStyle}>
                                    {loading ? "Caricamento..." : "Nessuna offerta da visualizzare."}
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
const containerStyle = { backgroundColor: 'white', borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden' };
const headerStyle = { padding: '25px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' };
const tableWrapperStyle = { overflowX: 'auto' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
const thStyle = { padding: '16px', backgroundColor: '#F8FAFC', color: '#64748B', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' };
const trStyle = { borderBottom: '1px solid #F1F5F9' };
const tdStyle = { padding: '16px', color: '#1E293B', fontSize: '0.95rem' };
const tdPrezzoStyle = { ...tdStyle, fontWeight: 'bold', color: '#0EA5E9' };
const tdEmptyStyle = { padding: '40px', textAlign: 'center', color: '#94A3B8' };

const btnBase = { width: '35px', height: '35px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold', transition: 'transform 0.1s' };
const btnAccetta = { ...btnBase, backgroundColor: '#DCFCE7', color: '#166534' };
const btnRifiuta = { ...btnBase, backgroundColor: '#FEE2E2', color: '#991B1B' };
const btnContro = { ...btnBase, backgroundColor: '#FEF3C7', color: '#92400E' };

const statusBadgeStyle = (status) => {
    const colors = {
        'ACCETTATA': { bg: '#DCFCE7', text: '#166534' },
        'RIFIUTATA': { bg: '#FEE2E2', text: '#991B1B' },
        'IN_ATTESA': { bg: '#E0F2FE', text: '#075985' }
    };
    const c = colors[status] || { bg: '#F1F5F9', text: '#475569' };
    return { padding: '5px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: c.bg, color: c.text };
};

export default TabellaOfferteRicevute;