package com.example.demo.controllers;

import com.example.demo.DTO.ImmobileDTO;
import com.example.demo.services.ImmobileService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/immobile")
public class ImmobileController {

	@Autowired
    private ImmobileService service;

    @GetMapping
    public ResponseEntity<List<ImmobileDTO>> getAll() {
        List<ImmobileDTO> immobili = service.getAllImmobili();
        if (immobili.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(immobili);
    }

    @GetMapping("/cerca")
    public ResponseEntity<List<ImmobileDTO>> search(
            @RequestParam(required = false) String citta,
            @RequestParam(required = false, defaultValue = "0") double min,
            @RequestParam(required = false, defaultValue = "999999999") double max,
            @RequestParam (required = false) String contratto) {
        
        return ResponseEntity.ok(service.searchImmobili(citta, min, max, contratto));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ImmobileDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getImmobileById(id));
    }
    
    @PostMapping
    public ResponseEntity<ImmobileDTO> create(@RequestBody ImmobileDTO dto) {
        return new ResponseEntity<>(service.saveImmobileFromDTO(dto), HttpStatus.CREATED);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        service.deleteImmobile(id);
        return ResponseEntity.ok("Immobile con ID " + id + " eliminato con successo");
    }
}