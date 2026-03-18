package com.example.demo.controllers;

import com.example.demo.DTO.ImmobileDTO;
import com.example.demo.services.ImmobileService;

import java.util.List;
import java.util.UUID;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/immobile")
public class ImmobileController {

    private final ImmobileService service;

	public ImmobileController(ImmobileService service) {
		this.service = service;
	}

	@Transactional(readOnly = true)
	@GetMapping
	public ResponseEntity<List<ImmobileDTO>> getAllImmobili(
	        @RequestParam(defaultValue = "0") int page,
	        @RequestParam(defaultValue = "10") int size) {
	    
	    Pageable pageable = PageRequest.of(page, size);
	    return ResponseEntity.ok(service.getAllImmobili(pageable).getContent());
	}

	@Transactional(readOnly = true)
    @GetMapping("/cerca")
    public ResponseEntity<List<ImmobileDTO>> search(
            @RequestParam(required = false) String citta,
            @RequestParam(required = false, defaultValue = "0") double min,
            @RequestParam(required = false, defaultValue = "999999999") double max,
            @RequestParam (required = false) String contratto) {
        
        return ResponseEntity.ok(service.searchImmobili(citta, min, max, contratto));
    }
    
    @Transactional(readOnly = true)
    @GetMapping("/{id}")
    public ResponseEntity<ImmobileDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getImmobileById(id));
    }
    
    @Transactional(readOnly = true)
    @GetMapping("/mio-organico/{idAgente}")
    public ResponseEntity<List<ImmobileDTO>> getImmobiliMioOrganico(@PathVariable UUID idAgente) {
        return ResponseEntity.ok(service.getImmobiliByAgenteAgenzia(idAgente));
    }
    
    @PostMapping
    public ResponseEntity<ImmobileDTO> create(@RequestBody ImmobileDTO dto) {
        return new ResponseEntity<>(service.saveImmobileFromDTO(dto), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ImmobileDTO> updateImmobile(
            @PathVariable Integer id, 
            @RequestBody ImmobileDTO dto) {
        return ResponseEntity.ok(service.updateImmobile(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        service.deleteImmobile(id);
        return ResponseEntity.ok("Immobile con ID " + id + " eliminato con successo");
    }
}