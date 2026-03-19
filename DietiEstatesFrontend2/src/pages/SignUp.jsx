import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const SignUp = () => {
    const [formData, setFormData] = useState({ 
        email: '', 
        password: '', 
        nome: '', 
        cognome: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ tipo: '', testo: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback({ tipo: '', testo: '' });
        
        const payload = {
            password: formData.password,
            datiProfilo: {
                email: formData.email,
                nome: formData.nome,
                cognome: formData.cognome,
                ruolo: "CLIENTE"
            }
        };

        try {
            await axios.post('http://localhost:8080/api/auth/signup-cliente', payload);
            setFeedback({ 
                tipo: 'success', 
                testo: "Registrazione completata! Controlla la tua email per confermare l'account." 
            });
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            const msg = error.response?.data?.error;
            let erroreTesto = "Errore durante la registrazione. Riprova più tardi.";
     
            if (msg === "Email già esistente") 
                erroreTesto = "Questa email è già registrata.";
            else if (msg === "Password non valida") 
                erroreTesto = "La password deve contenere almeno 8 caratteri, una maiuscola e un numero.";
            
          

            setFeedback({ tipo: 'error', testo: erroreTesto });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={boxStyle}>
                <div style={{ marginBottom: '20px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <Logo width="80px" height="80px" />
                </div>
                
                <h2 style={titleStyle}>Unisciti a noi</h2>
                <p style={subtitleStyle}>Crea il tuo account DietiEstates</p>

                <form onSubmit={handleSignUp} style={formStyle}>
                    <div style={rowStyle}>
                        <input 
                            name="nome"
                            type="text" 
                            placeholder="Nome" 
                            style={inputStyle}
                            onChange={handleChange} 
                            required
                        />
                        <input 
                            name="cognome"
                            type="text" 
                            placeholder="Cognome" 
                            style={inputStyle}
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    
                    <input 
                        name="email"
                        type="email" 
                        placeholder="Indirizzo Email" 
                        style={inputStyle}
                        onChange={handleChange} 
                        required
                    />

                    <div style={{ position: 'relative' }}>
                        <input 
                            name="password"
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            style={{...inputStyle, width: '100%', boxSizing: 'border-box'}} 
                            onChange={handleChange}
                            required
                        />
                        <span onClick={() => setShowPassword(!showPassword)} style={toggleStyle}>
                            {showPassword ? "Nascondi" : "Mostra"}
                        </span>
                    </div>

                    {feedback.testo && (
                        <div style={feedback.tipo === 'success' ? successoStyle : erroreStyle}>
                            {feedback.testo}
                        </div>
                    )}
                    
                    <button 
                        type="submit" 
                        style={{...buttonStyle, opacity: loading ? 0.7 : 1}}
                        disabled={loading}
                    >
                        {loading ? 'Creazione in corso...' : 'Registrati'}
                    </button>
                </form>

                <div style={footerStyle}>
                    Hai già un account? <span onClick={() => navigate('/login')} style={linkStyle}>Accedi</span>
                </div>
            </div>
        </div>
    );
};

// --- STILI ---
const containerStyle = { 
    minHeight: '100vh', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F4F7F6',
    padding: '20px'
};

const boxStyle = { 
    backgroundColor: 'white', 
    padding: '50px 40px', 
    borderRadius: '16px', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
    textAlign: 'center', 
    width: '100%',
    maxWidth: '460px' 
};

const titleStyle = { 
    margin: '0', 
    fontSize: '1.8rem', 
    color: '#2C3E50', 
    fontWeight: '800' 
};

const subtitleStyle = { 
    color: '#7F8C8D', 
    marginBottom: '30px',
    fontSize: '1rem'
};

const formStyle = { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '12px' 
};

const rowStyle = { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '12px' 
};

const inputStyle = { 
    padding: '14px 16px', 
    borderRadius: '10px', 
    border: '1px solid #EAECEE', 
    outline: 'none', 
    backgroundColor: '#F8F9F9',
    fontSize: '0.95rem',
    transition: 'border-color 0.2s',
    color: '#2C3E50'
};

const buttonStyle = { 
    backgroundColor: '#3498DB', 
    color: 'white', 
    border: 'none', 
    padding: '16px', 
    borderRadius: '10px', 
    fontWeight: '700', 
    cursor: 'pointer', 
    marginTop: '15px',
    fontSize: '1rem',
    transition: 'background-color 0.3s'
};

const toggleStyle = { 
    position: 'absolute', 
    right: '15px', 
    top: '50%', 
    transform: 'translateY(-50%)', 
    cursor: 'pointer', 
    fontSize: '0.75rem', 
    color: '#3498DB', 
    fontWeight: '700',
    textTransform: 'uppercase'
};

const footerStyle = { 
    marginTop: '25px', 
    fontSize: '0.95rem', 
    color: '#7F8C8D' 
};

const linkStyle = { 
    color: '#3498DB', 
    cursor: 'pointer', 
    fontWeight: '700',
    textDecoration: 'none'
};

const erroreStyle = { 
    color: '#C0392B', 
    backgroundColor: '#FDEDEC', 
    border: '1px solid #FADBD8', 
    borderRadius: '8px', 
    padding: '12px', 
    fontSize: '0.85rem',
    lineHeight: '1.4'
};

const successoStyle = { 
    color: '#1E8449', 
    backgroundColor: '#EAFAF1', 
    border: '1px solid #D5F5E3', 
    borderRadius: '8px', 
    padding: '12px', 
    fontSize: '0.85rem' 
};

export default SignUp;