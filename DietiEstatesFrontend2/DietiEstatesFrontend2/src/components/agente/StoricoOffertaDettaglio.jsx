import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const StoricoOffertaDettaglio = ({ idOfferta, onChiudi }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStorico = async () => {
            try {
                const session = await fetchAuthSession();
                const token = session.tokens.accessToken.toString();
                const res = await axios.get(`http://localhost:8080/api/agente/offerte/${idOfferta}/storico`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLogs(res.data);
            } catch (err) {
                console.error("Errore storico:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStorico();
    }, [idOfferta]);

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <div style={modalHeaderStyle}>
                    <h3 style={{ margin: 0 }}>📜 Cronologia Offerta #{idOfferta}</h3>
                    <button onClick={onChiudi} style={closeBtnStyle}>✕</button>
                </div>
                
                <div style={timelineContainerStyle}>
                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#64748B' }}>Caricamento in corso...</p>
                    ) : logs.length > 0 ? (
                        logs.map((log, index) => (
                            <div key={log.idLog} style={logItemStyle}>
                                <div style={dotStyle(index === 0)} />
                                <div style={logContentStyle}>
                                    <div style={logDateStyle}>{new Date(log.dataAzione).toLocaleString('it-IT')}</div>
                                    <div style={logStateStyle}>
                                        <span style={oldStateStyle}>{log.statoPrecedente}</span> 
                                        <span style={{ margin: '0 8px', color: '#94A3B8' }}>→</span>
                                        <span style={newStateStyle}>{log.nuovoStato}</span>
                                    </div>
                                    {log.nota && <div style={logNotaStyle}>"{log.nota}"</div>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#64748B' }}>Nessun log disponibile.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- STILI ---
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: 'white', borderRadius: '20px', width: '90%', maxWidth: '500px', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' };
const modalHeaderStyle = { padding: '20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const closeBtnStyle = { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94A3B8' };

const timelineContainerStyle = { padding: '25px', overflowY: 'auto', flex: 1 };
const logItemStyle = { display: 'flex', gap: '20px', marginBottom: '25px', position: 'relative' };
const dotStyle = (isFirst) => ({ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: isFirst ? '#0EA5E9' : '#E2E8F0', marginTop: '6px', zIndex: 2, border: '2px solid white', boxShadow: '0 0 0 2px ' + (isFirst ? '#0EA5E9' : '#E2E8F0') });

const logContentStyle = { flex: 1 };
const logDateStyle = { fontSize: '0.75rem', color: '#94A3B8', fontWeight: 'bold', marginBottom: '4px' };
const logStateStyle = { fontSize: '0.9rem', fontWeight: '600', color: '#1E293B' };
const oldStateStyle = { color: '#64748B', textDecoration: 'line-through' };
const newStateStyle = { color: '#0EA5E9' };
const logNotaStyle = { marginTop: '8px', padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '8px', fontSize: '0.85rem', color: '#475569', fontStyle: 'italic', borderLeft: '3px solid #E2E8F0' };

export default StoricoOffertaDettaglio;