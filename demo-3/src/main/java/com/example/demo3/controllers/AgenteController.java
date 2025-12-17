package com.example.demo3.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo3.models.Agente;
import com.example.demo3.repositories.AgenteRepo;



@RestController
@RequestMapping("/api/agente")
public class AgenteController {

	@Autowired
	private AgenteRepo repository;

	@GetMapping("{id}")
	public Agente getByIdAgente(@PathVariable Integer id) {
		return repository.findById(id).orElse(null);
	}
}
