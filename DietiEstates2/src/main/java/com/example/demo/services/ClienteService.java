package com.example.demo.services;

import java.util.UUID;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.DTO.OffertaDTO;
import com.example.demo.mapper.IOffertaMapper;
import com.example.demo.mapper.IStoricoOffertaMapper;
import com.example.demo.models.Cliente;
import com.example.demo.models.Immobile;
import com.example.demo.models.Offerta;
import com.example.demo.models.StoricoOfferta;
import com.example.demo.repositories.ClienteRepo;
import com.example.demo.repositories.ImmobileRepo;
import com.example.demo.repositories.OffertaRepo;
import com.example.demo.repositories.StoricoRepo;

import jakarta.transaction.Transactional;

@Service
public class ClienteService {

	@Autowired
    private ClienteRepo clienteRepo;
	
    @Autowired
    private OffertaRepo offertaRepo;
    
    @Autowired
    private ImmobileRepo immobileRepo;
    
    @Autowired
    private StoricoRepo storicoRepo;
    
    @Autowired
    private IOffertaMapper offertaMapper;
    
    @Autowired
    private IStoricoOffertaMapper storicoMapper;
    
    @Transactional // Fondamentale: se fallisce lo storico, non deve salvare nemmeno l'offerta
    public OffertaDTO inviaOfferta(OffertaDTO dto, UUID idCliente) {
        // 1. Recupero dati dal DB
        Cliente cliente = clienteRepo.findByIdUtente(idCliente)
            .orElseThrow(() -> new RuntimeException("Cliente non trovato"));
        Immobile immobile = immobileRepo.findById(dto.getIdImmobile())
            .orElseThrow(() -> new RuntimeException("Immobile non trovato"));

        // 2. Mapping DTO -> Entity (Usa le constant "IN_ATTESA" che abbiamo messo nel mapper)
        Offerta nuovaOfferta = offertaMapper.dtoToOfferta(dto);
        nuovaOfferta.setCliente(cliente);
        nuovaOfferta.setImmobile(immobile);
        nuovaOfferta.setPrezzoOriginale(immobile.getPrezzo());

        // 3. Salvataggio Offerta
        Offerta salvata = offertaRepo.save(nuovaOfferta);

        // 4. CREAZIONE LOG STORICO (Tracking richiesto dalla traccia)
        StoricoOfferta log = storicoMapper.createLog(salvata, idCliente, "Offerta iniziale creata dal cliente");
        storicoRepo.save(log);        
        storicoRepo.save(log);

        return offertaMapper.offertaToDTO(salvata);
    }

    @Transactional
    public OffertaDTO aggiornaStatoOfferta(Integer idOfferta, UUID idClienteDalToken, String nuovoStato) {
        Offerta offerta = offertaRepo.findById(idOfferta)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offerta non trovata"));

        // Se 'cliente' è l'oggetto correlato, prendiamo il suo ID
        // Sostituisci .getIdUtente() con il nome esatto del getter nel tuo modello Utente
        UUID idProprietarioOfferta = offerta.getCliente().getIdUtente(); 

        if (!idProprietarioOfferta.equals(idClienteDalToken)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Non puoi gestire questa offerta");
        }

        offerta.setStato(nuovoStato);
        offerta.setDataUltimoAggiornamento(LocalDateTime.now());
        
        return offertaMapper.offertaToDTO(offertaRepo.save(offerta));
    }
    
    public List<OffertaDTO> getOffertePerCliente(UUID uuidUtente) {
        // Cerchiamo l'utente tramite il suo UUID invece dell'email
        Cliente cliente = clienteRepo.findByIdUtente(uuidUtente)
            .orElseThrow(() -> new RuntimeException("Cliente non trovato con UUID: " + uuidUtente));

        List<Offerta> offerte = offertaRepo.findByClienteAndOffertaEsternaFalse(cliente);

        return offerte.stream()
                      .map(offertaMapper::offertaToDTO)
                      .collect(Collectors.toList());
    }
}
