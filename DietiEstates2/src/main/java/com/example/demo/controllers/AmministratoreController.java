package com.example.demo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.GestoreDTO;
import com.example.demo.dto.SupportoAmministratoreDTO;
import com.example.demo.services.AmministratoreService;

@RestController
@RequestMapping("/api/amministratore")
@PreAuthorize("hasAuthority('AMMINISTRATORE')")
public class AmministratoreController {

    private final AmministratoreService adminService;
    
    public AmministratoreController(AmministratoreService adminService) {
		this.adminService = adminService;
	}

	@PostMapping("/registra-gestore")
    public ResponseEntity<GestoreDTO> registraGestore(@RequestBody GestoreDTO dto) {
        GestoreDTO creato = adminService.creaGestore(dto);
        
        return ResponseEntity.ok(creato);
    }

    @PostMapping("/registra-supporto")
    public ResponseEntity<SupportoAmministratoreDTO> registraSupporto(@RequestBody SupportoAmministratoreDTO dto) {
        SupportoAmministratoreDTO creato = adminService.creaSupporto(dto);
        return ResponseEntity.ok(creato);
    }
    
}
