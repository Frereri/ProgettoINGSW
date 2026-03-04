import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { signIn, signOut, fetchAuthSession } from 'aws-amplify/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            try { await signOut(); } catch (err) { }
            
            await signIn({ username: email, password });
            const session = await fetchAuthSession();
            const tokens = session.tokens;

            if (tokens && tokens.accessToken) {
                const groups = tokens.accessToken.payload['cognito:groups'] || [];
                console.log("Login OK! Gruppi:", groups);

                if (groups.includes('Gestori')) navigate('/gestore');
                else if (groups.includes('Agenti')) navigate('/agente');
                else if (groups.includes('Amministratore')) navigate('/amministratore');
                else if (groups.includes('Clienti')) navigate('/cliente');
                else if (groups.includes('Supporto')) navigate('/supporto');
                else navigate('/');
            }
        } catch (error) {
            alert("Errore durante il login: " + error.message);
        }
    };

    return (
        <div style={containerStyle}>
            {/* HEADER - Usato per il titolo e logo del mockup */}
            <div style={headerStyle}>
                <Logo width="100px" height="100px" />
                <h1 style={{color: 'white', marginTop: '10px'}}>DietiEstates25</h1>
            </div>
            
            <div style={cardContainerStyle}>
                <div style={loginBoxStyle}>
                    <h2 style={{marginBottom: '20px', color: '#2C3E50'}}>Accedi</h2>
                    <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
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
                                style={{
                                    position: 'absolute',
                                    right: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                    fontSize: '0.7rem',
                                    color: '#2C3E50',
                                    fontWeight: 'bold',
                                    userSelect: 'none'
                                }}
                            >
                                {showPassword ? "NASCONDI" : "MOSTRA"}
                            </span>
                        </div>
                        <button type="submit" style={buttonStyle}>Login</button>
                    </form>
                    <p style={{margin: '15px 0', color: '#666'}}>or</p>
                    <button type="button" style={{...buttonStyle, backgroundColor: '#5DADE2'}}>Sign Up</button>
                </div>
            </div>

            {/* FOOTER - Usato per le info di contatto del mockup */}
            <footer style={footerStyle}>
                <div style={{display: 'flex', justifyContent: 'space-around', width: '100%', textAlign: 'left'}}>
                    <div><strong>Follow</strong><br/>Instagram: dietiEstates25<br/>Facebook: dietiEstates</div>
                    <div><strong>Email</strong><br/>assistenza@dietiestates.it</div>
                    <div><strong>Phone number</strong><br/>+39 3927309033</div>
                </div>
            </footer>
        </div>
    );
};

// --- DEFINIZIONE DEGLI STILI ---
const containerStyle = { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#5DADE2' };

const headerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' };

const cardContainerStyle = { 
    flex: 1, 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    // Immagine di background opzionale per lo skyline
    backgroundImage: 'linear-gradient(to bottom, transparent 60%, rgba(255,255,255,0.3) 100%)' 
};

const loginBoxStyle = { 
    backgroundColor: 'white', 
    padding: '40px', 
    borderRadius: '20px', 
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)', 
    textAlign: 'center', 
    width: '350px', 
    border: '1px solid #ddd' 
};

const inputStyle = { 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid #ccc', 
    fontSize: '1rem',
    outline: 'none'
};

const buttonStyle = { 
    backgroundColor: '#2C3E50', 
    color: 'white', 
    border: 'none', 
    padding: '12px', 
    borderRadius: '8px', 
    fontSize: '1.1rem', 
    cursor: 'pointer',
    transition: 'background 0.3s'
};

const footerStyle = { 
    backgroundColor: '#2C3E50', 
    color: 'white', 
    padding: '20px', 
    fontSize: '0.8rem' 
};


export default Login;