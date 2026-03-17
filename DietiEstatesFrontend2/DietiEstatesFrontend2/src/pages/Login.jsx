import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { signIn, signOut, fetchAuthSession } from 'aws-amplify/auth';
import { useAuth } from '../context/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errore, setErrore] = useState('');
    
    const [loading, setLoading] = useState(false); 
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrore('');
        
        setLoading(true);

        try {
            await signIn({ username: email, password });
            await login(); 
            
            const session = await fetchAuthSession();
            const groups = session.tokens?.accessToken?.payload['cognito:groups'] || [];
            
            if (groups.includes('Gestori')) navigate('/gestore');
            else if (groups.includes('Agenti')) navigate('/agente');
            else if (groups.includes('Clienti')) navigate('/cliente');
            else if (groups.includes('Amministratore')) navigate('/amministratore');
            else if (groups.includes('Supporto')) navigate('/supporto');
            else navigate('/');

        } catch (error) {
            console.error(error);
            if (error.name === 'NotAuthorizedException') {
                setErrore("Email o password errati.");
            } else if (error.name === 'UserNotFoundException') {
                setErrore("Nessun account trovato con questa email.");
            } else if (error.name === 'UserNotConfirmedException') {
                setErrore("Account non confermato. Controlla la tua email.");
            } else {
                setErrore("Errore durante il login. Riprova più tardi.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={pageContainer}>
            <div style={loginCard}>
                <div style={{ marginBottom: '30px' }}>
                    <Logo width="70px" height="70px" />
                </div>

                <h1 style={titleStyle}>Bentornato</h1>
                <p style={subtitleStyle}>Accedi a Dieti Estates</p>

                <form onSubmit={handleLogin} style={formStyle}>
                    <div style={inputGroup}>
                        <label style={labelStyle}>Email</label>
                        <input 
                            type="email" 
                            placeholder="esempio@email.it" 
                            onChange={(e) => setEmail(e.target.value)} 
                            style={inputField} 
                            required
                        />
                    </div>

                    <div style={inputGroup}>
                        <label style={labelStyle}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type={showPassword ? "text" : "password"}
                                placeholder="La tua password" 
                                onChange={(e) => setPassword(e.target.value)} 
                                style={inputField} 
                                required
                            />
                            <span 
                                onClick={() => setShowPassword(!showPassword)}
                                style={toggleIcon}
                            >
                                {showPassword ? "Nascondi" : "Mostra"}
                            </span>
                        </div>
                    </div>

                    {errore && <div style={erroreBox}>{errore}</div>}

                    <button type="submit" style={loginButton}>Accedi</button>
                </form>

                <div style={divider}>
                    <div style={line}></div>
                    <span style={dividerText}>oppure</span>
                    <div style={line}></div>
                </div>

                <button 
                    type="button" 
                    style={secondaryButton}
                    onClick={() => navigate('/signup')}
                >
                    Crea un account
                </button>
                
                <p style={footerLink} onClick={() => navigate('/')}>
                    Torna alla Home
                </p>
            </div>
        </div>
    );
};

// --- STILI ---

const pageContainer = { minHeight: '100vh', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F0F4F8', 
    backgroundImage: 'radial-gradient(circle at top right, #5DADE2 0%, #F0F4F8 40%)' 
};

const loginCard = {
    backgroundColor: '#ffffff',
    padding: '50px 40px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '450px',
    border: '1px solid #EAEAEA'
};

const titleStyle = { 
    fontSize: '2rem', 
    color: '#2C3E50', 
    margin: '0 0 10px 0', 
    fontWeight: '800' 
};

const subtitleStyle = { 
    fontSize: '1rem', 
    color: '#7F8C8D', 
    marginBottom: '40px' 
};

const formStyle = { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '25px' 
};

const inputGroup = { 
    display: 'flex', 
    flexDirection: 'column', 
    textAlign: 'left', 
    gap: '8px' 
};

const labelStyle = { 
    fontSize: '0.85rem', 
    fontWeight: 'bold', 
    color: '#34495E', 
    textTransform: 'uppercase',
    marginLeft: '2px'
};

const inputField = {
    padding: '14px 16px',
    borderRadius: '8px',
    border: '1px solid #DCDFE3',
    fontSize: '1rem',
    width: '100%',
    outline: 'none',
    backgroundColor: '#fff',
    color: '#2C3E50',
    boxSizing: 'border-box'
};

const toggleIcon = {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '0.8rem',
    color: '#3498DB',
    fontWeight: 'bold'
};

const loginButton = {
    backgroundColor: '#2C3E50',
    color: 'white',
    border: 'none',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s',
    marginTop: '10px'
};

const secondaryButton = {
    backgroundColor: 'transparent',
    color: '#2C3E50',
    border: '2px solid #2C3E50',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%'
};

const divider = {
    display: 'flex',
    alignItems: 'center',
    margin: '30px 0',
    gap: '15px'
};

const line = { flex: 1, height: '1px', backgroundColor: '#EEE' };
const dividerText = { color: '#BDC3C7', fontSize: '0.9rem' };

const erroreBox = {
    color: '#E74C3C',
    backgroundColor: '#FDEDEC',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    border: '1px solid #FADBD8',
    textAlign: 'center'
};

const footerLink = {
    marginTop: '25px',
    color: '#7F8C8D',
    fontSize: '0.9rem',
    cursor: 'pointer',
    textDecoration: 'underline'
};

export default Login;