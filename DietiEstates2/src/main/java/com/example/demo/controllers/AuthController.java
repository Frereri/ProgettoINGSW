package com.example.demo.controllers;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DTO.RegistrazioneClienteDTO;
import com.example.demo.DTO.RichiestaLoginDTO;
import com.example.demo.services.AuthService;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody RichiestaLoginDTO loginRequest) {
        Map<String, String> tokens = authService.login(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(tokens);
    }
    
    @PostMapping("/signup-cliente")
    public ResponseEntity<?> signupCliente(@RequestBody RegistrazioneClienteDTO dto) {
    	
        authService.registraCliente(dto);
        return ResponseEntity.ok("Registrazione effettuata! Controlla l'email per confermare l'account.");
    }
    
    @PostMapping("/setup-admin")
    public ResponseEntity<String> setupAdmin(@RequestBody RichiestaLoginDTO request) {
        // 1. Forza la password su Cognito (passa da FORCE_CHANGE a CONFIRMED)
        authService.setUserPasswordPermanent(request.getEmail(), request.getPassword());
        
        return ResponseEntity.ok("Admin sbloccato con successo! Ora puoi effettuare il login.");
    }
}
