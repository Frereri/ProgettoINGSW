import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const OffertaManualeForm = ({ styles }) => {
    const [immobili, setImmobili] = useState([]);
    const [formData, setFormData] = useState({
        idImmobile: '', 
        nomeCognomeCliente: '',
        prezzoOfferto: ''
    });

    useEffect(() => {
        const caricaImmobili = async () => {
            try {
                const session = await fetchAuthSession();
                const token = session.tokens.accessToken.toString();
                const res = await axios.get("http://localhost:8080/api/immobile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Immobili caricati dal server:", res.data); // Verifica qui i nomi dei campi
                setImmobili(res.data);
            } catch (err) { console.error("Errore fetch:", err); }
        };
        caricaImmobili();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const idSelezionato = parseInt(formData.idImmobile, 10);

        if (isNaN(idSelezionato)) {
            alert("Seleziona un immobile.");
            return;
        }

        try {
            const session = await fetchAuthSession();
            const token = session.tokens.accessToken.toString();

            const payload = {
                idImmobile: idSelezionato,
                prezzoOfferto: parseFloat(formData.prezzoOfferto),
                nomeCognomeCliente: formData.nomeCognomeCliente, // Questo deve diventare nomeClienteEsterno nel Service
                offertaEsterna: true, // QUESTO DEVE ESSERE TRUE PER IL DB
                idCliente: null,
                stato: "IN_ATTESA"
            };

            console.log("Payload inviato:", payload);

            await axios.post("http://localhost:8080/api/offerta", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Offerta registrata!");
            setFormData({ idImmobile: '', nomeCognomeCliente: '', prezzoOfferto: '' });
        } catch (err) {
            console.error("Errore 500:", err.response?.data);
            alert("Errore coerenza dati: verifica che il backend imposti offerta_esterna a TRUE");
        }
    };

    return (
        <div style={styles.formCardStyle}>
            <h3>⌨️ Registra Offerta Manuale</h3>
            <form onSubmit={handleSubmit} style={styles.formStyle}>
                <label>Immobile:</label>
                <select 
                    style={styles.inputStyle} 
                    value={formData.idImmobile}
                    onChange={(e) => {
                        console.log("Valore selezionato nella select:", e.target.value);
                        setFormData({...formData, idImmobile: e.target.value});
                    }}
                    required
                >
                    <option value="">-- Seleziona --</option>
                    {immobili.map((imm) => (
                        <option key={imm.id || imm.idImmobile} value={imm.id || imm.idImmobile}>
                            {imm.indirizzo || "Senza indirizzo"}
                        </option>
                    ))}
                </select>

                <label>Cliente:</label>
                <input 
                    style={styles.inputStyle} 
                    placeholder="Nome e Cognome" 
                    value={formData.nomeCognomeCliente}
                    onChange={e => setFormData({...formData, nomeCognomeCliente: e.target.value})}
                    required
                />

                <label>Prezzo:</label>
                <input 
                    style={styles.inputStyle} 
                    type="number" 
                    placeholder="Prezzo Offerto" 
                    value={formData.prezzoOfferto}
                    onChange={e => setFormData({...formData, prezzoOfferto: e.target.value})}
                    required
                />

                <button type="submit" style={styles.submitButtonStyle}>Invia</button>
            </form>
        </div>
    );
};

export default OffertaManualeForm;