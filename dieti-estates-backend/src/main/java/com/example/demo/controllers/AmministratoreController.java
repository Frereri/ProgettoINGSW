package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DTO.GestoreDTO;
import com.example.demo.DTO.SupportoAmministratoreDTO;
import com.example.demo.services.AmministratoreService;
//import com.example.demo.services.AuthService;

@RestController
@RequestMapping("/api/amministratore")
@PreAuthorize("hasAuthority('AMMINISTRATORE')")
public class AmministratoreController {

    @Autowired
    private AmministratoreService adminService;
    
//    @Autowired
//    private AuthService authService;

//    @PostMapping("/crea-gestore/{idAgenzia}")
//    public ResponseEntity<GestoreDTO> creaGestore(
//            @RequestBody GestoreDTO dto, 
//            @PathVariable Integer idAgenzia) {
//        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.creaGestore(dto, idAgenzia));
//    }
    
    @PostMapping("/registra-gestore")
    public ResponseEntity<?> registraGestore(@RequestBody GestoreDTO dto) {
        // 1. Chiami il service che si occupa di TUTTO (AWS + DB)
        GestoreDTO creato = adminService.creaGestore(dto);
        
        // 2. Restituisci l'oggetto creato (che ora ha anche l'ID del DB)
        return ResponseEntity.ok(creato);
    }

    @PostMapping("/registra-supporto")
    public ResponseEntity<?> registraSupporto(@RequestBody SupportoAmministratoreDTO dto) {
        SupportoAmministratoreDTO creato = adminService.creaSupporto(dto);
        return ResponseEntity.ok(creato);
    }
    
//    @PostMapping("/crea-supporto")
//    public ResponseEntity<SupportoAmministratoreDTO> creaSupporto(
//            @RequestBody SupportoAmministratoreDTO dto) {
//        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.creaSupporto(dto));
//    }
}
