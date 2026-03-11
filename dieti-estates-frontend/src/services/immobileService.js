import axios from 'axios';

// Definiamo l'URL base in un solo punto (Astrazione!)
const API_URL = "http://localhost:8080/api/immobile";

class ImmobileService {
    
    // Metodo per ottenere tutti gli immobili
    getAllImmobili(page = 0, size = 10, filters = {}) {
    // Se c'è almeno un filtro attivo, usa l'endpoint /cerca, altrimenti quello base
        const isSearching = filters.citta || filters.min || filters.max || filters.contratto;
        const url = isSearching ? `${API_URL}/cerca` : `${API_URL}`;

        return axios.get(url, {
            params: {
                page: page,
                size: size,
                // Mappatura precisa sui nomi @RequestParam del tuo Controller Java
                citta: filters.citta || undefined,
                min: filters.min || undefined, 
                max: filters.max || undefined,
                contratto: filters.contratto || undefined
            }
        });
    }

    // Metodo per ottenere un singolo immobile per ID
    getImmobileById(id) {
        return axios.get(`${API_URL}/${id}`);
    }

    // Altri metodi (create, update, delete) verranno qui...

    searchImmobili(filters) {
    // Trasforma l'oggetto filters in query string (es: ?citta=Napoli&min=1000)
    const params = new URLSearchParams(filters).toString();
    return axios.get(`${API_URL}/cerca?${params}`);
    }
}

// Esportiamo un'istanza della classe (Singleton pattern)
const immobileServiceInstance = new ImmobileService();
export default immobileServiceInstance;