
package com.example.demo3.services;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo3.DTO.ClienteLoginDTO;
import com.example.demo3.DTO.ClienteRegistrazioneDTO;
import com.example.demo3.DTO.MostraClienteDTO;
import com.example.demo3.mapper.IClienteMapper;
import com.example.demo3.models.Cliente;
import com.example.demo3.repositories.ClienteRepo;
import com.example.demo3.exception.BadRequestException;


@Service
public class ClienteService {
	
	@Autowired
    private  ClienteRepo clienteRepo;

	@Autowired
    private IClienteMapper clienteMapper;

    
    

	public ClienteService(ClienteRepo clienteRepo, IClienteMapper clienteMapper) {
		this.clienteRepo = clienteRepo;
		this.clienteMapper = clienteMapper;
	}



	public List<MostraClienteDTO> getAllClienti() {
        return clienteRepo.findAll().stream().map(clienteMapper::clienteToClienteDTO).toList();
    }
    
    public MostraClienteDTO getCliente(Integer id) {
    	return clienteRepo.findById(id).map(clienteMapper::clienteToClienteDTO).orElse(null);
    }

    
    
    
    public boolean login(ClienteLoginDTO dto) {
    	 if (dto.getEmail() == null || dto.getPassword() == null) {
             return false;
         }

         Optional<Cliente> result =clienteRepo.findByEmailAndPassword(dto.getEmail(), dto.getPassword());

         return result.isPresent();
     }
    
    public void registrazione(ClienteRegistrazioneDTO dto) {

        if (dto.getNome() == null || dto.getNome().isBlank()) {
            throw new BadRequestException("Il nome è obbligatorio");
        }

        if (dto.getCognome() == null || dto.getCognome().isBlank()) {
            throw new BadRequestException("Il cognome è obbligatorio");
        }

        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new BadRequestException("L'email è obbligatoria");
        }

        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new BadRequestException("La password è obbligatoria");
        }

        if (clienteRepo.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email già esistente");
        }

        Cliente cli = clienteMapper.clienteDTOToClienteRegistrazione(dto);
        clienteRepo.save(cli);
    }

 }
