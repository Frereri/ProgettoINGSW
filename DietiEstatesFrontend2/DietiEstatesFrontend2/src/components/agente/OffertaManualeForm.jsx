import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const OffertaManualeForm = ({ styles }) => {
    const [immobili, setImmobili] = useState([]);
    const [loading, setLoading] = useState(false);
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
                setImmobili(res.data);
            } catch (err) { 
                console.error("Errore nel caricamento degli immobili:", err); 
            }
        };
        caricaImmobili();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const idSelezionato = parseInt(formData.idImmobile, 10);

        if (isNaN(idSelezionato)) {
            alert("Per favore, seleziona un immobile valido.");
            return;
        }

        setLoading(true);
        try {
            const session = await fetchAuthSession();
            const token = session.tokens.accessToken.toString();

            const payload = {
                idImmobile: idSelezionato,
                prezzoOfferto: parseFloat(formData.prezzoOfferto),
                nomeCognomeCliente: formData.nomeCognomeCliente,
                offertaEsterna: true,
                idCliente: null,
                stato: "IN_ATTESA"
            };

            await axios.post("http://localhost:8080/api/offerta", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Offerta registrata con successo!");
            setFormData({ idImmobile: '', nomeCognomeCliente: '', prezzoOfferto: '' });
        } catch (err) {
            console.error("Errore durante l'invio:", err.response?.data);
            alert("Errore nel salvataggio. Verifica la connessione o la coerenza dei dati.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.formCardStyle}>
            <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '2rem' }}>⌨️</div>
            <h3 style={formTitleStyle}>Registrazione Manuale</h3>
            <p style={formSubtitleStyle}>Inserisci un'offerta ricevuta fuori dalla piattaforma (es. telefonica o in ufficio).</p>

            <form onSubmit={handleSubmit} style={styles.formStyle}>
                {/* Selezione Immobile */}
                <div style={inputGroupStyle}>
                    <label style={styles.inputLabelStyle}>Seleziona Immobile</label>
                    <select 
                        style={styles.inputStyle} 
                        value={formData.idImmobile}
                        onChange={(e) => setFormData({...formData, idImmobile: e.target.value})}
                        required
                    >
                        <option value="">-- Scegli un immobile dalla lista --</option>
                        {immobili.map((imm) => (
                            <option key={imm.idImmobile || imm.id} value={imm.idImmobile || imm.id}>
                                {imm.titolo} - {imm.indirizzo} ({imm.citta})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Nome Cliente */}
                <div style={inputGroupStyle}>
                    <label style={styles.inputLabelStyle}>Nominativo Cliente</label>
                    <input 
                        style={styles.inputStyle} 
                        placeholder="Es: Mario Rossi" 
                        value={formData.nomeCognomeCliente}
                        onChange={e => setFormData({...formData, nomeCognomeCliente: e.target.value})}
                        required
                    />
                </div>

                {/* Prezzo */}
                <div style={inputGroupStyle}>
                    <label style={styles.inputLabelStyle}>Cifra Offerta (€)</label>
                    <input 
                        style={styles.inputStyle} 
                        type="number" 
                        placeholder="Inserisci l'importo" 
                        value={formData.prezzoOfferto}
                        onChange={e => setFormData({...formData, prezzoOfferto: e.target.value})}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                        ...styles.submitButtonStyle,
                        backgroundColor: loading ? '#94A3B8' : '#0F172A',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Registrazione...' : 'Registra Offerta'}
                </button>
            </form>
        </div>
    );
};

// --- STILI LOCALI PER IL REFACTOR ---
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };

const formTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: '10px',
    textAlign: 'center'
};

const formSubtitleStyle = {
    fontSize: '0.9rem',
    color: '#64748B',
    marginBottom: '30px',
    textAlign: 'center',
    lineHeight: '1.5'
};

export default OffertaManualeForm;