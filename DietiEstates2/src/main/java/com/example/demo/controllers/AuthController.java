package com.example.demo.controllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.dto.RegistrazioneClienteDTO;
import com.example.demo.dto.RichiestaLoginDTO;
import com.example.demo.services.AuthService;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody RichiestaLoginDTO loginRequest) {
        Map<String, String> tokens = authService.login(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(tokens);
    }
    
    @PostMapping("/signup-cliente")
    public ResponseEntity<Map<String, String>> signupCliente(@RequestBody RegistrazioneClienteDTO dto) {
        try {
            authService.registraCliente(dto);
            return ResponseEntity.ok(Map.of("message", "Registrazione effettuata!"));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                                 .body(Map.of("error", e.getReason() != null ? e.getReason() : "Errore client"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("error", "Errore interno del server"));
        }
    }
    
    @PostMapping("/setup-admin")
    public ResponseEntity<String> setupAdmin(@RequestBody RichiestaLoginDTO request) {
        authService.setUserPasswordPermanent(request.getEmail(), request.getPassword());
        
        return ResponseEntity.ok("Admin sbloccato con successo! Ora puoi effettuare il login.");
    }
}
