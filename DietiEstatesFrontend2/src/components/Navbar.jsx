import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Logo from './Logo';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleAreaPersonale = () => {
        if (!user) return navigate('/login');

        const userRole = user.role.toLowerCase();

        switch (userRole) {
            case 'cliente': 
                navigate('/cliente'); 
                break;
            case 'agente': 
                navigate('/agente'); 
                break;
            case 'admin': 
                navigate('/amministratore'); 
                break;
            case 'gestore': 
                navigate('/gestore'); 
                break;
            default: 
                navigate('/');
        }
    };

    return (
        <nav style={navStyle}>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
                <Logo width="50px" height="50px" />
            </div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                {user ? (
                    <>
                        <button onClick={handleAreaPersonale} style={btnStyle}>👤 Area Personale</button>
                        <button onClick={logout} style={{...btnStyle, backgroundColor: '#E74C3C'}}>Esci</button>
                    </>
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