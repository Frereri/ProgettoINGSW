import axios from 'axios';

// Definiamo l'URL base in un solo punto (Astrazione!)
const API_URL = "http://localhost:8080/api/immobile";

class ImmobileService {
    
    // Metodo per ottenere tutti gli immobili
    getAllImmobili(page = 0, size = 10) {
        // Inviamo i parametri come query string: ?page=0&size=10
        return axios.get(`${API_URL}`, {
            params: {
                page: page,
                size: size
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