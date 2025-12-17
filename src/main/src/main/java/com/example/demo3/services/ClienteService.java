
package com.example.demo3.services;


import java.util.List;


import org.springframework.stereotype.Service;

import com.example.demo3.DTO.ClientiDTO;
import com.example.demo3.mapper.IClienteMapper;
import com.example.demo3.repositories.ClienteRepo;


@Service
public class ClienteService {
	

    private final ClienteRepo clienteRepo;


    private final IClienteMapper clienteMapper;

    
    

	public ClienteService(ClienteRepo clienteRepo, IClienteMapper clienteMapper) {
		this.clienteRepo = clienteRepo;
		this.clienteMapper = clienteMapper;
	}



	public List<ClientiDTO> fetchAllClienti() {
        return clienteRepo.findAll().stream().map(clienteMapper::clienteToClienteDTO).toList();
    }
    
    


}
