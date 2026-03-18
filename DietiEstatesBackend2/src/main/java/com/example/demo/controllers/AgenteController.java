package com.example.demo.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DTO.AgenteDTO;
import com.example.demo.DTO.ImmobileDTO;
import com.example.demo.DTO.OffertaDTO;
import com.example.demo.services.AgenteService;

@RestController
@RequestMapping("/api/agente")
public class AgenteController {

    private final AgenteService agenteService;

    public AgenteController(AgenteService agenteService) {
		this.agenteService = agenteService;
	}

	@GetMapping("/profilo")
    public ResponseEntity<AgenteDTO> getProfilo(@AuthenticationPrincipal Jwt jwt) {
        UUID idAgente = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(agenteService.getProfiloAgente(idAgente));
    }

    @GetMapping("/offerte/attive")
    public ResponseEntity<List<OffertaDTO>> getOfferteAttive(@AuthenticationPrincipal Jwt jwt) {
        UUID idAgente = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(agenteService.getOfferteAttivePerAgente(idAgente));
    }

    @GetMapping("/offerte-ricevute")
    public ResponseEntity<List<OffertaDTO>> getOfferteRicevute(@AuthenticationPrincipal Jwt jwt) {
        UUID idAgente = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(agenteService.getOffertePerAgente(idAgente));
    }

    @PostMapping("/immobili")
    public ResponseEntity<ImmobileDTO> caricaImmobile(
            @AuthenticationPrincipal Jwt jwt, 
            @RequestBody ImmobileDTO immobileDTO) {
        
        UUID idAgente = UUID.fromString(jwt.getSubject());
        ImmobileDTO creato = agenteService.caricaImmobile(immobileDTO, idAgente);
        return new ResponseEntity<>(creato, HttpStatus.CREATED);
    }
    
    @PutMapping("/aggiorna-immobile/{id}")
    public ResponseEntity<ImmobileDTO> aggiornaImmobile(
            @PathVariable Integer id, 
            @RequestBody ImmobileDTO dto) {
        return ResponseEntity.ok(agenteService.aggiornaImmobile(id, dto));
    }

    @PostMapping("/immobili/{idImmobile}/offerta-esterna")
    public ResponseEntity<OffertaDTO> aggiungiOffertaEsterna(
            @PathVariable Integer idImmobile, 
            @RequestBody OffertaDTO offertaDTO) {
        
        OffertaDTO creata = agenteService.inserisciOffertaEsterna(offertaDTO, idImmobile);
        return new ResponseEntity<>(creata, HttpStatus.CREATED);
    }

    @PatchMapping("/offerte/{idOfferta}")
    public ResponseEntity<OffertaDTO> gestisciOfferta(
            @PathVariable Integer idOfferta,
            @RequestParam String stato,
            @RequestParam(required = false) Double prezzo,
            @RequestParam(required = false) String nota,
            @AuthenticationPrincipal Jwt jwt) {
        
        UUID idAgente = UUID.fromString(jwt.getSubject());
        OffertaDTO aggiornata = agenteService.gestisciOfferta(idOfferta, stato, prezzo, nota, idAgente);
        return ResponseEntity.ok(aggiornata);
    }
    
}
