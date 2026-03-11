import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

export const PropertyForm = ({ initialData, onSubmit, styles, onSave, agentiProps = [], isGestore = false }) => {    
    const [agenti, setAgenti] = useState([]);
    const [formData, setFormData] = useState({
        idAgente: initialData?.agente?.idUtente,
        titolo: '', citta: '', provincia: '', indirizzo: '', prezzo: 0,
        descrizione: '', numeroStanze: 0, classeEnergetica: '', tipoImmobile: '',
        tipoContratto: 'VENDITA', tipoAffitto: '', superficie: 0, stato: 'DISPONIBILE',
        numeroLetti: 0, numeroBagni: 0, piano: 0,
        climatizzazione: false, boxAuto: false, terrazzo: false, ascensore: false,
        portineria: false, giardino: false, piscina: false, superficieGiardino: 0,
        vicinoScuole: false, vicinoParchi: false, vicinoTrasporti: false,
        ...initialData // I dati del DB sovrascriveranno questi, ma solo se presenti
    });

    const [anteprimeEsistenti, setAnteprimeEsistenti] = useState(initialData?.immagini || []);

    // Effetto per resettare se cambia initialData (es. passi da una modifica all'altra)
    useEffect(() => {
        const inizializzaForm = async () => {
            // SCENARIO A: MODIFICA IMMOBILE ESISTENTE
            if (initialData) {
                setFormData({
                    ...initialData,
                    climatizzazione: !!initialData.climatizzazione,
                    boxAuto: !!initialData.boxAuto,
                    terrazzo: !!initialData.terrazzo,
                    ascensore: !!initialData.ascensore,
                    giardino: !!initialData.giardino,
                    piscina: !!initialData.piscina,
                    vicinoScuole: !!initialData.vicinoScuole,
                    vicinoParchi: !!initialData.vicinoParchi,
                    vicinoTrasporti: !!initialData.vicinoTrasporti,
                    portineria: !!initialData.portineria,
                    tipoAffitto: initialData.tipoAffitto || '',
                    descrizione: initialData.descrizione || ''
                });
                setAnteprimeEsistenti(initialData.immagini || []);
            } 
            // SCENARIO B: NUOVO IMMOBILE - RECUPERO ID AGENZIA DALL'AGENTE LOGGATO
            else {
                try {
                    const session = await fetchAuthSession();
                    const token = session.tokens.accessToken.toString();
                    const userId = session.userSub || session.tokens.accessToken.payload.sub;

                    // Chiamata al backend per ottenere il profilo AgenteDTO
                    const res = await axios.get(`http://localhost:8080/api/utente/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (res.data && res.data.idAgenzia) {
                        console.log("Agenzia recuperata dal profilo agente:", res.data.idAgenzia);
                        setFormData(prev => ({
                            ...prev,
                            idAgenzia: res.data.idAgenzia // Imposta l'agenzia reale dell'agente
                        }));
                    }
                } catch (err) {
                    console.error("Errore nel recupero dati agente:", err);
                    // Fallback di sicurezza: se fallisce, non bloccare tutto ma avvisa
                }
            }
        };

        inizializzaForm();
    }, [initialData]);

    useEffect(() => {
        if (isGestore) {
            const caricaAgenti = async () => {
                try {
                    const session = await fetchAuthSession();
                    const token = session.tokens.accessToken.toString();
                    const res = await axios.get('http://localhost:8080/api/gestore/miei-agenti', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setAgenti(res.data);
                } catch (err) {
                    console.error("Errore caricamento agenti", err);
                }
            };
            caricaAgenti();
        }
    }, [isGestore]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
            // Logica vincolo SQL: se cambio in VENDITA, resetto tipoAffitto
            ...(name === 'tipoContratto' && value === 'VENDITA' ? { tipoAffitto: '' } : {})
        }));
    };

    const impostaCopertina = (indexScelto) => {
        const nuoveAnteprime = anteprimeEsistenti.map((img, index) => ({
            ...img,
            copertina: index === indexScelto
        }));
        setAnteprimeEsistenti(nuoveAnteprime);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Aggiungiamo la foto locale come stringa Base64
                setAnteprimeEsistenti(prev => [
                    ...prev, 
                    { 
                        urlImmagine: reader.result, 
                        copertina: prev.length === 0 // Prima foto = Copertina di default
                    }
                ]);
            };
            reader.readAsDataURL(file);
        });
    };

    const rimuoviImmagineEsistente = (idImmagine) => {
        setAnteprimeEsistenti(prev => prev.filter(img => img.idImmagine !== idImmagine));
        // Nota: Qui dovrai gestire la cancellazione effettiva nel backend o inviare 
        // una lista di ID da mantenere al server durante il salvataggio.
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const session = await fetchAuthSession();
            const token = session.tokens.accessToken.toString();
            const userId = session.userSub || session.tokens.accessToken.payload.sub;

            const finalPayload = { 
                ...formData,
                idAgente: userId,
                idAgenzia: parseInt(formData.idAgenzia), 

                immagini: anteprimeEsistenti.map(img => ({
                    idImmagine: img.idImmagine,
                    urlImmagine: img.urlImmagine,
                    copertina: !!img.copertina
                })),

                // Forza la conversione numerica di TUTTI i campi critici
                prezzo: Number(formData.prezzo),
                superficie: Number(formData.superficie),
                superficieGiardino: formData.giardino ? Number(formData.superficieGiardino) : 0,
                numeroStanze: Number(formData.numeroStanze),
                numeroLetti: Number(formData.numeroLetti),
                numeroBagni: Number(formData.numeroBagni),

                // Assicurati che i booleani siano puliti
                giardino: Boolean(formData.giardino),
                piscina: Boolean(formData.piscina),
                climatizzazione: Boolean(formData.climatizzazione),
                boxAuto: Boolean(formData.boxAuto),
                terrazzo: Boolean(formData.terrazzo),
                tipoAffitto: formData.tipoContratto === 'VENDITA' ? null : formData.tipoAffitto,
            };

            console.log("Payload con Agente Loggato:", finalPayload);

            const method = formData.idImmobile ? 'put' : 'post';
            const url = formData.idImmobile 
                ? `http://localhost:8080/api/immobile/${formData.idImmobile}`
                : `http://localhost:8080/api/immobile`;

            console.log("ID Agenzia inviato:", finalPayload.idAgenzia);
            console.log("ID Agente inviato:", finalPayload.idAgente);

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
            alert("Errore: " + (err.response?.data?.message || "Controlla i log di Eclipse"));
        }
    };

    return (
    <div style={styles.formCardStyle}>
        <h3 style={{ marginBottom: '20px', color: '#2C3E50' }}>
            {formData.idImmobile ? `Modifica Immobile: ${formData.titolo}` : 'Carica Nuovo Immobile'}
        </h3>
        
        <form onSubmit={handleSubmit} style={styles.formStyle}>
            
            {/* RIGA 1: TITOLO E PREZZO */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                <div style={{ flex: 2 }}>
                    <label style={labelStyle}>Titolo dell'annuncio</label>
                    <input name="titolo" style={styles.inputStyle} placeholder="Es: Trilocale moderno..." value={formData.titolo} onChange={handleChange} required />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Prezzo (€)</label>
                    <input name="prezzo" type="number" style={styles.inputStyle} placeholder="Prezzo" value={formData.prezzo} onChange={handleChange} required />
                </div>
            </div>

            {/* RIGA 2: INDIRIZZO E CITTÀ */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                <div style={{ flex: 2 }}>
                    <label style={labelStyle}>Indirizzo (Via/Piazza e Civico)</label>
                    <input name="indirizzo" style={styles.inputStyle} placeholder="Via Roma 10" value={formData.indirizzo} onChange={handleChange} required />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Città</label>
                    <input name="citta" style={styles.inputStyle} placeholder="Città" value={formData.citta} onChange={handleChange} required />
                </div>
            </div>

            {/* SCELTA TIPO IMMOBILE - FONDAMENTALE */}
            <div style={{ marginBottom: '20px', padding: '15px', background: '#e9ecef', borderRadius: '8px' }}>
                <label style={{ ...labelStyle, marginTop: 0 }}>Tipo di Proprietà *</label>
                <select 
                    name="tipoImmobile" 
                    value={formData.tipoImmobile} 
                    onChange={handleChange} 
                    style={{ ...styles.inputStyle, border: '2px solid #007bff' }}
                    required
                >
                    <option value="">-- Seleziona se Appartamento o Villa --</option>
                    <option value="APPARTAMENTO">Appartamento</option>
                    <option value="VILLA">Villa</option>
                </select>
            </div>


            {formData.tipoImmobile && (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '20px', 
                    marginBottom: '20px',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef'
                }}>
                    {/* GRUPPO 1 */}
                    <div>
                        <label style={labelStyle}>📐 Superficie (mq)</label>
                        <input name="superficie" type="number" value={formData.superficie} onChange={handleChange} style={styles.inputStyle} required />
                    </div>
                    <div>
                        <label style={labelStyle}>🚪 Stanze</label>
                        <input name="numeroStanze" type="number" value={formData.numeroStanze} onChange={handleChange} style={styles.inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>⚡ Classe Energetica</label>
                        <select name="classeEnergetica" value={formData.classeEnergetica || ''} onChange={handleChange} style={styles.inputStyle}>
                            <option value="">Seleziona...</option>
                            <option value="A4">A4</option>
                            <option value="A">A</option>
                            <option value="G">G</option>
                        </select>
                    </div>

                    {/* GRUPPO 2 */}
                    <div>
                        <label style={labelStyle}>🛌 Letti</label>
                        <input name="numeroLetti" type="number" value={formData.numeroLetti || ''} onChange={handleChange} style={styles.inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>🚿 Bagni</label>
                        <input name="numeroBagni" type="number" value={formData.numeroBagni || ''} onChange={handleChange} style={styles.inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>📌 Stato</label>
                        <select name="stato" value={formData.stato} onChange={handleChange} style={styles.inputStyle}>
                            <option value="DISPONIBILE">Disponibile</option>
                            <option value="VENDUTO">Venduto</option>
                            <option value="AFFITTATO">Affittato</option>
                        </select>
                    </div>

                    {/* GRUPPO 3 */}
                    <div>
                        <label style={labelStyle}>🚗 Box Auto</label>
                        <input name="boxAuto" type="checkbox" checked={!!formData.boxAuto} onChange={handleChange} style={styles.inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>🌡️ Climatizzazione</label>
                        <input name="climatizzazione" type="checkbox" checked={!!formData.climatizzazione} onChange={handleChange} style={styles.inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>🌇 Terrazzo</label>
                        <input name="terrazzo" type="checkbox" checked={!!formData.terrazzo} onChange={handleChange} style={styles.inputStyle} />
                    </div>

                    
                </div>
            )}

            {/* SEZIONE APPARTAMENTO */}
            {formData.tipoImmobile === 'APPARTAMENTO' && (
                <div style={{ ...sectionStyle, borderLeft: '5px solid #3498db' }}>
                    <h4 style={{ color: '#2980b9', marginBottom: '15px' }}>Dettagli Condominio</h4>
                    <div style={{ display: 'flex', gap: '30px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Piano</label>
                            <input name="piano" type="number" value={formData.piano} onChange={handleChange} style={styles.inputStyle} />
                        </div>
                        <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '20px', paddingTop: '25px' }}>
                            <label style={checkboxLabel}><input type="checkbox" name="ascensore" checked={formData.ascensore} onChange={handleChange} /> Ascensore</label>
                            <label style={checkboxLabel}><input type="checkbox" name="portineria" checked={formData.portineria} onChange={handleChange} /> Portineria</label>
                        </div>
                    </div>
                </div>
            )}

            {/* SEZIONE VILLA */}
            {formData.tipoImmobile === 'VILLA' && (
                <div style={{ ...sectionStyle, borderLeft: '5px solid #27ae60' }}>
                    <h4 style={{ color: '#27ae60', marginBottom: '15px' }}>Spazi Esterni</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', gap: '25px' }}>
                            <label style={checkboxLabel}><input type="checkbox" name="giardino" checked={formData.giardino} onChange={handleChange} /> Giardino Privato</label>
                            <label style={checkboxLabel}><input type="checkbox" name="piscina" checked={formData.piscina} onChange={handleChange} /> Piscina</label>
                        </div>
                        {formData.giardino && (
                            <div style={{ maxWidth: '200px', animation: 'fadeIn 0.4s' }}>
                                <label style={labelStyle}>Mq Giardino</label>
                                <input name="superficieGiardino" type="number" value={formData.superficieGiardino} onChange={handleChange} style={styles.inputStyle} />
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* DESCRIZIONE */}
            <div>
                <label style={labelStyle}>Descrizione dell'Annuncio</label>
                <textarea 
                    name="descrizione" 
                    style={descriptionStyle} 
                    value={formData.descrizione || ''} 
                    onChange={handleChange} 
                    placeholder="Descrivi l'immobile qui..."
                />
            </div>

            {/* SEZIONE CONTRATTO */}
            <div>
                <label style={labelStyle}>Tipo Contratto</label>
                <select name="tipoContratto" value={formData.tipoContratto} onChange={handleChange} style={styles.inputStyle}>
                    <option value="VENDITA">Vendita</option>
                    <option value="AFFITTO">Affitto</option>
                </select>
            </div>

            {formData.tipoContratto === 'AFFITTO' && (
                <div>
                    <label style={labelStyle}>Tipo Affitto</label>
                    <select name="tipoAffitto" value={formData.tipoAffitto || ''} onChange={handleChange} style={styles.inputStyle}>
                        <option value="">Seleziona...</option>
                        <option value="MENSILE">Mensile</option>
                        <option value="STUDENTI">Per Studenti</option>
                        <option value="TRANSITORIO">Transitorio</option>
                    </select>
                </div>
            )}

            {/* MOSTRA SELEZIONE AGENTE SOLO SE GESTORE */}
            {isGestore && (
        <div style={sectionStyle}>
             <label style={labelStyle}>Assegna a un Agente</label>
             <select 
                style={styles.inputStyle}
                value={formData.idAgente}
                onChange={(e) => setFormData({...formData, idAgente: e.target.value})}
             >
                <option value="">Seleziona Agente</option>
                {agenti.map(a => (
                    <option key={a.idUtente} value={a.idUtente}>{a.nome} {a.cognome}</option>
                ))}
             </select>
        </div>
    )}

            <hr />

            {/* SEZIONE GALLERIA IMMAGINI */}
            <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' }}>
                <label style={{ ...labelStyle, color: '#2C3E50', fontSize: '14px' }}>📸 Galleria Immagini</label>
                <p style={{ fontSize: '11px', color: '#7f8c8d', marginBottom: '10px' }}>La prima immagine con il bordo oro sarà la copertina.</p>
                
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    {anteprimeEsistenti.map((img, index) => (
                        <div key={index} style={{ 
                            position: 'relative', 
                            border: img.copertina ? '3px solid #f1c40f' : '1px solid #bdc3c7',
                            borderRadius: '6px',
                            padding: '3px',
                            backgroundColor: 'white'
                        }}>
                            {/* RISOLUZIONE WARNING ALT: aggiunto alt="" */}
                            <img 
                                src={img.urlImmagine} 
                                alt={`Anteprima ${index}`} 
                                style={{ width: '120px', height: '90px', borderRadius: '4px', objectFit: 'cover' }} 
                            />
                            
                            <div style={{ textAlign: 'center', marginTop: '5px' }}>
                                <input 
                                    type="radio" 
                                    name="gruppoCopertina" 
                                    checked={!!img.isCopertina}
                                    onChange={() => impostaCopertina(index)}
                                />
                                <span style={{ fontSize: '10px', marginLeft: '3px' }}>Copertina</span>
                            </div>

                            <button 
                                type="button" 
                                onClick={() => rimuoviImmagineEsistente(img.idImmagine)} 
                                style={btnDeleteImg}
                                title="Rimuovi"
                            >
                                ×
                            </button>
                        </div>
                    ))}

                    {/* TASTO AGGIUNGI DA LOCALE */}
                    <label style={btnAddImgStyle}>
                        <span style={{ fontSize: '24px' }}>+</span>
                        <span style={{ fontSize: '11px' }}>Aggiungi Foto</span>
                        <input 
                            type="file" 
                            hidden 
                            multiple 
                            onChange={handleFileChange} 
                            accept="image/*" 
                        />
                    </label>
                </div>
            </div>

            <button type="submit" style={{ ...styles.submitButtonStyle, marginTop: '25px', width: '100%' }}>
                {formData.idImmobile ? '💾 Salva Modifiche' : '🚀 Pubblica Annuncio'}
            </button>
        </form>
    </div>
);
};

// STILI DI SUPPORTO (Aggiungili in fondo al file o fuori dal componente)

const descriptionStyle = {
    width: '100%',
    height: '120px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'none',
    boxSizing: 'border-box',
    display: 'block',
    marginTop: '5px',
    marginBottom: '15px'
};
const sectionStyle = {
    background: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
    marginTop: '10px',
    marginBottom: '10px'
};
const checkboxLabel = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    color: '#2c3e50'
};
const labelStyle = { 
    display: 'block', 
    fontSize: '13px', 
    fontWeight: 'bold', 
    color: '#495057', 
    marginBottom: '5px',
    marginTop: '10px'
};
const btnAddImgStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '120px', height: '90px', border: '2px dashed #BDC3C7', borderRadius: '6px', cursor: 'pointer', color: '#7F8C8D', backgroundColor: '#fff', transition: 'all 0.3s' };
const btnDeleteImg = { position: 'absolute', top: '-8px', right: '-8px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', fontWeight: 'bold' };