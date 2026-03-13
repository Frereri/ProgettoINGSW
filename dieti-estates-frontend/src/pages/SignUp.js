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
    const [errore, setErrore] = useState('');       // <-- aggiunto
    const [successo, setSuccesso] = useState('');   // <-- aggiunto
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setErrore('');
        setSuccesso('');
        
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
            setSuccesso("Registrazione effettuata! Controlla l'email per confermare l'account.");
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            const codice = error.response?.data?.message;
            if (codice === "EMAIL_GIA_ESISTENTE") {
                setErrore("Questa email è già registrata. Prova ad accedere.");
            } else if (codice === "PASSWORD_NON_VALIDA") {
                setErrore("La password deve avere almeno 8 caratteri, una maiuscola e un numero.");
            } else {
                setErrore("Errore durante la registrazione. Riprova più tardi.");
            }
        }
    };

    return (
        <div style={containerStyle}>
            <div style={boxStyle}>
                <Logo width="70px" height="70px" />
                <h2 style={titleStyle}>Crea Account</h2>
                <p style={subtitleStyle}>Unisciti a DietiEstates25</p>

                <form onSubmit={handleSignUp} style={formStyle}>
                    <div style={rowStyle}>
                        <input 
                            type="text" 
                            placeholder="Nome" 
                            style={inputStyle}
                            onChange={e => setFormData({...formData, nome: e.target.value})} 
                            required
                        />
                        <input 
                            type="text" 
                            placeholder="Cognome" 
                            style={inputStyle}
                            onChange={e => setFormData({...formData, cognome: e.target.value})} 
                            required
                        />
                    </div>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        style={inputStyle}
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        required
                    />
                    <div style={{ position: 'relative' }}>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            style={{...inputStyle, width: '100%', boxSizing: 'border-box'}} 
                            required
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                        />
                        <span onClick={() => setShowPassword(!showPassword)} style={toggleStyle}>
                            {showPassword ? "NASCONDI" : "MOSTRA"}
                        </span>
                    </div>

                    {/* Messaggi errore/successo */}
                    {errore && <p style={erroreStyle}>{errore}</p>}
                    {successo && <p style={successoStyle}>{successo}</p>}
                    
                    <button type="submit" style={buttonStyle}>Registrati</button>
                </form>

                <p style={footerTextStyle}>
                    Hai già un account? <span onClick={() => navigate('/login')} style={linkStyle}>Accedi</span>
                </p>
            </div>
        </div>
    );
};

// --- STILI ---
const containerStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F4F8' };
const boxStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center', width: '450px' };
const titleStyle = { margin: '10px 0 5px 0', fontSize: '1.6rem', color: '#1A2B3C', fontWeight: '700' };
const subtitleStyle = { color: '#718096', marginBottom: '25px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const rowStyle = { display: 'flex', gap: '10px' };
const inputStyle = { padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #E2E8F0', outline: 'none', backgroundColor: '#F8FAFC' };
const buttonStyle = { backgroundColor: '#2C3E50', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' };
const toggleStyle = { position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '0.65rem', color: '#A0AEC0', fontWeight: '800' };
const footerTextStyle = { marginTop: '20px', fontSize: '0.9rem', color: '#718096' };
const linkStyle = { color: '#3498DB', cursor: 'pointer', fontWeight: '600' };
const erroreStyle = { color: '#E53E3E', backgroundColor: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: '8px', padding: '10px', fontSize: '0.9rem' };
const successoStyle = { color: '#276749', backgroundColor: '#F0FFF4', border: '1px solid #9AE6B4', borderRadius: '8px', padding: '10px', fontSize: '0.9rem' };

export default SignUp;