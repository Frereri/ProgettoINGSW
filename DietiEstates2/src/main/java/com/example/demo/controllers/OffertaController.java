package com.example.demo.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DTO.OffertaDTO;
import com.example.demo.services.OffertaService;

@RestController
@RequestMapping("/api/offerta")
public class OffertaController {

	@Autowired
    private OffertaService service;
    
	// GET per Immobile
    @GetMapping("/immobile/{id}")
    public ResponseEntity<List<OffertaDTO>> getByImmobile(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getOffertePerImmobile(id));
    }
	
    // GET tutte le offerte
    @GetMapping
    public ResponseEntity<List<OffertaDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    // GET per Cliente
    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<OffertaDTO>> getByCliente(@PathVariable UUID idCliente) {
        return ResponseEntity.ok(service.findByCliente(idCliente));
    }
	
    // POST creazione offerta
    @PostMapping
    public ResponseEntity<OffertaDTO> create(@RequestBody OffertaDTO dto) {
        return ResponseEntity.ok(service.createOfferta(dto));
    }
	
    // PATCH cambio stato
    @PatchMapping("/{id}/stato")
    public ResponseEntity<OffertaDTO> cambiaStato(
            @PathVariable Integer id, 
            @RequestParam String nuovoStato,
            @RequestParam(required = false) Double controfferta) {
        
        return ResponseEntity.ok(service.aggiornaStato(id, nuovoStato, controfferta));
    }	
    
}
