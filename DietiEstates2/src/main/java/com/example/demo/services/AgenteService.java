package com.example.demo.services;

import java.util.UUID;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.DTO.AgenteDTO;
import com.example.demo.DTO.ImmobileDTO;
import com.example.demo.DTO.OffertaDTO;
import com.example.demo.mapper.IImmobileMapper;
import com.example.demo.mapper.IOffertaMapper;
import com.example.demo.mapper.IUtenteMapper;
import com.example.demo.models.Agente;
import com.example.demo.models.Immobile;
import com.example.demo.models.Offerta;
import com.example.demo.models.StoricoOfferta;
import com.example.demo.repositories.AgenteRepo;
import com.example.demo.repositories.ImmobileRepo;
import com.example.demo.repositories.OffertaRepo;
import com.example.demo.repositories.StoricoRepo;

@Service
public class AgenteService {

	@Autowired
    private GeoService geoService;
	
	@Autowired
    private AgenteRepo agenteRepo;
	
    @Autowired
    private ImmobileRepo immobileRepo;
    
    @Autowired
    private OffertaRepo offertaRepo;
    
    @Autowired
    private StoricoRepo storicoRepo;
    
    @Autowired
    private IImmobileMapper immobileMapper;
    
    @Autowired
    private IOffertaMapper offertaMapper;
    
    @Autowired
    private IUtenteMapper utenteMapper;

    public AgenteDTO getProfiloAgente(UUID idAgente) {
        Agente agente = agenteRepo.findById(idAgente)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agente non trovato"));
        return utenteMapper.toAgenteDTO(agente);
    }
    
    public ImmobileDTO caricaImmobile(ImmobileDTO dto, UUID idAgente) {
        Agente agente = agenteRepo.findById(idAgente)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agente non trovato"));
        Immobile immobile;
        if ("VILLA".equalsIgnoreCase(dto.getTipoImmobile())) {
            immobile = immobileMapper.immobileDTOtoVilla(dto);
        } else {
            immobile = immobileMapper.immobileDTOtoAppartamento(dto);
        }

        Map<String, Double> coords = geoService.getCoordinates(dto.getIndirizzo());
        
        if (coords != null) {
            immobile.setLatitudine(coords.get("lat"));
            immobile.setLongitudine(coords.get("lon"));
            checkServiziZona(immobile); 
        } else {
            System.err.println("Attenzione: Geocoding fallito per " + dto.getIndirizzo());
        }

        immobile.setAgente(agente);
        immobile.setAgenzia(agente.getAgenzia());
        Immobile salvato = immobileRepo.save(immobile);
        return immobileMapper.immobileToDTO(salvato);
    }

    private void checkServiziZona(Immobile immobile) {
        if (immobile.getLatitudine() != null && immobile.getLongitudine() != null) {
            Double lat = immobile.getLatitudine();
            Double lon = immobile.getLongitudine();

            immobile.setVicinoScuole(geoService.isNear(lat, lon, "education.school"));
            immobile.setVicinoParchi(geoService.isNear(lat, lon, "leisure.park"));
            immobile.setVicinoTrasporti(geoService.isNear(lat, lon, "public_transport"));
        }
    }
    
    public ImmobileDTO aggiornaImmobile(Integer idImmobile, ImmobileDTO dto) {
        Immobile immobileEsistente = immobileRepo.findById(idImmobile)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Immobile non trovato"));
        immobileEsistente.setTitolo(dto.getTitolo());
        immobileEsistente.setPrezzo(dto.getPrezzo());
        immobileEsistente.setDescrizione(dto.getDescrizione());
        immobileEsistente.setStato(dto.getStato());
        if (!immobileEsistente.getIndirizzo().equals(dto.getIndirizzo())) {
            immobileEsistente.setIndirizzo(dto.getIndirizzo());
            
            Map<String, Double> coords = geoService.getCoordinates(dto.getIndirizzo());
            if (coords != null) {
                immobileEsistente.setLatitudine(coords.get("lat"));
                immobileEsistente.setLongitudine(coords.get("lon"));
                checkServiziZona(immobileEsistente);
            }
        }
        Immobile salvato = immobileRepo.save(immobileEsistente);
        return immobileMapper.immobileToDTO(salvato);
    }

    public OffertaDTO inserisciOffertaEsterna(OffertaDTO dto, Integer idImmobile) {
        Immobile immobile = immobileRepo.findById(idImmobile)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Immobile non trovato"));

        Offerta offerta = offertaMapper.dtoToOfferta(dto);
        offerta.setImmobile(immobile);
        offerta.setOffertaEsterna(true);
        offerta.setPrezzoOriginale(immobile.getPrezzo());
        
        return offertaMapper.offertaToDTO(offertaRepo.save(offerta));
    }
    
    public OffertaDTO gestisciOfferta(Integer idOfferta, String stato, Double prezzo, String nota, UUID idAutore) {
        Offerta offerta = offertaRepo.findById(idOfferta)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        StoricoOfferta log = new StoricoOfferta();
        log.setOfferta(offerta);
        log.setStatoPrecedente(offerta.getStato());
        log.setNuovoStato(stato.toUpperCase());
        log.setPrezzoScambiato(prezzo != null ? prezzo : offerta.getPrezzoOfferto());
        log.setNota(nota);
        log.setAutoreAzione(idAutore);

        storicoRepo.save(log);

        offerta.setStato(stato.toUpperCase());
        if (prezzo != null) offerta.setPrezzoControfferta(prezzo);
        
        return offertaMapper.offertaToDTO(offertaRepo.save(offerta));
    }
}
