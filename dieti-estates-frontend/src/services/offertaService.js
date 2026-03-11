import axios from 'axios';

const API_URL = "http://localhost:8080/api/cliente/offerte";

const inviaOfferta = (idImmobile, importo) => {
    const token = localStorage.getItem('token'); 
    
    if (!token) {
        // Lanciamo un errore che verrà catturato dal .catch in ImmobileDettaglio
        return Promise.reject({ response: { status: 401 } });
    }

    const offertaDTO = {
        idImmobile: parseInt(idImmobile),
        prezzoOfferto: parseFloat(importo),
        stato: 'PENDENTE'
    };

    return axios.post(`${API_URL}/crea`, offertaDTO, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const offertaService = {
    inviaOfferta
};

export default offertaService;