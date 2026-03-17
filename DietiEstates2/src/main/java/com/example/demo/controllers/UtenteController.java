package com.example.demo.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.CambiaPasswordDTO;
import com.example.demo.dto.UtenteDTO;
import com.example.demo.services.AuthService;
import com.example.demo.services.UtenteService;

@RestController
@RequestMapping("/api/utente")
public class UtenteController {

    private final UtenteService utenteService;
    private final AuthService authService;

    public UtenteController(UtenteService utenteService, AuthService authService) {
		this.utenteService = utenteService;
		this.authService = authService;
	}

	@PostMapping("/update-password")
    public ResponseEntity<String> updatePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CambiaPasswordDTO dto) {
        
        String accessToken = authHeader.substring(7);
        
        try {
            authService.updatePassword(accessToken, dto.getVecchiaPassword(), dto.getNuovaPassword());
            return ResponseEntity.ok("Password aggiornata con successo!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Errore: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<List<UtenteDTO>> getAll() {
        List<UtenteDTO> utenti = utenteService.findAll();
        if (utenti.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(utenti);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UtenteDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(utenteService.findById(id));
    }

    @PostMapping
    public ResponseEntity<UtenteDTO> update(@RequestBody UtenteDTO dto) {
        return ResponseEntity.ok(utenteService.save(dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        utenteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
