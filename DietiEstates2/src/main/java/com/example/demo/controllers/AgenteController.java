package com.example.demo.controllers;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @Autowired
    private AgenteService agenteService;

    @GetMapping("/{idAgente}")
    public ResponseEntity<AgenteDTO> getProfilo(@PathVariable UUID idAgente) {
        return ResponseEntity.ok(agenteService.getProfiloAgente(idAgente));
    }

    @PostMapping("/{idAgente}/immobili")
    public ResponseEntity<ImmobileDTO> caricaImmobile(
            @PathVariable UUID idAgente, 
            @RequestBody ImmobileDTO immobileDTO) {
        
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

    // Gestisce un'offerta (Accetta, Rifiuta o fa Controfferta)
    // Esempio: PATCH /api/agenti/offerte/5?stato=CONTROFFERTA&prezzo=245000
    @PatchMapping("/offerte/{idOfferta}")
    public ResponseEntity<OffertaDTO> gestisciOfferta(
            @PathVariable Integer idOfferta,
            @RequestParam String stato,
            @RequestParam(required = false) Double prezzo,
            @RequestParam(required = false) String nota,
            @RequestParam UUID idAgente) { // In futuro preso dal Token/Sessione
        
        OffertaDTO aggiornata = agenteService.gestisciOfferta(idOfferta, stato, prezzo, nota, idAgente);
        return ResponseEntity.ok(aggiornata);    }
}
