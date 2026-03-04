package com.example.demo.services;

import com.example.demo.DTO.ImmobileDTO;
import com.example.demo.mapper.IImmobileMapper;
import com.example.demo.models.Agente;
import com.example.demo.models.Agenzia;
import com.example.demo.models.Immobile;
import com.example.demo.repositories.AgenteRepo;
import com.example.demo.repositories.AgenziaRepo;
import com.example.demo.repositories.ImmobileRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

@Service
public class ImmobileService {

	@Autowired
    private ImmobileRepo repo;
    
    @Autowired
    private AgenziaRepo agenziaRepo;
    
    @Autowired
    private AgenteRepo agenteRepo;
    
    @Autowired
    private IImmobileMapper mapper;
    
    @Autowired
    private GeoService geoService;

    public Page<ImmobileDTO> getAllImmobili(Pageable pageable) {
        return repo.findAll(pageable)
                   .map(mapper::immobileToDTO); 
    }
    
    public ImmobileDTO getImmobileById(Integer id) {
        Immobile immobile = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Immobile non trovato"));
        return mapper.immobileToDTO(immobile);
    }

    public List<ImmobileDTO> searchImmobili(String citta, double min, double max, String contratto) {
    	String cittaParam = (citta != null && !citta.isBlank()) ? citta : null;
        String contrattoParam = (contratto != null && !contratto.isBlank()) ? contratto : null;
    	
    	return repo.searchImmobiliAvanzata(cittaParam, min, max, contrattoParam)
                .stream()
                .map(mapper::immobileToDTO)
                .toList();
    }

    @Transactional
    public ImmobileDTO saveImmobileFromDTO(ImmobileDTO dto) {
        Agenzia agenzia = agenziaRepo.findById(dto.getIdAgenzia())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agenzia non trovata"));

        UUID uuidAgente = UUID.fromString(dto.getIdAgente().toString()); 
        Agente agente = agenteRepo.findById(uuidAgente)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agente non trovato"));
        Immobile immobile;
        if ("VILLA".equalsIgnoreCase(dto.getTipoImmobile())) {
            immobile = mapper.immobileDTOtoVilla(dto);
        } else {
            immobile = mapper.immobileDTOtoAppartamento(dto);
        }

        immobile.setAgenzia(agenzia);
        immobile.setAgente(agente);
        
        // Logica Geoapify (Traccia: Servizi vicini)
        if (dto.getLatitudine() != null && dto.getLongitudine() != null) {
            immobile.setVicinoScuole(geoService.isNear(dto.getLatitudine(), dto.getLongitudine(), "education.school"));
            immobile.setVicinoParchi(geoService.isNear(dto.getLatitudine(), dto.getLongitudine(), "leisure.park"));
            immobile.setVicinoTrasporti(geoService.isNear(dto.getLatitudine(), dto.getLongitudine(), "public_transport"));
        }
        
        if (immobile.getStato() == null) immobile.setStato("DISPONIBILE");

        Immobile salvato = repo.save(immobile);
        return mapper.immobileToDTO(salvato);
    }

    public void deleteImmobile(Integer id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Immobile non trovato");
        }
        repo.deleteById(id);
    }
    
}