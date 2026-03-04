package com.example.demo.services;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.DTO.AgenteDTO;
import com.example.demo.mapper.IUtenteMapper;
import com.example.demo.models.Agente;
import com.example.demo.models.Gestore;
import com.example.demo.repositories.AgenteRepo;
import com.example.demo.repositories.GestoreRepo;

@Service
public class GestoreService {

    @Autowired
    private GestoreRepo gestoreRepo;

    @Autowired
    private AgenteRepo agenteRepo;

    @Autowired
    private IUtenteMapper utenteMapper;

    @Autowired
    private AuthService authService;

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
}
