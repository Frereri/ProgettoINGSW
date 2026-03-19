import axios from 'axios';

const API_URL = "http://localhost:8080/api/cliente/offerte";

class OffertaService {
    /**
     * @param {Object} offertaData - I dati dell'offerta (idImmobile, prezzoProposto, tipoContratto)
     * @param {string} token - Il token di autenticazione del cliente
     */
    inviaOfferta(offertaData, token) {
        if (!token) {
            return Promise.reject({ 
                response: { status: 401, data: { message: "Sessione mancante" } } 
            });
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        return axios.post(`${API_URL}/crea`, offertaData, config);
    }

    getMieOfferte(token) {
        return axios.get(`${API_URL}/mie-offerte`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }
}

const offertaServiceInstance = new OffertaService();
export default offertaServiceInstance;