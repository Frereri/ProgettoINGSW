import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const GestioneOfferteAgente = () => {
    const [offerte, setOfferte] = useState([]);

    const caricaOfferte = async () => {
        const session = await fetchAuthSession();
        const token = session.tokens.accessToken.toString();
        const res = await axios.get("http://localhost:8080/api/agente/offerte-ricevute", {
            headers: { Authorization: `Bearer ${token}` }
        });
        setOfferte(res.data);
    };

    useEffect(() => { caricaOfferte(); }, []);

    const gestisci = async (idOfferta, stato, prezzo = null) => {
        const session = await fetchAuthSession();
        const token = session.tokens.accessToken.toString();
        await axios.patch(`http://localhost:8080/api/agente/offerte/${idOfferta}`, null, {
            params: { stato, prezzo, nota: "Azione eseguita da agente" },
            headers: { Authorization: `Bearer ${token}` }
        });
        alert("Operazione completata!");
        caricaOfferte(); // Ricarica la lista
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Offerte Ricevute</h2>
            <table border="1" style={{ width: '100%', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th>Immobile</th>
                        <th>Cliente</th>
                        <th>Prezzo Offerto</th>
                        <th>Stato</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {offerte.map(o => (
                        <tr key={o.idOfferta}>
                            <td>{o.titoloImmobile}</td>
                            <td>{o.nomeCognomeCliente}</td>
                            <td>€ {o.prezzoOfferto}</td>
                            <td>{o.stato}</td>
                            <td>
                                <button onClick={() => gestisci(o.idOfferta, 'ACCETTATA')}>Accetta</button>
                                <button onClick={() => gestisci(o.idOfferta, 'RIFIUTATA')}>Rifiuta</button>
                                <button onClick={() => {
                                    const p = prompt("Inserisci prezzo controfferta:");
                                    if(p) gestisci(o.idOfferta, 'CONTROFFERTA', p);
                                }}>Controfferta</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GestioneOfferteAgente;