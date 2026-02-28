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
import com.example.demo.repositories.GestoreRepo;
import com.example.demo.repositories.SupportoRepo;

@Service
public class AmministratoreService {

    @Autowired
    private GestoreRepo gestoreRepo;
    @Autowired
    private AgenziaRepo agenziaRepo;
    @Autowired
    private SupportoRepo supportoRepo;
    @Autowired
    private IUtenteMapper utenteMapper;
    
    @Autowired
    private AuthService authService;

    public GestoreDTO creaGestore(GestoreDTO gestoreDto, Integer idAgenzia) {
        Agenzia agenzia = agenziaRepo.findById(idAgenzia)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agenzia non trovata"));

        String cognitoSub = authService.adminCreateUser(gestoreDto.getEmail());

        //Imposta password fissa e confermata
        authService.setUserPasswordPermanent(gestoreDto.getEmail(), "DefaultPass123!");
        
        Gestore gestore = utenteMapper.toGestoreEntity(gestoreDto);
        gestore.setAgenzia(agenzia);     
        gestore.setIdUtente(UUID.fromString(cognitoSub));
        return utenteMapper.toGestoreDTO(gestoreRepo.save(gestore));
    }

    public SupportoAmministratoreDTO creaSupporto(SupportoAmministratoreDTO supportoDto) {
        String cognitoSub = authService.adminCreateUser(supportoDto.getEmail());

        //Imposta password fissa e confermata
        authService.setUserPasswordPermanent(supportoDto.getEmail(), "DefaultPass123!");
        
        SupportoAmministratore supporto = utenteMapper.toSupportoAmministratoreEntity(supportoDto);
        supporto.setIdUtente(UUID.fromString(cognitoSub));
        return utenteMapper.toSupportoAmministratoreDTO(supportoRepo.save(supporto));
    }
}
