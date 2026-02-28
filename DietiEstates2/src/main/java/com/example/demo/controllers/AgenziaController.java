package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DTO.AgenziaDTO;
import com.example.demo.services.AgenziaService;

@RestController
@RequestMapping("/api/agenzia")
public class AgenziaController {

	@Autowired
    private AgenziaService agenziaService;

    @GetMapping
    public ResponseEntity<List<AgenziaDTO>> getAll() {
        return ResponseEntity.ok(agenziaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgenziaDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(agenziaService.findById(id));
    }

    @PostMapping
    public ResponseEntity<AgenziaDTO> create(@RequestBody AgenziaDTO agenziaDTO) {
        return ResponseEntity.ok(agenziaService.save(agenziaDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        agenziaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
