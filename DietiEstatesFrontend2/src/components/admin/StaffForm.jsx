import React from 'react';

const StaffForm = ({ type, formData, setFormData, agenzie, onSubmit, styles, loading }) => {

    const isGestore = type === 'gestore';

    return (
        <div style={styles.formCardStyle}>
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                <div style={iconBadgeStyle}>
                    {isGestore ? '💼' : '🛠️'}
                </div>
                <h2 style={{ margin: '10px 0 5px 0', color: '#1E293B', fontWeight: '800' }}>
                    Registra {isGestore ? 'Gestore' : 'Supporto'}
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                    Inserisci le credenziali per il nuovo membro dello staff.
                </p>
            </div>

            <form onSubmit={(e) => onSubmit(e, type)} style={styles.formStyle}>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Indirizzo Email</label>
                    <input 
                        placeholder="esempio@mail.it" 
                        type="email"
                        style={styles.inputStyle} 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        required 
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Nome</label>
                        <input 
                            placeholder="Nome" 
                            style={styles.inputStyle} 
                            value={formData.nome} 
                            onChange={e => setFormData({...formData, nome: e.target.value})} 
                            required 
                        />
                    </div>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Cognome</label>
                        <input 
                            placeholder="Cognome" 
                            style={styles.inputStyle} 
                            value={formData.cognome} 
                            onChange={e => setFormData({...formData, cognome: e.target.value})} 
                            required 
                        />
                    </div>
                </div>
                
                {isGestore && (
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Agenzia di Riferimento</label>
                        <select 
                            style={{ ...styles.inputStyle, color: '#1E293B' }}
                            value={formData.idAgenzia} 
                            onChange={e => setFormData({...formData, idAgenzia: e.target.value})} 
                            required
                        >
                            <option value="" style={{ color: '#1E293B' }}>Seleziona un'agenzia...</option>
                            {agenzie.map((a) => (
                                <option key={a.idAgenzia} value={a.idAgenzia} style={{ color: '#1E293B' }}>
                                    {a.nomeAgenzia}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                        ...styles.submitButtonStyle,
                        backgroundColor: loading ? '#94A3B8' : '#0F172A',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '10px'
                    }}
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span>
                            Registrazione in corso...
                        </>
                    ) : (
                        `🚀 Conferma Registrazione ${isGestore ? 'Gestore' : 'Supporto'}`
                    )}
                </button>
            </form>
        </div>
    );
};

// Stili locali
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginLeft: '4px' };
const iconBadgeStyle = {
    width: '60px',
    height: '60px',
    backgroundColor: '#F1F5F9',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    margin: '0 auto'
};

export default StaffForm;