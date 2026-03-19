import React, { useState } from 'react';
import { registraNuovoAgente } from '../../services/gestoreService';

const NuovoAgenteForm = ({ onSave }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        nome: '',
        cognome: '',
        email: '',
        ruolo: 'AGENTE'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await registraNuovoAgente(formData);
            setFormData({ nome: '', cognome: '', email: '', ruolo: 'AGENTE' });
            onSave();
        } catch (err) {
            setError(err.message || "Errore durante la registrazione del collaboratore.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={formCardStyle}>
            <div style={formHeader}>
                <h3 style={formTitle}>Registra Collaboratore</h3>
                <p style={formSubtitle}>L'agente verrà associato automaticamente alla tua agenzia.</p>
            </div>

            {error && <div style={errorBanner}>{error}</div>}

            <form onSubmit={handleSubmit} style={formStyle}>
                <div style={inputRow}>
                    <div style={inputGroup}>
                        <label style={labelStyle}>Nome</label>
                        <input 
                            style={inputStyle}
                            placeholder="es. Mario"
                            value={formData.nome}
                            onChange={(e) => setFormData({...formData, nome: e.target.value})}
                            required
                        />
                    </div>
                    <div style={inputGroup}>
                        <label style={labelStyle}>Cognome</label>
                        <input 
                            style={inputStyle}
                            placeholder="es. Rossi"
                            value={formData.cognome}
                            onChange={(e) => setFormData({...formData, cognome: e.target.value})}
                            required
                        />
                    </div>
                </div>

                <div style={inputGroup}>
                    <label style={labelStyle}>Email Aziendale</label>
                    <input 
                        style={inputStyle}
                        type="email"
                        placeholder="m.rossi@agenzia.it"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    style={{
                        ...submitButtonStyle, 
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                    disabled={loading}
                >
                    {loading ? 'Creazione in corso...' : 'Registra Agente'}
                </button>
            </form>
        </div>
    );
};

// --- STILI INTERNI ---
const formCardStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #E2E8F0', maxWidth: '600px', margin: '0 auto' };
const formHeader = { textAlign: 'center', marginBottom: '30px' };
const formTitle = { color: '#0F172A', fontSize: '1.5rem', fontWeight: '800', margin: '0 0 8px 0' };
const formSubtitle = { color: '#64748B', fontSize: '0.9rem' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputRow = { display: 'flex', gap: '15px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 };
const labelStyle = { fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginLeft: '4px' };
const inputStyle = { padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', outline: 'none', fontSize: '1rem', transition: 'border-color 0.2s' , color: '#1E293B' };
const submitButtonStyle = { backgroundColor: '#0F172A', color: 'white', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px' };
const errorBanner = { backgroundColor: '#FEE2E2', color: '#991B1B', padding: '12px', borderRadius: '10px', fontSize: '0.9rem', marginBottom: '20px', textAlign: 'center', fontWeight: '500' };

export default NuovoAgenteForm;