import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const ImmobileForm = ({ initialData, styles, onSave, isGestore = false }) => {
    const [agenti, setAgenti] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        titolo: '',
        prezzo: 0,
        indirizzo: '',
        provincia: '',
        citta: '',
        descrizione: '',
        superficie: 0,
        numeroBagni: 0,
        numeroStanze: 0,
        numeroLetti: 0,
        climatizzazione: false,
        boxAuto: false,
        terrazzo: false,
        classeEnergetica: '',
        stato: 'DISPONIBILE',
        tipoImmobile: '',
        tipoContratto: 'VENDITA',
        tipoAffitto: '',
        piscina: false,
        giardino: false,
        superficieGiardino: 0,
        portineria: false,
        ascensore: false,
        piano: 0,
        idAgente: '',
        idAgenzia: '',
        ...initialData
    });

    const [anteprimeImmagini, setAnteprimeImmagini] = useState(initialData?.immagini || []);

    useEffect(() => {
        const inizializzaDati = async () => {
            try {
                const session = await fetchAuthSession();
                const token = session.tokens.accessToken.toString();
                const userId = session.userSub || session.tokens.accessToken.payload.sub;

                const res = await axios.get(`http://localhost:8080/api/utente/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setFormData(prev => ({
                    ...prev,
                    idAgenzia: res.data.idAgenzia,
                    idAgente: initialData?.idAgente || (isGestore ? '' : userId)
                }));

                if (isGestore) {
                    const resAgenti = await axios.get('http://localhost:8080/api/gestore/miei-agenti', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setAgenti(resAgenti.data);
                }
            } catch (err) {
                console.error("Errore inizializzazione:", err);
            }
        };
        inizializzaDati();
    }, [initialData, isGestore]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAnteprimeImmagini(prev => [
                    ...prev, 
                    { urlImmagine: reader.result, copertina: prev.length === 0 }
                ]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.tipoContratto === 'AFFITTO' && !formData.tipoAffitto) {
            alert("Per favore, seleziona se l'affitto è Giornaliero o Mensile.");
            return;
        }

        setLoading(true);

        try {
            const session = await fetchAuthSession();
            const token = session.tokens.accessToken.toString();
            const userId = session.userSub || session.tokens.accessToken.payload.sub;

            const finalPayload = { 
                ...formData,
                idAgente: isGestore ? formData.idAgente : userId,
                idAgenzia: parseInt(formData.idAgenzia), 

                immagini: anteprimeImmagini.map(img => ({
                    idImmagine: img.idImmagine,
                    urlImmagine: img.urlImmagine,
                    copertina: !!img.copertina
                })),

                prezzo: Number(formData.prezzo),
                superficie: Number(formData.superficie),
                superficieGiardino: formData.giardino ? Number(formData.superficieGiardino) : 0,
                numeroStanze: Number(formData.numeroStanze),
                numeroLetti: Number(formData.numeroLetti),
                numeroBagni: Number(formData.numeroBagni),
                piano: Number(formData.piano),

                giardino: Boolean(formData.giardino),
                piscina: Boolean(formData.piscina),
                climatizzazione: Boolean(formData.climatizzazione),
                boxAuto: Boolean(formData.boxAuto),
                terrazzo: Boolean(formData.terrazzo),
                ascensore: Boolean(formData.ascensore),
                portineria: Boolean(formData.portineria),
                
                tipoAffitto: formData.tipoContratto === 'VENDITA' ? null : formData.tipoAffitto,
            };

            const method = formData.idImmobile ? 'put' : 'post';
            const url = formData.idImmobile 
                ? `http://localhost:8080/api/immobile/${formData.idImmobile}`
                : `http://localhost:8080/api/immobile`;

            await axios[method](url, finalPayload, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                }
            });

            alert("Salvataggio completato!");
            if (onSave) onSave();

        } catch (err) {
            console.error("Dettaglio Errore:", err.response?.data);
            alert("Errore: " + (err.response?.data?.message || "Errore durante il salvataggio"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.formCardStyle}>
            <h3 style={{ color: '#2C3E50', textAlign: 'center' }}>
                {formData.idImmobile ? 'Modifica Immobile' : 'Nuovo Annuncio'}
            </h3>
            
            <form onSubmit={handleSubmit} style={styles.formStyle}>
                {/* Sezione Base */}
                <div style={rowStyle}>
                    <div style={{ flex: 2 }}>
                        <label style={labelStyle}>Titolo Annuncio</label>
                        <input name="titolo" style={styles.inputStyle} value={formData.titolo} onChange={handleChange} required />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Prezzo (€)</label>
                        <input name="prezzo" type="number" style={styles.inputStyle} value={formData.prezzo} onChange={handleChange} required />
                    </div>
                </div>

                {/* Localizzazione */}
                <div style={rowStyle}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Indirizzo</label>
                        <input name="indirizzo" style={styles.inputStyle} value={formData.indirizzo} onChange={handleChange} required />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Città</label>
                        <input name="citta" style={styles.inputStyle} value={formData.citta} onChange={handleChange} required />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Provincia</label>
                        <input name="provincia" style={styles.inputStyle} value={formData.provincia} onChange={handleChange} maxLength="2" required />
                    </div>
                </div>

                {/* Caratteristiche Tecniche */}
                <div style={gridStyle}>
                    <div>
                        <label style={labelStyle}>Mq</label>
                        <input name="superficie" type="number" style={styles.inputStyle} value={formData.superficie} onChange={handleChange} />
                    </div>
                    <div>
                        <label style={labelStyle}>Stanze</label>
                        <input name="numeroStanze" type="number" style={styles.inputStyle} value={formData.numeroStanze} onChange={handleChange} />
                    </div>
                    <div>
                        <label style={labelStyle}>Letti</label>
                        <input name="numeroLetti" type="number" style={styles.inputStyle} value={formData.numeroLetti} onChange={handleChange} />
                    </div>
                    <div>
                        <label style={labelStyle}>Bagni</label>
                        <input name="numeroBagni" type="number" style={styles.inputStyle} value={formData.numeroBagni} onChange={handleChange} />
                    </div>
                    <div>
                        <label style={labelStyle}>Classe Energetica</label>
                        <select name="classeEnergetica" style={styles.inputStyle} value={formData.classeEnergetica} onChange={handleChange}>
                            <option value="">Seleziona...</option>
                            <option value="A4">A4</option><option value="A">A</option><option value="B">B</option>
                            <option value="C">C</option><option value="D">D</option><option value="E">E</option>
                            <option value="F">F</option><option value="G">G</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Stato</label>
                        <select name="stato" style={styles.inputStyle} value={formData.stato} onChange={handleChange}>
                            <option value="DISPONIBILE">Disponibile</option>
                            <option value="TRATTATIVA">In Trattativa</option>
                            <option value="VENDUTO">Venduto/Affittato</option>
                        </select>
                    </div>
                </div>

                {/* Dotazioni */}
                <div style={rowStyle}>
                    <label style={checkboxLabel}><input type="checkbox" name="climatizzazione" checked={formData.climatizzazione} onChange={handleChange} /> Climatizzazione</label>
                    <label style={checkboxLabel}><input type="checkbox" name="boxAuto" checked={formData.boxAuto} onChange={handleChange} /> Box Auto</label>
                    <label style={checkboxLabel}><input type="checkbox" name="terrazzo" checked={formData.terrazzo} onChange={handleChange} /> Terrazzo</label>
                </div>

                {/* Tipologia Immobile - Campi Condizionali */}
                <div style={sectionStyle}>
                    <label style={labelStyle}>Tipo Immobile *</label>
                    <select name="tipoImmobile" style={styles.inputStyle} value={formData.tipoImmobile} onChange={handleChange} required>
                        <option value="">Seleziona...</option>
                        <option value="APPARTAMENTO">Appartamento</option>
                        <option value="VILLA">Villa</option>
                    </select>

                    {formData.tipoImmobile === 'VILLA' && (
                        <div style={{ marginTop: '10px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <label style={checkboxLabel}><input type="checkbox" name="piscina" checked={formData.piscina} onChange={handleChange} /> Piscina</label>
                            <label style={checkboxLabel}><input type="checkbox" name="giardino" checked={formData.giardino} onChange={handleChange} /> Giardino</label>
                            {formData.giardino && (
                                <input name="superficieGiardino" type="number" placeholder="Mq Giardino" style={{...styles.inputStyle, width: '150px'}} value={formData.superficieGiardino} onChange={handleChange} />
                            )}
                        </div>
                    )}

                    {formData.tipoImmobile === 'APPARTAMENTO' && (
                        <div style={{ marginTop: '10px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <label style={labelStyle}>Piano</label>
                            <input name="piano" type="number" style={{...styles.inputStyle, width: '80px'}} value={formData.piano} onChange={handleChange} />
                            <label style={checkboxLabel}><input type="checkbox" name="ascensore" checked={formData.ascensore} onChange={handleChange} /> Ascensore</label>
                            <label style={checkboxLabel}><input type="checkbox" name="portineria" checked={formData.portineria} onChange={handleChange} /> Portineria</label>
                        </div>
                    )}
                </div>

                {/* Contratto */}
                <div style={rowStyle}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Tipo Contratto</label>
                        <select name="tipoContratto" style={styles.inputStyle} value={formData.tipoContratto} onChange={handleChange}>
                            <option value="VENDITA">Vendita</option>
                            <option value="AFFITTO">Affitto</option>
                        </select>
                    </div>
                    {formData.tipoContratto === 'AFFITTO' && (
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Tipo Affitto</label>
                            <select name="tipoAffitto" style={styles.inputStyle} value={formData.tipoAffitto} onChange={handleChange}>
                                <option value="">Seleziona...</option>
                                <option value="GIORNALIERO">Giornaliero</option>
                                <option value="MENSILE">Mensile</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Descrizione */}
                <label style={labelStyle}>Descrizione</label>
                <textarea name="descrizione" style={{ ...styles.inputStyle, height: '100px', resize: 'vertical' }} value={formData.descrizione} onChange={handleChange} />

                {/* Selezione Agente (Solo Gestore) */}
                {isGestore && (
                    <div style={sectionStyle}>
                        <label style={labelStyle}>Assegna Agente Collaboratore</label>
                        <select name="idAgente" style={styles.inputStyle} value={formData.idAgente} onChange={handleChange} required>
                            <option value="">Scegli un agente...</option>
                            {agenti.map(a => <option key={a.idUtente} value={a.idUtente}>{a.nome} {a.cognome}</option>)}
                        </select>
                    </div>
                )}

                {/* Galleria */}
                <div style={sectionStyle}>
                    <label style={labelStyle}>Immagini</label>
                    <input type="file" multiple onChange={handleFileChange} accept="image/*" />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                        {anteprimeImmagini.map((img, idx) => (
                            <img key={idx} src={img.urlImmagine} alt="preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                        ))}
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    style={{ 
                        ...styles.submitButtonStyle, 
                        width: '100%', 
                        marginTop: '20px',
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}
                >
                    {loading && <div className="loading-spinner"></div>}
                    {loading ? 'Elaborazione...' : (formData.idImmobile ? 'Salva Modifiche' : 'Pubblica Immobile')}
                </button>
            </form>
            <style>
                {`
                    .loading-spinner {
                        width: 18px;
                        height: 18px;
                        border: 2px solid #ffffff;
                        border-radius: 50%;
                        border-top-color: transparent;
                        animation: spin 0.8s linear infinite;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}
                </style>
        </div>
    );
};

// Stili di supporto locali
const rowStyle = { display: 'flex', gap: '15px', marginBottom: '15px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '15px' };
const sectionStyle = { padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '15px', border: '1px solid #eee' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#444', marginBottom: '5px' };
const checkboxLabel = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' };

export default ImmobileForm;