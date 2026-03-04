import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [formData, setFormData] = useState({ email: '', password: '', nome: '', ruolo: 'AGENTE' });
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            // Chiamata al TUO backend Eclipse, non ad AWS!
            await axios.post('http://localhost:8080/api/auth/signup', formData);
            alert("Registrazione completata! Ora puoi fare il login.");
            navigate('/login');
        } catch (error) {
            alert("Errore registrazione: " + error.response?.data?.message || error.message);
        }
    };

    return (
        <div style={containerStyle}>
            <h2>Registra Nuovo Agente</h2>
            <form onSubmit={handleSignUp} style={formStyle}>
                <input type="text" placeholder="Nome" onChange={e => setFormData({...formData, nome: e.target.value})} />
                <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} />
                <input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} />
                <button type="submit">Crea Account</button>
            </form>
        </div>
    );
};


export default SignUp;