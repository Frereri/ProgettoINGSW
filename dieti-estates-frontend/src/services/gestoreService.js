import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = 'http://localhost:8080/api/gestore'; // Sostituisci con il tuo URL

const getAuthHeaders = async () => {
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const registraNuovoAgente = async (agenteData) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/registra-agente`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(agenteData)
    });
    if (!response.ok) throw new Error('Errore durante la creazione dell\'agente');
    return response.json();
};

export const getMieiAgenti = async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/miei-agenti`, { headers });
    if (!response.ok) throw new Error('Errore nel recupero degli agenti');
    return response.json();
};

export const eliminaAgente = async (idAgente) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/agente/${idAgente}`, {
        method: 'DELETE',
        headers: headers
    });
    if (!response.ok) throw new Error("Errore durante l'eliminazione");
};

export const aggiornaAgente = async (idAgente, agenteData) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/agente/${idAgente}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(agenteData)
    });
    if (!response.ok) throw new Error("Errore durante l'aggiornamento");
    return response.json();
};