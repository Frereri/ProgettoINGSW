package com.example.demo.services;

import java.util.UUID;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.DTO.AgenteDTO;
import com.example.demo.DTO.ImmobileDTO;
import com.example.demo.DTO.OffertaDTO;
import com.example.demo.DTO.StoricoOffertaDTO;
import com.example.demo.mapper.IImmobileMapper;
import com.example.demo.mapper.IOffertaMapper;
import com.example.demo.mapper.IStoricoOffertaMapper;
import com.example.demo.mapper.IUtenteMapper;
import com.example.demo.models.Agente;
import com.example.demo.models.Immobile;
import com.example.demo.models.Offerta;
import com.example.demo.models.StoricoOfferta;
import com.example.demo.repositories.AgenteRepo;
import com.example.demo.repositories.ImmobileRepo;
import com.example.demo.repositories.OffertaRepo;
import com.example.demo.repositories.StoricoRepo;

import jakarta.transaction.Transactional;

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
    private IStoricoOffertaMapper storicoMapper;
    
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
    
    @Transactional
    public OffertaDTO gestisciOfferta(Integer idOfferta, String stato, Double prezzo, String nota, UUID idAgente) {
        Offerta offerta = offertaRepo.findById(idOfferta)
            .orElseThrow(() -> new RuntimeException("Offerta non trovata"));

        // Verifica che l'agente sia il proprietario dell'immobile legato all'offerta
        if (!offerta.getImmobile().getAgente().getIdUtente().equals(idAgente)) {
            throw new RuntimeException("Non sei autorizzato a gestire questa offerta");
        }

        String statoPrecedente = offerta.getStato();
        offerta.setStato(stato.toUpperCase());
        
        // Se è una controfferta, aggiorniamo il prezzo offerto (quello della negoziazione)
        if ("CONTROFFERTA_AGENTE".equals(stato.toUpperCase()) && prezzo != null) {
            offerta.setPrezzoOfferto(prezzo);
        }

        Offerta aggiornata = offertaRepo.save(offerta);

        // TRACKING: Usiamo il Mapper per lo storico
        StoricoOfferta log = storicoMapper.createLog(aggiornata, idAgente, nota != null ? nota : "Azione agente: " + stato);
        log.setStatoPrecedente(statoPrecedente);
        storicoRepo.save(log);

        return offertaMapper.offertaToDTO(aggiornata);
    }
    
    public List<StoricoOffertaDTO> getStoricoOfferta(Integer idOfferta, UUID idAgente) {
        // 1. Verifichiamo che l'offerta esista
        Offerta offerta = offertaRepo.findById(idOfferta)
            .orElseThrow(() -> new RuntimeException("Offerta non trovata"));

        // 2. Sicurezza: solo l'agente dell'immobile (o il cliente dell'offerta) può vedere lo storico
        if (!offerta.getImmobile().getAgente().getIdUtente().equals(idAgente)) {
            throw new RuntimeException("Accesso negato allo storico");
        }

        // 3. Recuperiamo i log ordinati per data decrescente
        List<StoricoOfferta> logList = storicoRepo.findByOffertaOrderByIdLogDesc(offerta);

        return logList.stream()
                      .map(storicoMapper::toDTO)
                      .collect(Collectors.toList());
    }
    
    public List<OffertaDTO> getOffertePerAgente(UUID idAgente) {
        // Carica tutto per lo storico
        return offertaRepo.findByImmobile_Agente_IdUtente(idAgente)
                .stream().map(offertaMapper::offertaToDTO).toList();
    }
    
    public List<OffertaDTO> getOfferteAttivePerAgente(UUID idAgente) {
        return offertaRepo.findByImmobile_Agente_IdUtenteAndStato(idAgente, "IN_ATTESA")
                .stream()
                .map(offertaMapper::offertaToDTO)
                .collect(Collectors.toList());
    }
}
