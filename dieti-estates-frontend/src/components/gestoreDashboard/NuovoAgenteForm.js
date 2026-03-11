import React, { useState } from 'react';
import { registraNuovoAgente } from '../../services/gestoreService';

const NuovoAgenteForm = ({ onSave, styles }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        cognome: '',
        email: '',
        ruolo: 'AGENTE' // Inviato per mappare correttamente il DTO
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registraNuovoAgente(formData);
            onSave(); // Torna alla lista o mostra successo
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.formCardStyle}>
            <h3 style={{ textAlign: 'center', color: '#2C3E50' }}>Registra Nuovo Collaboratore</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                L'agente verrà creato e associato automaticamente alla tua agenzia.
            </p>
            <form onSubmit={handleSubmit} style={styles.formStyle}>
                <input 
                    style={styles.inputStyle}
                    placeholder="Nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                />
                <input 
                    style={styles.inputStyle}
                    placeholder="Cognome"
                    value={formData.cognome}
                    onChange={(e) => setFormData({...formData, cognome: e.target.value})}
                    required
                />
                <input 
                    style={styles.inputStyle}
                    type="email"
                    placeholder="Email Aziendale"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                />
                <button 
                    type="submit" 
                    style={{...styles.submitButtonStyle, opacity: loading ? 0.7 : 1}}
                    disabled={loading}
                >
                    {loading ? 'Creazione in corso...' : 'Conferma e Registra'}
                </button>
            </form>
        </div>
    );
};

export default NuovoAgenteForm;