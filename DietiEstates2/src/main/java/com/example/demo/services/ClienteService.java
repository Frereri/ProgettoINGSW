package com.example.demo.services;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.DTO.OffertaDTO;
import com.example.demo.mapper.IOffertaMapper;
import com.example.demo.models.Cliente;
import com.example.demo.models.Immobile;
import com.example.demo.models.Offerta;
import com.example.demo.models.StoricoOfferta;
import com.example.demo.repositories.ImmobileRepo;
import com.example.demo.repositories.OffertaRepo;
import com.example.demo.repositories.StoricoRepo;
import com.example.demo.repositories.UtenteRepo;

@Service
public class ClienteService {

	@Autowired
    private UtenteRepo utenteRepo;
	
    @Autowired
    private OffertaRepo offertaRepo;
    
    @Autowired
    private ImmobileRepo immobileRepo;
    
    @Autowired
    private StoricoRepo storicoRepo;
    
    @Autowired
    private IOffertaMapper offertaMapper;
    
    public OffertaDTO inviaOfferta(OffertaDTO dto, UUID idCliente) {
        Immobile immobile = immobileRepo.findById(dto.getIdImmobile())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Immobile non trovato"));

        Offerta offerta = offertaMapper.dtoToOfferta(dto);
        
        Cliente cliente = (Cliente) utenteRepo.findById(idCliente)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente non trovato"));

        offerta.setCliente(cliente);
        offerta.setImmobile(immobile);
        offerta.setPrezzoOriginale(immobile.getPrezzo());
        offerta.setStato("IN_ATTESA");

        Offerta salvata = offertaRepo.save(offerta);

        StoricoOfferta logIniziale = new StoricoOfferta();
        logIniziale.setOfferta(salvata);
        logIniziale.setNuovoStato("IN_ATTESA");
        logIniziale.setPrezzoScambiato(dto.getPrezzoOfferto());
        logIniziale.setAutoreAzione(idCliente);
        logIniziale.setNota("Offerta iniziale inviata dal cliente");
        storicoRepo.save(logIniziale);

        return offertaMapper.offertaToDTO(salvata);
    }

    public OffertaDTO rispondiAControfferta(Integer idOfferta, String stato, String nota, UUID idCliente) {
        Offerta offerta = offertaRepo.findById(idOfferta)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offerta non trovata"));

        if (!offerta.getCliente().getIdUtente().equals(idCliente)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Non autorizzato");
        }

        StoricoOfferta log = new StoricoOfferta();
        log.setOfferta(offerta);
        log.setStatoPrecedente(offerta.getStato());
        log.setNuovoStato(stato.toUpperCase());
        log.setPrezzoScambiato(offerta.getPrezzoControfferta());
        log.setNota(nota);
        log.setAutoreAzione(idCliente);
        storicoRepo.save(log);

        offerta.setStato(stato.toUpperCase());
        if ("ACCETTATA".equals(stato.toUpperCase())) {
            offerta.getImmobile().setStato("VENDUTO");
        }

        return offertaMapper.offertaToDTO(offertaRepo.save(offerta));
    }
}
