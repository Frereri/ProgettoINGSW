import React, { useState } from 'react';

const ChangePasswordForm = ({ onUpdate, styles }) => {
    const [pwData, setPwData] = useState({ vecchiaPassword: '', nuovaPassword: '' });
    const [showOldPw, setShowOldPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const { 
        formCardStyle, 
        formStyle, 
        inputStyle, 
        eyeToggleStyle, 
        submitButtonStyle 
    } = styles;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (pwData.nuovaPassword.length < 8) {
            alert("La nuova password deve contenere almeno 8 caratteri.");
            return;
        }

        setLoading(true);
        try {
            await onUpdate(pwData);
            setPwData({ vecchiaPassword: '', nuovaPassword: '' });
        } catch (err) {
            console.error("Errore nell'invio:", err);
        } finally {
            setLoading(false);
        }
    };

    return ( 
        <div style={formCardStyle}>
            <h2 style={titleStyle}>Sicurezza Account</h2>
            <p style={subtitleStyle}>Aggiorna regolarmente la tua password per mantenere l'account sicuro.</p>
            
            <form onSubmit={handleSubmit} style={formStyle}>
                
                {/* Campo Password Attuale */}
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Password Attuale</label>
                    <div style={{ position: 'relative' }}>
                        <input 
                            type={showOldPw ? "text" : "password"} 
                            placeholder="Inserisci password corrente" 
                            style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', paddingRight: '80px' }} 
                            value={pwData.vecchiaPassword}
                            onChange={e => setPwData({ ...pwData, vecchiaPassword: e.target.value })}
                            required 
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowOldPw(!showOldPw)} 
                            style={eyeToggleStyle}
                        >
                            {showOldPw ? "Nascondi" : "Mostra"}
                        </button>
                    </div>
                </div>

                {/* Campo Nuova Password */}
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Nuova Password</label>
                    <div style={{ position: 'relative' }}>
                        <input 
                            type={showNewPw ? "text" : "password"} 
                            placeholder="Minimo 8 caratteri" 
                            style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', paddingRight: '80px' }} 
                            value={pwData.nuovaPassword}
                            onChange={e => setPwData({ ...pwData, nuovaPassword: e.target.value })}
                            required 
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowNewPw(!showNewPw)} 
                            style={eyeToggleStyle}
                        >
                            {showNewPw ? "Nascondi" : "Mostra"}
                        </button>
                    </div>
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
                    {loading ? 'Aggiornamento...' : 'Aggiorna Password'}
                </button>
            </form>
        </div>
    );
};

// --- STILI ---
const titleStyle = { 
    margin: '0 0 10px 0', 
    fontSize: '1.5rem', 
    color: '#1E293B', 
    fontWeight: '700' 
};

const subtitleStyle = { 
    margin: '0 0 25px 0', 
    fontSize: '0.9rem', 
    color: '#64748B', 
    lineHeight: '1.5' 
};

const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
};

const labelStyle = {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#475569'
};

export default ChangePasswordForm;