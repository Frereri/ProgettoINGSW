package com.example.demo.controllers;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
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
}
