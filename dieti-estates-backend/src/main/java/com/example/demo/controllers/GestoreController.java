package com.example.demo.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DTO.AgenteDTO;
import com.example.demo.services.GestoreService;


@RestController
@RequestMapping("/api/gestore")
public class GestoreController {

    @Autowired
    private GestoreService gestoreService;
    
    @PostMapping("/registra-agente")
    @PreAuthorize("hasAuthority('Gestori')")
    public ResponseEntity<?> registraAgente(
            @AuthenticationPrincipal Jwt jwt, 
            @RequestBody AgenteDTO dto) {
        
        // Estraiamo l'UUID dal token (il 'sub' di Cognito)
        UUID idGestore = UUID.fromString(jwt.getSubject());
        
        AgenteDTO creato = gestoreService.creaAgente(idGestore, dto);
        return ResponseEntity.ok(creato);
    }
    
    @GetMapping("/miei-agenti")
    public ResponseEntity<List<AgenteDTO>> getAgentiAgenzia(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(gestoreService.getAgentiAgenzia(UUID.fromString(jwt.getSubject())));
    }

    @DeleteMapping("/agente/{id}")
    public ResponseEntity<?> eliminaAgente(@PathVariable UUID id) {
        gestoreService.eliminaAgente(id);
        return ResponseEntity.ok().build();
    }
    
    @PatchMapping("/agente/{id}")
    @PreAuthorize("hasAuthority('Gestori')")
    public ResponseEntity<AgenteDTO> aggiornaAgente(
            @PathVariable UUID id,
            @RequestBody AgenteDTO dto) {
        return ResponseEntity.ok(gestoreService.aggiornaAgente(id, dto));
    }

    @Transactional(readOnly = true)
    @GetMapping("/immobili-agenzia")
    public ResponseEntity<?> getImmobiliAgenzia(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(gestoreService.getImmobiliAgenzia(UUID.fromString(jwt.getSubject())));
    }
}
