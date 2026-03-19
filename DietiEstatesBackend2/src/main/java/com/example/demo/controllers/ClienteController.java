package com.example.demo.controllers;

import java.util.List;
import java.util.UUID;

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

import com.example.demo.dto.OffertaDTO;
import com.example.demo.services.ClienteService;

@RestController
@RequestMapping("/api/cliente")
public class ClienteController {

    private final ClienteService clienteService;
    
    public ClienteController(ClienteService clienteService) {
		this.clienteService = clienteService;
	}

	@PostMapping("/offerte/crea")
    public ResponseEntity<OffertaDTO> inviaOfferta(
            @AuthenticationPrincipal Jwt jwt, 
            @RequestBody OffertaDTO dto) {
        
        UUID idCliente = UUID.fromString(jwt.getSubject());
        
        return ResponseEntity.ok(clienteService.inviaOfferta(dto, idCliente));
    }

    @PatchMapping("/offerte/{idOfferta}/rispondi")
    public ResponseEntity<OffertaDTO> rispondiAControfferta(
            @PathVariable Integer idOfferta,
            @RequestParam String nuovoStato,
            @AuthenticationPrincipal Jwt jwt) {
        
        UUID idCliente = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(clienteService.aggiornaStatoOfferta(idOfferta, idCliente, nuovoStato));
    }
    
    @GetMapping("/mie-offerte")
    public ResponseEntity<List<OffertaDTO>> getMieOfferte(@AuthenticationPrincipal Jwt jwt) {
        String sub = jwt.getSubject(); 
        UUID uuidUtente = UUID.fromString(sub);
        
        return ResponseEntity.ok(clienteService.getOffertePerCliente(uuidUtente));
    }
}
