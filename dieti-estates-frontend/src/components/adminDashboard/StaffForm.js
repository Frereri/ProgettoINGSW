import React from 'react';

export const StaffForm = ({ type, formData, setFormData, agenzie, onSubmit, styles }) => {
    return (
        <div style={styles.formCardStyle}>
            <h2>Registra {type === 'gestore' ? 'Gestore' : 'Supporto'}</h2>
            <form onSubmit={(e) => onSubmit(e, type)} style={styles.formStyle}>
                <input placeholder="Email" style={styles.inputStyle} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                <input placeholder="Nome" style={styles.inputStyle} value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required />
                <input placeholder="Cognome" style={styles.inputStyle} value={formData.cognome} onChange={e => setFormData({...formData, cognome: e.target.value})} required />
                
                {type === 'gestore' && (
                    <select 
                        style={styles.inputStyle} 
                        value={formData.idAgenzia} 
                        onChange={e => setFormData({...formData, idAgenzia: e.target.value})} 
                        required
                    >
                        <option value="">Seleziona un'agenzia...</option>
                        {agenzie.map((a) => (
                            <option key={a.idAgenzia} value={a.idAgenzia}>{a.nomeAgenzia}</option>
                        ))}
                    </select>
                )}
                <button type="submit" style={styles.submitButtonStyle}>Conferma Registrazione</button>
            </form>
        </div>
    );
};