import React, { useState } from 'react';

const ChangePasswordForm = ({ styles, onUpdate }) => {
    const [pwData, setPwData] = useState({ vecchiaPassword: '', nuovaPassword: '' });
    const [showOldPw, setShowOldPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [feedback, setFeedback] = useState(null);

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
            setFeedback({ tipo: 'error', testo: "La nuova password deve contenere almeno 8 caratteri." });
            return;
        }

        setLoading(true);
        try {
            await onUpdate(pwData);   // <--- QUI È GIUSTO
            setPwData({ vecchiaPassword: '', nuovaPassword: '' });

            setFeedback({ tipo: 'success', testo: "Password aggiornata con successo!" });

        } catch (err) {
            console.error("Errore durante il cambio password:", err);

            let erroreTesto = "Errore nell'aggiornamento della password.";

            if (err.name === 'NotAuthorizedException') {
                erroreTesto = "La vecchia password inserita non è corretta.";
            } else if (err.name === 'LimitExceededException') {
                erroreTesto = "Troppi tentativi falliti. Riprova più tardi.";
            } else if (err.message?.includes("number") || err.message?.includes("numeric")) {
                erroreTesto = "La nuova password deve contenere almeno un numero.";
            } else if (err.message?.includes("symbol") || err.message?.includes("special")) {
                erroreTesto = "La nuova password deve contenere almeno un carattere speciale.";
            } else if (err.message?.includes("uppercase")) {
                erroreTesto = "La nuova password deve contenere almeno una lettera maiuscola.";
            } else if (err.message) {
                erroreTesto = err.message;
            }

            setFeedback({ tipo: 'error', testo: erroreTesto });
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
                {feedback && (
                    <div style={{
                        marginTop: "15px",
                        padding: "10px",
                        borderRadius: "6px",
                        backgroundColor: feedback.tipo === 'error' ? '#FEE2E2' : '#DCFCE7',
                        color: feedback.tipo === 'error' ? '#B91C1C' : '#166534',
                        fontWeight: '600',
                        textAlign: 'center'
                    }}>
                        {feedback.testo}
                    </div>
                )}

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
