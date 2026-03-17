import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import { PropertyForm } from '../PropertyForm';

const NuovoImmobilePage = () => {
    const navigate = useNavigate();

    // Stili condivisi (puoi importarli o definirli qui)
    const pageStyles = {
        formCardStyle: { backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '40px auto' },
        formStyle: { display: 'flex', flexDirection: 'column', gap: '15px' },
        inputStyle: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' },
        submitButtonStyle: { padding: '15px', backgroundColor: '#5DADE2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
    };

    const handleSaveProperty = async (propertyData) => {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.accessToken?.toString();
            
            await axios.post("http://localhost:8080/api/immobile", propertyData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert("Immobile inserito con successo!");
            navigate('/agente'); 
        } catch (err) {
            console.error(err);
            alert("Errore durante il salvataggio: " + (err.response?.data || err.message));
        }
    };

    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '20px' }}>
            <button onClick={() => navigate('/agente')} style={{ marginBottom: '20px', cursor: 'pointer' }}>⬅ Torna alla Dashboard</button>
            <PropertyForm onSubmit={handleSaveProperty} styles={pageStyles} />
        </div>
    );
};

export default NuovoImmobilePage;