package com.example.demo.services;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.DTO.AgenteDTO;
import com.example.demo.DTO.CreazioneStaffDTO;
import com.example.demo.DTO.GestoreDTO;
import com.example.demo.DTO.RegistrazioneClienteDTO;
import com.example.demo.DTO.UtenteDTO;
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

	@Autowired
    private UtenteRepo utenteRepo;
	
	@Autowired
	private AgenziaRepo agenziaRepo;

    @Autowired
    private IUtenteMapper utenteMapper;
    
    @Autowired
    private AuthService authService;

    public List<UtenteDTO> findAll() {
        return utenteRepo.findAll().stream()
                .map(utenteMapper::toDTO)
                .collect(Collectors.toList());
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
        if (!utenteRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Impossibile eliminare: utente non trovato");
        }
        utenteRepo.deleteById(id);
    }
    
    public UtenteDTO save(UtenteDTO dto) {
        // 1. Recupero l'entità esistente dal DB usando l'ID dal DTO
        // Se dto.getId() ti dà errore, assicurati che UtenteDTO abbia il metodo getId()
        if (dto.getIdUtente() == null) {
            throw new RuntimeException("ID utente mancante per l'aggiornamento");
        }

        Utente entity = utenteRepo.findById(dto.getIdUtente())
                .orElseThrow(() -> new RuntimeException("Utente non trovato con ID: " + dto.getIdUtente()));

        // 2. Aggiornamento campi comuni (Nome, Cognome)
        // Non usiamo il mapper per creare una nuova entità, ma aggiorniamo quella esistente
        // per non perdere i vincoli di JPA (come la sessione o campi non presenti nel DTO)
        entity.setNome(dto.getNome());
        entity.setCognome(dto.getCognome());
        entity.setEmail(dto.getEmail());

        // 3. Gestione logica specifica per i ruoli che hanno relazioni (Agenzia)
        if (dto instanceof GestoreDTO && entity instanceof Gestore) {
            GestoreDTO gDto = (GestoreDTO) dto;
            Gestore gEntity = (Gestore) entity;
            
            if (gDto.getIdAgenzia() != null) {
                // Cerchiamo l'agenzia nel repository delle agenzie
                Agenzia agenzia = agenziaRepo.findById(gDto.getIdAgenzia())
                    .orElseThrow(() -> new RuntimeException("Agenzia non trovata"));
                gEntity.setAgenzia(agenzia);
            }
        } else if (dto instanceof AgenteDTO && entity instanceof Agente) {
            AgenteDTO aDto = (AgenteDTO) dto;
            Agente aEntity = (Agente) entity;
            
            if (aDto.getIdAgenzia() != null) {
                Agenzia agenzia = agenziaRepo.findById(aDto.getIdAgenzia())
                    .orElseThrow(() -> new RuntimeException("Agenzia non trovata"));
                aEntity.setAgenzia(agenzia);
            }
        }

        // 4. Salvataggio su DB
        Utente salvato = utenteRepo.save(entity);

        // 5. Ritorno del DTO aggiornato usando il mapper che hai postato
        // Sostituisce il vecchio "convertToDTO"
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
