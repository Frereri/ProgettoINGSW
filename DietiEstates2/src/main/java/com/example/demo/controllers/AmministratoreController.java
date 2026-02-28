package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DTO.GestoreDTO;
import com.example.demo.DTO.SupportoAmministratoreDTO;
import com.example.demo.services.AmministratoreService;

@RestController
@RequestMapping("/api/amministratore")
public class AmministratoreController {

    @Autowired
    private AmministratoreService adminService;

    @PostMapping("/crea-gestore/{idAgenzia}")
    public ResponseEntity<GestoreDTO> creaGestore(
            @RequestBody GestoreDTO dto, 
            @PathVariable Integer idAgenzia) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.creaGestore(dto, idAgenzia));
    }

    @PostMapping("/crea-supporto")
    public ResponseEntity<SupportoAmministratoreDTO> creaSupporto(
            @RequestBody SupportoAmministratoreDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.creaSupporto(dto));
    }
}
