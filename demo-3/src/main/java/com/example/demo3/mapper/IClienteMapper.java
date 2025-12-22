package com.example.demo3.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.demo3.DTO.ClienteLoginDTO;
import com.example.demo3.DTO.ClienteRegistrazioneDTO;
import com.example.demo3.DTO.MostraClienteDTO;
import com.example.demo3.models.Cliente;


@Mapper(componentModel = "spring")
public interface IClienteMapper {
	
	MostraClienteDTO clienteToClienteDTO(Cliente cliente);
	
	ClienteLoginDTO clienteToClienteLoginDTO(Cliente cliente);
	

	@Mapping(target = "idCliente", ignore = true)	//Visto che nel Dto non ho idClienete lo ignoro 
	Cliente clienteDTOToCliente(MostraClienteDTO clienteDTO);
	// Questi di sopra sono solo una prova, andranno tolti

	@Mapping(target = "idCliente", ignore = true)	
    @Mapping(target = "cognome", ignore = true)
	@Mapping(target = "nome", ignore = true)
	Cliente clienteDTOToClienteLogin(ClienteLoginDTO clienteDTO);

	@Mapping(target = "idCliente", ignore = true)
	Cliente clienteDTOToClienteRegistrazione(ClienteRegistrazioneDTO clienteDTO);
	
}
