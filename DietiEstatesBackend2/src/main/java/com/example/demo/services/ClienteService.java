package com.example.demo.services;

import java.util.UUID;
import java.time.LocalDateTime;
import java.util.List;

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

    private final ClienteRepo clienteRepo;
    private final OffertaRepo offertaRepo;
    private final ImmobileRepo immobileRepo;
    private final StoricoRepo storicoRepo;
    private final IOffertaMapper offertaMapper;
    private final IStoricoOffertaMapper storicoMapper;
    
    public ClienteService(ClienteRepo clienteRepo, OffertaRepo offertaRepo, ImmobileRepo immobileRepo,
			StoricoRepo storicoRepo, IOffertaMapper offertaMapper, IStoricoOffertaMapper storicoMapper) {
		this.clienteRepo = clienteRepo;
		this.offertaRepo = offertaRepo;
		this.immobileRepo = immobileRepo;
		this.storicoRepo = storicoRepo;
		this.offertaMapper = offertaMapper;
		this.storicoMapper = storicoMapper;
	}

	@Transactional
    public OffertaDTO inviaOfferta(OffertaDTO dto, UUID idCliente) {
        Cliente cliente = clienteRepo.findByIdUtente(idCliente)
            .orElseThrow(() -> new RuntimeException("Cliente non trovato"));
        Immobile immobile = immobileRepo.findById(dto.getIdImmobile())
            .orElseThrow(() -> new RuntimeException("Immobile non trovato"));

        Offerta nuovaOfferta = offertaMapper.dtoToOfferta(dto);
        nuovaOfferta.setCliente(cliente);
        nuovaOfferta.setImmobile(immobile);
        nuovaOfferta.setPrezzoOriginale(immobile.getPrezzo());

        Offerta salvata = offertaRepo.save(nuovaOfferta);

        StoricoOfferta log = storicoMapper.createLog(salvata, idCliente, "Offerta iniziale creata dal cliente");
        storicoRepo.save(log);        
        storicoRepo.save(log);

        return offertaMapper.offertaToDTO(salvata);
    }

    @Transactional
    public OffertaDTO aggiornaStatoOfferta(Integer idOfferta, UUID idClienteDalToken, String nuovoStato) {
        Offerta offerta = offertaRepo.findById(idOfferta)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offerta non trovata"));

        UUID idProprietarioOfferta = offerta.getCliente().getIdUtente(); 

        if (!idProprietarioOfferta.equals(idClienteDalToken)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Non puoi gestire questa offerta");
        }

        offerta.setStato(nuovoStato);
        offerta.setDataUltimoAggiornamento(LocalDateTime.now());
        
        return offertaMapper.offertaToDTO(offertaRepo.save(offerta));
    }
    
    public List<OffertaDTO> getOffertePerCliente(UUID uuidUtente) {
        Cliente cliente = clienteRepo.findByIdUtente(uuidUtente)
            .orElseThrow(() -> new RuntimeException("Cliente non trovato con UUID: " + uuidUtente));

        List<Offerta> offerte = offertaRepo.findByClienteAndOffertaEsternaFalse(cliente);

        return offerte.stream()
                      .map(offertaMapper::offertaToDTO)
                      .toList();
    }
}
