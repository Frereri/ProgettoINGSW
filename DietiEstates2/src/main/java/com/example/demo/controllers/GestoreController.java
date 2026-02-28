package com.example.demo.controllers;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/{idGestore}/crea-agente")
    public ResponseEntity<AgenteDTO> creaAgente(
            @PathVariable UUID idGestore, 
            @RequestBody AgenteDTO agenteDTO) {
        
        AgenteDTO creato = gestoreService.creaAgente(idGestore, agenteDTO);
        return new ResponseEntity<>(creato, HttpStatus.CREATED);
    }
}
