package com.example.demo.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.demo.DTO.OffertaDTO;
import com.example.demo.mapper.IOffertaMapper;
import com.example.demo.models.Cliente;
import com.example.demo.models.Immobile;
import com.example.demo.models.Offerta;
import com.example.demo.repositories.ClienteRepo;
import com.example.demo.repositories.ImmobileRepo;
import com.example.demo.repositories.OffertaRepo;

import jakarta.transaction.Transactional;

@Service
public class OffertaService {

    private final OffertaRepo offertaRepo;
    private final ClienteRepo clienteRepo;
    private final ImmobileRepo immobileRepo;
    private final IOffertaMapper mapper;

    public OffertaService(OffertaRepo offertaRepo, ClienteRepo clienteRepo, ImmobileRepo immobileRepo,
			IOffertaMapper mapper) {
		this.offertaRepo = offertaRepo;
		this.clienteRepo = clienteRepo;
		this.immobileRepo = immobileRepo;
		this.mapper = mapper;
	}

	@Transactional
    public OffertaDTO createOfferta(OffertaDTO dto) {
        Immobile immobile = immobileRepo.findById(dto.getIdImmobile())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Immobile non trovato"));

        Offerta offerta = mapper.dtoToOfferta(dto);
        offerta.setImmobile(immobile);
        offerta.setPrezzoOriginale(immobile.getPrezzo());
        offerta.setStato("IN_ATTESA");
        offerta.setDataCreazione(LocalDateTime.now());
        offerta.setDataUltimoAggiornamento(LocalDateTime.now());

        if (dto.getIdCliente() == null) {
        	offerta.setOffertaEsterna(true);
            if (dto.getNomeCognomeCliente() == null || dto.getNomeCognomeCliente().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome obbligatorio per offerta esterna");
            }
            offerta.setCliente(null);
            offerta.setNomeClienteEsterno(dto.getNomeCognomeCliente());
        } else {
            Cliente cliente = clienteRepo.findById(dto.getIdCliente())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente registrato non trovato"));
            
            offerta.setCliente(cliente);
            offerta.setNomeClienteEsterno(null);
        }

        return mapper.offertaToDTO(offertaRepo.save(offerta));
    }

    @Transactional
    public OffertaDTO aggiornaStato(Integer id, String nuovoStato, Double controfferta) {
        Offerta offerta = offertaRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offerta non trovata"));

        String statoUpper = nuovoStato.toUpperCase();
        offerta.setStato(statoUpper);
        offerta.setDataUltimoAggiornamento(LocalDateTime.now());

        if ("CONTROFFERTA".equals(statoUpper)) {
            if (controfferta == null || controfferta <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Prezzo controfferta non valido");
            }
            offerta.setPrezzoControfferta(controfferta);
        }

        return mapper.offertaToDTO(offertaRepo.save(offerta));
    }

    public List<OffertaDTO> findAll() {
        return offertaRepo.findAll().stream()
                .map(mapper::offertaToDTO)
                .toList();
    }

    public List<OffertaDTO> findByCliente(UUID idCliente) {
        return offertaRepo.findByCliente_IdUtente(idCliente).stream()
                .map(mapper::offertaToDTO)
                .toList();
    }

    public List<OffertaDTO> getOffertePerImmobile(Integer idImmobile) {
        if (!immobileRepo.existsById(idImmobile)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Immobile non trovato");
        }
        return offertaRepo.findByImmobile_IdImmobile(idImmobile).stream()
                .map(mapper::offertaToDTO)
                .toList();
    }
    
    public List<OffertaDTO> getOffertePerAgente(UUID idAgente) {
        return offertaRepo.findByImmobile_Agente_IdUtente(idAgente).stream()
                .map(mapper::offertaToDTO)
                .toList();
    }
}
