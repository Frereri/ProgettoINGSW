package com.example.demo.services;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.dto.GestoreDTO;
import com.example.demo.dto.SupportoAmministratoreDTO;
import com.example.demo.mapper.IUtenteMapper;
import com.example.demo.models.Agenzia;
import com.example.demo.models.Gestore;
import com.example.demo.models.SupportoAmministratore;
import com.example.demo.repositories.AgenziaRepo;
import com.example.demo.repositories.UtenteRepo;

@Service
public class AmministratoreService {

    private final UtenteRepo utenteRepo;
    private final AgenziaRepo agenziaRepo;
    private final IUtenteMapper utenteMapper;
    private final AuthService authService;

    public AmministratoreService(UtenteRepo utenteRepo, AgenziaRepo agenziaRepo, IUtenteMapper utenteMapper,
			AuthService authService) {
		this.utenteRepo = utenteRepo;
		this.agenziaRepo = agenziaRepo;
		this.utenteMapper = utenteMapper;
		this.authService = authService;
	}

	public GestoreDTO creaGestore(GestoreDTO dto) {
        String sub = authService.adminCreateUser(dto.getEmail());
        authService.setUserPasswordPermanent(dto.getEmail(), "DefaultPass123!");
        authService.addUserToGroup(dto.getEmail(), "Gestori");
        Gestore gestore = utenteMapper.toGestoreEntity(dto);
        gestore.setIdUtente(UUID.fromString(sub));
        gestore.setRuolo("GESTORE");
        Agenzia agenzia = agenziaRepo.findById(dto.getIdAgenzia())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agenzia non trovata"));
        gestore.setAgenzia(agenzia);
        Gestore salvato = utenteRepo.save(gestore);

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
