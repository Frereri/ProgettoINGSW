import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const StoricoOffertaDettaglio = ({ idOfferta }) => {

    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchStorico = async () => {
            const session = await fetchAuthSession();
            const token = session.tokens.accessToken.toString();
            const res = await axios.get(`http://localhost:8080/api/agente/offerte/${idOfferta}/storico`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data);
        };
        fetchStorico();
    }, [idOfferta]);

    return (
        <div style={{ padding: '20px' }}>
            <h3>Cronologia Offerta #{idOfferta}</h3>
            <ul>
                {logs.map(log => (
                    <li key={log.idLog}>
                        <strong>{log.dataAzione}</strong>: {log.statoPrecedente} → {log.nuovoStato} 
                        <br/> <small>{log.nota}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StoricoOffertaDettaglio;