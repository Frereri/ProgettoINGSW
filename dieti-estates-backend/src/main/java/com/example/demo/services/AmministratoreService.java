package com.example.demo.services;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.DTO.GestoreDTO;
import com.example.demo.DTO.SupportoAmministratoreDTO;
import com.example.demo.mapper.IUtenteMapper;
import com.example.demo.models.Agenzia;
import com.example.demo.models.Gestore;
import com.example.demo.models.SupportoAmministratore;
import com.example.demo.repositories.AgenziaRepo;
import com.example.demo.repositories.UtenteRepo;

@Service
public class AmministratoreService {

	@Autowired
    private UtenteRepo utenteRepo;

    @Autowired
    private AgenziaRepo agenziaRepo;

    @Autowired
    private IUtenteMapper utenteMapper;
    
    @Autowired
    private AuthService authService;

    public GestoreDTO creaGestore(GestoreDTO dto) {
    	System.out.println("1. Inizio creazione Gestore per email: " + dto.getEmail());
        // 1. Creazione su Cognito
        String sub = authService.adminCreateUser(dto.getEmail());
        System.out.println("2. Creato su Cognito con SUB: " + sub);
        authService.setUserPasswordPermanent(dto.getEmail(), "DefaultPass123!");
        authService.addUserToGroup(dto.getEmail(), "Gestori");
        System.out.println("3. Aggiunto al gruppo Gestori");
        // 2. Salvataggio su DB
        Gestore gestore = utenteMapper.toGestoreEntity(dto);
        gestore.setIdUtente(UUID.fromString(sub));
        gestore.setRuolo("GESTORE");
        System.out.println("4. Mapping completato");
        
        // Collega l'agenzia passata nel DTO
        Agenzia agenzia = agenziaRepo.findById(dto.getIdAgenzia())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agenzia non trovata"));
        gestore.setAgenzia(agenzia);
        Gestore salvato = utenteRepo.save(gestore);
        System.out.println("5. Salvataggio su DB completato con successo!");

        return utenteMapper.toGestoreDTO(salvato);
    }

    public SupportoAmministratoreDTO creaSupporto(SupportoAmministratoreDTO dto) {
        String sub = authService.adminCreateUser(dto.getEmail());
        authService.setUserPasswordPermanent(dto.getEmail(), "DefaultPass123!");
        authService.addUserToGroup(dto.getEmail(), "Supporto");

        SupportoAmministratore supporto = utenteMapper.toSupportoAmministratoreEntity(dto);
        supporto.setIdUtente(UUID.fromString(sub));
        supporto.setRuolo("SUPPORTO_AMMINISTRATORE");

        return utenteMapper.toSupportoAmministratoreDTO(utenteRepo.save(supporto));
    }
}
