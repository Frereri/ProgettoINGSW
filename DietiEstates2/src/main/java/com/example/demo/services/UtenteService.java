package com.example.demo.services;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.dto.AgenteDTO;
import com.example.demo.dto.CreazioneStaffDTO;
import com.example.demo.dto.GestoreDTO;
import com.example.demo.dto.RegistrazioneClienteDTO;
import com.example.demo.dto.UtenteDTO;
import com.example.demo.mapper.IUtenteMapper;
import com.example.demo.models.Agente;
import com.example.demo.models.Agenzia;
import com.example.demo.models.Cliente;
import com.example.demo.models.Gestore;
import com.example.demo.models.Utente;
import com.example.demo.repositories.AgenziaRepo;
import com.example.demo.repositories.UtenteRepo;

@Service
public class UtenteService {

    private final UtenteRepo utenteRepo;
	private final AgenziaRepo agenziaRepo;
    private final IUtenteMapper utenteMapper;
    private final AuthService authService;

    public UtenteService(UtenteRepo utenteRepo, AgenziaRepo agenziaRepo, IUtenteMapper utenteMapper,
			AuthService authService) {
		this.utenteRepo = utenteRepo;
		this.agenziaRepo = agenziaRepo;
		this.utenteMapper = utenteMapper;
		this.authService = authService;
	}

	public List<UtenteDTO> findAll() {
        return utenteRepo.findAll().stream()
                .map(utenteMapper::toDTO)
                .toList();
    }

    public UtenteDTO findById(UUID id) {
        Utente utente = utenteRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utente non trovato"));
        return utenteMapper.toDTO(utente);
    }

    public boolean existsByEmail(String email) {
        return utenteRepo.existsByEmail(email);
    }

    public void delete(UUID id) {
        Utente utente = utenteRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Impossibile eliminare: utente non trovato"));

        try {
            authService.deleteUser(utente.getEmail());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Errore durante l'eliminazione su AWS: " + e.getMessage());
        }

        utenteRepo.deleteById(id);
    }
    
    public UtenteDTO save(UtenteDTO dto) {
        if (dto.getIdUtente() == null) {
        	throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID utente mancante per l'aggiornamento");
    	}

        Utente entity = utenteRepo.findById(dto.getIdUtente())
                .orElseThrow(() -> new RuntimeException("Utente non trovato con ID: " + dto.getIdUtente()));

        entity.setNome(dto.getNome());
        entity.setCognome(dto.getCognome());
        entity.setEmail(dto.getEmail());

        if (dto instanceof GestoreDTO gestoredto && entity instanceof Gestore gEntity && gestoredto.getIdAgenzia() != null) {
            Agenzia agenzia = agenziaRepo.findById(gestoredto.getIdAgenzia())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agenzia non trovata"));
            gEntity.setAgenzia(agenzia);
        } else if (dto instanceof AgenteDTO aDto && entity instanceof Agente aEntity && aDto.getIdAgenzia() != null) {
            Agenzia agenzia = agenziaRepo.findById(aDto.getIdAgenzia())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agenzia non trovata"));
            aEntity.setAgenzia(agenzia);
        }

        Utente salvato = utenteRepo.save(entity);

        return utenteMapper.toDTO(salvato);
    }
    
    public UtenteDTO registraCliente(RegistrazioneClienteDTO request) {
        if (existsByEmail(request.getDatiProfilo().getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email già presente");
        }
        String cognitoSub = authService.signUp(request.getDatiProfilo().getEmail(), request.getPassword());
        authService.confirmUser(request.getDatiProfilo().getEmail());
        Cliente cliente = utenteMapper.toEntityFromRegister(request);
        cliente.setIdUtente(UUID.fromString(cognitoSub));   
        return utenteMapper.toDTO(utenteRepo.save(cliente));
    }

    public UtenteDTO creaStaff(CreazioneStaffDTO request) {
        if (existsByEmail(request.getDatiProfilo().getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email già presente");
        }

        String cognitoSub = authService.adminCreateUser(request.getDatiProfilo().getEmail());

        Utente staff = utenteMapper.toEntity(request.getDatiProfilo());
        staff.setIdUtente(UUID.fromString(cognitoSub));
        
        return utenteMapper.toDTO(utenteRepo.save(staff));
    }
}
