package com.example.demo3.controllers;


import java.util.List;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo3.DTO.ClienteLoginDTO;
import com.example.demo3.DTO.ClienteRegistrazioneDTO;
import com.example.demo3.DTO.MostraClienteDTO;
import com.example.demo3.services.ClienteService;


@RestController
@RequestMapping("/api") 
public class ClienteController {


	private final ClienteService clienteService;
	
	
	//@PathVariable serve se voglio un dato dal http ad esempio se voglio cercare il cliente con id1 
	//@RequestParam per ricevere un determinato parametroche mi invia l'utente 
	//@RequestBody se voglio un oggetto, ad esempio un DTO o un Immobile
	

	public ClienteController(ClienteService service) {
		super();
		this.clienteService = service;
	}



	@GetMapping("/Clienti")
	public ResponseEntity<List<MostraClienteDTO>> fetchAllClienti(){
		return ResponseEntity.ok(this.clienteService.getAllClienti());
	}
	
	@GetMapping("/{varId}")
	public ResponseEntity<MostraClienteDTO> trovaCleinte(@PathVariable Integer varId){
		return ResponseEntity.ok(this.clienteService.getCliente(varId));
	}
	
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody ClienteLoginDTO dto) {

	    

	    if (clienteService.login(dto)) {
	    	
	        // Messaggio veicolato tramite lo status 200
	        return ResponseEntity.status(HttpStatus.OK).body("Accesso effetuato "); // volendo puoi azzerare la password
	    }

	    // Messaggio veicolato dallo status 401, NON dal DTO
	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenziali non valide");
	}


	@PostMapping("/Registrazione")
	public ResponseEntity<?> Registrazione(@RequestBody ClienteRegistrazioneDTO dto){
	    clienteService.registrazione(dto);
	    return ResponseEntity.ok("Registrazione andata a buon fine");
	}


}
