package com.example.demo.services;

import com.example.demo.DTO.ImmobileDTO;
import com.example.demo.DTO.ImmobileImmagineDTO;
import com.example.demo.mapper.IImmobileMapper;
import com.example.demo.models.Agente;
import com.example.demo.models.Agenzia;
import com.example.demo.models.Appartamento;
import com.example.demo.models.Immobile;
import com.example.demo.models.ImmobileImmagine;
import com.example.demo.models.Villa;
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
import java.util.Map;
import java.util.Objects;
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
        // 1. Recupero Agenzia
        Agenzia agenzia = agenziaRepo.findById(dto.getIdAgenzia())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agenzia ID " + dto.getIdAgenzia() + " non trovata"));

        // 2. Recupero Agente (Semplificato)
        // Assicurati che dto.getIdAgente() restituisca l'UUID corretto
        Agente agente = agenteRepo.findById(dto.getIdAgente())
            .orElseGet(() -> {
                System.out.println("ERRORE: Agente con ID " + dto.getIdAgente() + " non trovato nel repository AgenteRepo!");
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Agente non trovato nel database specifico");
            });
        Immobile immobile;
        // 3. Mapping basato sul tipo
        if ("VILLA".equalsIgnoreCase(dto.getTipoImmobile())) {
            immobile = mapper.immobileDTOtoVilla(dto);
        } else {
            immobile = mapper.immobileDTOtoAppartamento(dto);
        }

        // IMPORTANTE: Collegamento bidirezionale per le immagini
        if (dto.getImmagini() != null && !dto.getImmagini().isEmpty()) {
            List<ImmobileImmagine> immagini = dto.getImmagini().stream()
                .map(imgDto -> {
                    ImmobileImmagine entity = new ImmobileImmagine();
                    entity.setUrlImmagine(imgDto.getUrlImmagine());
                    // Uso isCopertina() come suggerito
                    entity.setCopertina(imgDto.isCopertina()); 
                    entity.setImmobile(immobile); 
                    return entity;
                }).toList();
            immobile.setImmagini(immagini);
        }

        immobile.setAgenzia(agenzia);
        immobile.setAgente(agente);
        
        if (dto.getLatitudine() == null || dto.getLongitudine() == null) {
            Map<String, Double> coords = geoService.getCoordinates(dto.getIndirizzo() + ", " + dto.getCitta());
            if (coords != null) {
                immobile.setLatitudine(coords.get("lat"));
                immobile.setLongitudine(coords.get("lon"));
            }
        }
        
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
    
    @Transactional
    public ImmobileDTO updateImmobile(Integer id, ImmobileDTO dto) {
        Immobile immobile = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Immobile non trovato"));

        for (ImmobileImmagineDTO imgDto : dto.getImmagini()) {
            if (imgDto.getIdImmagine() == null) {
                ImmobileImmagine nuovaImg = new ImmobileImmagine();
                nuovaImg.setUrlImmagine(imgDto.getUrlImmagine());
                nuovaImg.setCopertina(imgDto.isCopertina());
                nuovaImg.setImmobile(immobile);
                immobile.getImmagini().add(nuovaImg);
            }
        }
        
        if (dto.getImmagini() != null) {
            boolean nuovaCopertinaPresente = dto.getImmagini().stream().anyMatch(ImmobileImmagineDTO::isCopertina);
            if (nuovaCopertinaPresente) {
                immobile.getImmagini().forEach(img -> img.setCopertina(false));
            }
        }

        for (ImmobileImmagineDTO imgDto : dto.getImmagini()) {
            if (imgDto.getIdImmagine() != null) {
                immobile.getImmagini().stream()
                    .filter(i -> i.getIdImmagine().equals(imgDto.getIdImmagine()))
                    .findFirst()
                    .ifPresent(i -> i.setCopertina(imgDto.isCopertina()));
            }
        }
        
        if (immobile instanceof Appartamento) {
            mapper.updateAppartamentoFromDTO(dto, (Appartamento) immobile);
        } else if (immobile instanceof Villa) {
            mapper.updateVillaFromDTO(dto, (Villa) immobile);
        }

        List<Integer> idsDaTenere = dto.getImmagini().stream()
                .map(ImmobileImmagineDTO::getIdImmagine)
                .filter(Objects::nonNull)
                .toList();

        immobile.getImmagini().removeIf(img -> !idsDaTenere.contains(img.getIdImmagine()));

        for (ImmobileImmagine img : immobile.getImmagini()) {
            img.setImmobile(immobile);
        }

        Immobile salvato = repo.save(immobile);
        return mapper.immobileToDTO(salvato);
    }

    public void deleteImmobile(Integer id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Immobile non trovato");
        }
        repo.deleteById(id);
    }
    
    public List<ImmobileDTO> getImmobiliByAgenteAgenzia(UUID idAgente) {
        return repo.findByAgenziaAgentiIdUtente(idAgente)
                   .stream()
                   .map(mapper::immobileToDTO)
                   .toList();
    }
    
}