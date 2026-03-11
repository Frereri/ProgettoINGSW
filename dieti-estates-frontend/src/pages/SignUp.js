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
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        
        const payload = {
            password: formData.password,
            datiProfilo: {
                email: formData.email,
                nome: formData.nome,
                cognome: formData.cognome
            }
        };

        try {
            await axios.post('http://localhost:8080/api/auth/signup-cliente', payload);
            alert("Registrazione effettuata! Controlla l'email per confermare l'account su Cognito.");
            navigate('/login');
        } catch (error) {
            // Logghiamo l'errore per vedere se mancano campi obbligatori nel DTO
            console.error("Dettagli errore backend:", error.response?.data);
            const messaggio = error.response?.data || error.message;
            alert("Errore registrazione: " + messaggio);
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

export default SignUp;