package com.example.demo3.controllers;


import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo3.DTO.ClientiDTO;
import com.example.demo3.repositories.ClienteRepo;
import com.example.demo3.services.ClienteService;


@RestController
@RequestMapping("/api") 
public class ClienteController {


	private final ClienteService clienteService;
	
	

	public ClienteController(ClienteService service, ClienteRepo clienteRepo) {
		super();
		this.clienteService = service;
	}



	@GetMapping("/Clienti")
	public ResponseEntity<List<ClientiDTO>> fetchAllClienti(){
		return ResponseEntity.ok( this.clienteService.fetchAllClienti());
	}
}
