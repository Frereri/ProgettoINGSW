import React, { useState } from 'react';

const ChangePasswordForm = ({ onUpdate, styles }) => {
    const [pwData, setPwData] = useState({ vecchiaPassword: '', nuovaPassword: '' });
    const [showOldPw, setShowOldPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const { formCardStyle, formStyle, inputStyle, eyeToggleStyle, submitButtonStyle } = styles;

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(pwData);
    };

    return ( 
        <div style={formCardStyle}>
        <h2>Sicurezza Account</h2>
        <div style={formStyle}>
            
            {/* Campo Password Attuale */}
            <div style={{ position: 'relative' }}>
                <input 
                    type={showOldPw ? "text" : "password"} 
                    placeholder="Password Attuale" 
                    style={{ ...inputStyle, paddingRight: '100px' }} 
                    value={pwData.vecchiaPassword}
                    onChange={e => setPwData({ ...pwData, vecchiaPassword: e.target.value })}
                    required 
                />
                <button 
                    type="button" 
                    onClick={() => setShowOldPw(!showOldPw)} 
                    style={eyeToggleStyle}
                >
                    {showOldPw ? "NASCONDI" : "MOSTRA"}
                </button>
            </div>

            {/* Campo Nuova Password */}
            <div style={{ position: 'relative' }}>
                <input 
                    type={showNewPw ? "text" : "password"} 
                    placeholder="Nuova Password" 
                    style={{ ...inputStyle, paddingRight: '100px' }} 
                    value={pwData.nuovaPassword}
                    onChange={e => setPwData({ ...pwData, nuovaPassword: e.target.value })}
                    required 
                />
                <button 
                    type="button" 
                    onClick={() => setShowNewPw(!showNewPw)} 
                    style={eyeToggleStyle}
                >
                    {showNewPw ? "NASCONDI" : "MOSTRA"}
                </button>
            </div>

            <button onClick={handleSubmit} style={submitButtonStyle}>
                Aggiorna Password
            </button>
        </div>
    </div>
    );

};
export default ChangePasswordForm;
