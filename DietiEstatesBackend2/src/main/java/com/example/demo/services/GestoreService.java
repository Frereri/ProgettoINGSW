package com.example.demo.services;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.DTO.AgenteDTO;
import com.example.demo.DTO.ImmobileDTO;
import com.example.demo.mapper.IImmobileMapper;
import com.example.demo.mapper.IUtenteMapper;
import com.example.demo.models.Agente;
import com.example.demo.models.Gestore;
import com.example.demo.repositories.AgenteRepo;
import com.example.demo.repositories.GestoreRepo;
import com.example.demo.repositories.ImmobileRepo;

@Service
public class GestoreService {

    private final GestoreRepo gestoreRepo;
    private final AgenteRepo agenteRepo;
    private final ImmobileRepo immobileRepo;
    private final IImmobileMapper immobileMapper;
    private final IUtenteMapper utenteMapper;
    private final AuthService authService;

    public GestoreService(GestoreRepo gestoreRepo, AgenteRepo agenteRepo, ImmobileRepo immobileRepo,
			IImmobileMapper immobileMapper, IUtenteMapper utenteMapper, AuthService authService) {
		this.gestoreRepo = gestoreRepo;
		this.agenteRepo = agenteRepo;
		this.immobileRepo = immobileRepo;
		this.immobileMapper = immobileMapper;
		this.utenteMapper = utenteMapper;
		this.authService = authService;
	}

	public AgenteDTO creaAgente(UUID idGestore, AgenteDTO nuovoAgenteDto) {
        Gestore gestore = gestoreRepo.findById(idGestore)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gestore non trovato"));

        String cognitoSub = authService.adminCreateUser(nuovoAgenteDto.getEmail());

        authService.setUserPasswordPermanent(nuovoAgenteDto.getEmail(), "DefaultPass123!");
        authService.addUserToGroup(nuovoAgenteDto.getEmail(), "Agenti");

        Agente agente = utenteMapper.toAgenteEntity(nuovoAgenteDto);
        agente.setIdUtente(UUID.fromString(cognitoSub));
        agente.setAgenzia(gestore.getAgenzia());
        agente.setRuolo("AGENTE");

        Agente salvato = agenteRepo.save(agente);
        
        return utenteMapper.toAgenteDTO(salvato);
    }
    
    public List<AgenteDTO> getAgentiAgenzia(UUID idGestore) {
        Gestore g = gestoreRepo.findById(idGestore).orElseThrow();
        return agenteRepo.findByAgenzia_IdAgenzia(g.getAgenzia().getIdAgenzia())
                .stream().map(utenteMapper::toAgenteDTO).toList();
    }

    public List<ImmobileDTO> getImmobiliAgenzia(UUID idGestore) {
        Gestore g = gestoreRepo.findById(idGestore).orElseThrow();
        return immobileRepo.findByAgenzia_IdAgenzia(g.getAgenzia().getIdAgenzia())
                .stream().map(immobileMapper::immobileToDTO).toList();
    }
    
    public AgenteDTO aggiornaAgente(UUID idAgente, AgenteDTO dto) {
        Agente agente = agenteRepo.findById(idAgente)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agente non trovato"));
        
        agente.setNome(dto.getNome());
        agente.setCognome(dto.getCognome());
        
        Agente salvato = agenteRepo.save(agente);
        return utenteMapper.toAgenteDTO(salvato);
    }

    public void eliminaAgente(UUID idAgente) {
        agenteRepo.deleteById(idAgente);
    }
}
