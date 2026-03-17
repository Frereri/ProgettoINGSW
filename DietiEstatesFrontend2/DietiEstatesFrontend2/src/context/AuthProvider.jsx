import React, { useState, useEffect } from 'react';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const mapGroupsToRole = (groups) => {
    if (groups.includes('Gestori')) return 'gestore';
    if (groups.includes('Agenti')) return 'agente';
    if (groups.includes('Amministratore')) return 'admin';
    if (groups.includes('Clienti')) return 'cliente';
    if (groups.includes('Supporto')) return 'supporto';
    return 'user';
  };

  const checkUser = async () => {
    try {
      const session = await fetchAuthSession();
      const { accessToken, idToken } = session.tokens ?? {};
      if (accessToken && idToken) {
        setUser({
          email: idToken.payload.email || idToken.payload.username,
          role: mapGroupsToRole(accessToken.payload['cognito:groups'] || []),
          token: accessToken.toString(),
        });
      } else { setUser(null); }
    } catch (err) { setUser(null); }
    finally { setLoading(false); }
  };

  useEffect(() => { checkUser(); }, []);

  const login = async () => {
    setLoading(true);
    await checkUser();
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      localStorage.clear();
    } catch (err) { console.error(err); }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
};