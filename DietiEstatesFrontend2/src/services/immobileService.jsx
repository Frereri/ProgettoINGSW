import axios from 'axios';

const API_URL = "http://localhost:8080/api/immobile";

class ImmobileService {
    
    getAllImmobili(page = 0, size = 10, filters = {}) {
        const isSearching = filters.citta || filters.min || filters.max || filters.contratto;
        const url = isSearching ? `${API_URL}/cerca` : `${API_URL}`;

        return axios.get(url, {
            params: {
                page: page,
                size: size,
                citta: filters.citta || undefined,
                min: filters.min || undefined, 
                max: filters.max || undefined,
                contratto: filters.contratto || undefined
            }
        });
    }

    getImmobileById(id) {
        return axios.get(`${API_URL}/${id}`);
    }
}

const immobileServiceInstance = new ImmobileService();
export default immobileServiceInstance;