import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import Logo from './Logo';

const Navbar = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => { checkUser(); }, []);

    const checkUser = async () => {
        try {
            const session = await fetchAuthSession();
            if (session?.tokens) {
                const groups = session.tokens.accessToken.payload['cognito:groups'] || [];
                if (groups.includes('Gestori')) setUserRole('GESTORI');
                else if (groups.includes('Clienti')) setUserRole('CLIENTI');
                else if (groups.includes('Agenti')) setUserRole('AGENTI');
            }
        } catch (err) { setUserRole(null); }
    };

    const handleAreaPersonale = () => {
        if (userRole === 'CLIENTI') navigate('/cliente');
        else if (userRole === 'GESTORI') navigate('/gestore');
        else if (userRole === 'AGENTI') navigate('/agente');
        else navigate('/');
    };

    return (
        <nav style={navStyle}>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
                <Logo width="50px" height="50px" />
            </div>
            <div>
                {userRole ? (
                    <button onClick={handleAreaPersonale} style={btnStyle}>👤 Area Personale</button>
                ) : (
                    <button onClick={() => navigate('/login')} style={btnStyle}>Accedi</button>
                )}
            </div>
        </nav>
    );
};

const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '10px 50px', backgroundColor: '#2C3E50', color: 'white', alignItems: 'center' };
const btnStyle = { padding: '8px 15px', backgroundColor: '#3498DB', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default Navbar;