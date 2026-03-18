import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = 'http://localhost:8080/api/gestore';

const apiRequest = async (endpoint, options = {}) => {
    try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();

        if (!token) {
            throw new Error("Sessione scaduta o non valida. Effettua nuovamente il login.");
        }

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers,
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (response.status === 204) return true;
        if (response.status === 200) {
            const text = await response.text();
            return text ? JSON.parse(text) : true;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (response.status === 409) 
                throw new Error("Email già in uso.");
            if (response.status === 500) 
                throw new Error("Errore del server. Riprova più tardi.");
            throw new Error(errorData.message || `Errore API: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`[API Error ${endpoint}]:`, error.message);
        throw error;
    }
};

export const registraNuovoAgente = (agenteData) => {
    return apiRequest('/registra-agente', {
        method: 'POST',
        body: JSON.stringify(agenteData)
    });
};

export const getMieiAgenti = () => {
    return apiRequest('/miei-agenti');
};

export const eliminaAgente = (idAgente) => {
    return apiRequest(`/agente/${idAgente}`, {
        method: 'DELETE'
    });
};

export const aggiornaAgente = (idAgente, agenteData) => {
    return apiRequest(`/agente/${idAgente}`, {
        method: 'PATCH',
        body: JSON.stringify(agenteData)
    });
};