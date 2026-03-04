package com.example.demo.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DTO.OffertaDTO;
import com.example.demo.services.ClienteService;

@RestController
@RequestMapping("/api/cliente")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;
    
    @PostMapping("/offerte/crea")
    public ResponseEntity<OffertaDTO> inviaOfferta(
            @AuthenticationPrincipal Jwt jwt, 
            @RequestBody OffertaDTO dto) {
        
        // Recuperiamo l'UUID dal token come abbiamo fatto per la lista
        UUID idCliente = UUID.fromString(jwt.getSubject());
        
        // Chiamiamo il service passando l'ID estratto dal token per sicurezza
        return ResponseEntity.ok(clienteService.inviaOfferta(dto, idCliente));
    }

    @PatchMapping("/offerte/{idOfferta}/rispondi")
    public ResponseEntity<OffertaDTO> rispondiAControfferta(
            @PathVariable Integer idOfferta,
            @RequestParam String nuovoStato, // ACCETTATA o RIFIUTATA
            @AuthenticationPrincipal Jwt jwt) {
        
        UUID idCliente = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(clienteService.aggiornaStatoOfferta(idOfferta, idCliente, nuovoStato));
    }
    
    @GetMapping("/mie-offerte")
    public ResponseEntity<List<OffertaDTO>> getMieOfferte(@AuthenticationPrincipal Jwt jwt) {
        // Il subject (sub) del JWT di Cognito è l'UUID dell'utente
        String sub = jwt.getSubject(); 
        UUID uuidUtente = UUID.fromString(sub);
        
        return ResponseEntity.ok(clienteService.getOffertePerCliente(uuidUtente));
    }
}
