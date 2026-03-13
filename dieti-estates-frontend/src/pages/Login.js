import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { signIn, signOut, fetchAuthSession } from 'aws-amplify/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errore, setErrore] = useState('');  // <-- aggiunto
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrore('');  // <-- resetta errore ad ogni tentativo

        try {
            try { await signOut(); } catch (err) { }
            
            await signIn({ username: email, password });
            const session = await fetchAuthSession();
            const tokens = session.tokens;

            if (tokens && tokens.accessToken) {
                const jwtToken = tokens.accessToken.toString(); 
                localStorage.setItem('token', jwtToken);

                const groups = tokens.accessToken.payload['cognito:groups'] || [];
                
                if (groups.includes('Gestori')) navigate('/gestore');
                else if (groups.includes('Agenti')) navigate('/agente');
                else if (groups.includes('Amministratore')) navigate('/amministratore');
                else if (groups.includes('Clienti')) navigate('/cliente');
                else if (groups.includes('Supporto')) navigate('/supporto');
                else navigate('/');
            }
        } catch (error) {
            if (error.name === 'NotAuthorizedException') {
                setErrore("Email o password errati.");
            } else if (error.name === 'UserNotFoundException') {
                setErrore("Nessun account trovato con questa email.");
            } else if (error.name === 'UserNotConfirmedException') {
                setErrore("Account non confermato. Controlla la tua email.");
            } else {
                setErrore("Errore durante il login. Riprova più tardi.");
            }
        }
    };

    return (
        <div style={containerStyle}>
            <div style={loginBoxStyle}>
                <div style={{ marginBottom: '20px' }}>
                    <Logo width="80px" height="80px" />
                </div>

                <h2 style={titleStyle}>Bentornato</h2>
                <p style={subtitleStyle}>Inserisci le tue credenziali per accedere</p>

                <form onSubmit={handleLogin} style={formStyle}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        onChange={(e) => setEmail(e.target.value)} 
                        style={inputStyle} 
                        required
                    />
                    <div style={{ position: 'relative', width: '100%' }}>
                        <input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Password" 
                            onChange={(e) => setPassword(e.target.value)} 
                            style={{...inputStyle, width: '100%', boxSizing: 'border-box'}} 
                            required
                        />
                        <span 
                            onClick={() => setShowPassword(!showPassword)}
                            style={togglePasswordStyle}
                        >
                            {showPassword ? "NASCONDI" : "MOSTRA"}
                        </span>
                    </div>

                    {/* Messaggio errore */}
                    {errore && <p style={erroreStyle}>{errore}</p>}

                    <button type="submit" style={buttonStyle}>Accedi</button>
                </form>

                <div style={dividerContainer}>
                    <hr style={dividerLine} />
                    <span style={dividerText}>oppure</span>
                    <hr style={dividerLine} />
                </div>

                <button 
                    type="button" 
                    style={signUpButtonStyle}
                    onClick={() => navigate('/signup')}
                >
                    Crea un nuovo account
                </button>
            </div>
        </div>
    );
};

// --- STILI ---
const containerStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F4F8', backgroundImage: 'radial-gradient(circle at top right, #5DADE2 0%, #F0F4F8 40%)' };
const loginBoxStyle = { backgroundColor: 'white', padding: '50px 40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center', width: '100%', maxWidth: '400px' };
const titleStyle = { margin: '10px 0 5px 0', fontSize: '1.8rem', color: '#1A2B3C', fontWeight: '700' };
const subtitleStyle = { color: '#718096', fontSize: '0.95rem', marginBottom: '30px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputStyle = { padding: '14px 16px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '1rem', outline: 'none', backgroundColor: '#F8FAFC', transition: 'border-color 0.2s' };
const buttonStyle = { backgroundColor: '#2C3E50', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 12px rgba(44, 62, 80, 0.2)' };
const togglePasswordStyle = { position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '0.65rem', color: '#A0AEC0', fontWeight: '800', letterSpacing: '0.5px' };
const dividerContainer = { display: 'flex', alignItems: 'center', margin: '25px 0', gap: '10px' };
const dividerLine = { flex: 1, height: '1px', backgroundColor: '#E2E8F0', border: 'none' };
const dividerText = { color: '#A0AEC0', fontSize: '0.85rem' };
const signUpButtonStyle = { backgroundColor: 'transparent', color: '#3498DB', border: '2px solid #3498DB', padding: '12px', borderRadius: '12px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', width: '100%', transition: 'all 0.3s' };
const erroreStyle = { color: '#E53E3E', backgroundColor: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: '8px', padding: '10px', fontSize: '0.9rem' };

export default Login;