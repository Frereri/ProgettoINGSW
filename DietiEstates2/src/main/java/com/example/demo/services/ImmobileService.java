package com.example.demo.services;

import com.example.demo.dto.ImmobileDTO;
import com.example.demo.dto.ImmobileImmagineDTO;
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

    private final ImmobileRepo repo;
    private final AgenziaRepo agenziaRepo;
    private final AgenteRepo agenteRepo;
    private final IImmobileMapper mapper;
    private final GeoService geoService;

    public ImmobileService(ImmobileRepo repo, AgenziaRepo agenziaRepo, AgenteRepo agenteRepo, IImmobileMapper mapper,
			GeoService geoService) {
		this.repo = repo;
		this.agenziaRepo = agenziaRepo;
		this.agenteRepo = agenteRepo;
		this.mapper = mapper;
		this.geoService = geoService;
	}

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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agenzia ID " + dto.getIdAgenzia() + " non trovata"));

        Agente agente = agenteRepo.findById(dto.getIdAgente())
            .orElseGet(() -> {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Agente non trovato nel database");
            });
        Immobile immobile;
        if ("VILLA".equalsIgnoreCase(dto.getTipoImmobile())) {
            immobile = mapper.immobileDTOtoVilla(dto);
        } else {
            immobile = mapper.immobileDTOtoAppartamento(dto);
        }

        if (dto.getImmagini() != null && !dto.getImmagini().isEmpty()) {
            List<ImmobileImmagine> immagini = dto.getImmagini().stream()
                .map(imgDto -> {
                    ImmobileImmagine entity = new ImmobileImmagine();
                    entity.setUrlImmagine(imgDto.getUrlImmagine());
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
        
        if (immobile.getLatitudine() != null && immobile.getLongitudine() != null) {
            immobile.setVicinoScuole(geoService.isNear(immobile.getLatitudine(), immobile.getLongitudine(), "education.school"));
            immobile.setVicinoParchi(geoService.isNear(immobile.getLatitudine(), immobile.getLongitudine(), "leisure.park"));
            immobile.setVicinoTrasporti(geoService.isNear(immobile.getLatitudine(), immobile.getLongitudine(), "public_transport"));
        }
        
        if (immobile.getStato() == null) immobile.setStato("DISPONIBILE");

        Immobile salvato = repo.save(immobile);
        return mapper.immobileToDTO(salvato);
    }
    
    @Transactional
    public ImmobileDTO updateImmobile(Integer id, ImmobileDTO dto) {
        Immobile immobile = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Immobile non trovato"));

        boolean indirizzoCambiato = !immobile.getIndirizzo().equalsIgnoreCase(dto.getIndirizzo()) || 
                !immobile.getCitta().equalsIgnoreCase(dto.getCitta());
        
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
        
        if (immobile instanceof Appartamento appartamento) {
            mapper.updateAppartamentoFromDTO(dto, appartamento);
        } else if (immobile instanceof Villa villa) {
            mapper.updateVillaFromDTO(dto, villa);
        }

        if (indirizzoCambiato) {
            Map<String, Double> coords = geoService.getCoordinates(immobile.getIndirizzo() + ", " + immobile.getCitta());
            
            if (coords != null && coords.containsKey("lat")) {
                immobile.setLatitudine(coords.get("lat"));
                immobile.setLongitudine(coords.get("lon"));

                immobile.setVicinoScuole(geoService.isNear(immobile.getLatitudine(), immobile.getLongitudine(), "education.school,education.university"));
                immobile.setVicinoParchi(geoService.isNear(immobile.getLatitudine(), immobile.getLongitudine(), "leisure.park,national_park"));
                immobile.setVicinoTrasporti(geoService.isNear(immobile.getLatitudine(), immobile.getLongitudine(), "public_transport.subway,public_transport.train,public_transport.bus"));
                
            }
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