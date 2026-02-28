package com.example.demo.controllers;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    
    @PostMapping("/{idCliente}/offerte")
    public ResponseEntity<OffertaDTO> inviaOfferta(@PathVariable UUID idCliente, @RequestBody OffertaDTO dto) {
        return ResponseEntity.ok(clienteService.inviaOfferta(dto, idCliente));
    }

    @PatchMapping("/{idCliente}/offerte/{idOfferta}/rispondi")
    public ResponseEntity<OffertaDTO> rispondi(
            @PathVariable UUID idCliente,
            @PathVariable Integer idOfferta,
            @RequestParam String stato,
            @RequestParam(required = false) String nota) {
        return ResponseEntity.ok(clienteService.rispondiAControfferta(idOfferta, stato, nota, idCliente));
    }
}
