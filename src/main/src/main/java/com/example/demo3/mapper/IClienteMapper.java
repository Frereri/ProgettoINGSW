package com.example.demo3.mapper;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import com.example.demo3.DTO.ClientiDTO;
import com.example.demo3.models.Cliente;


@Mapper(componentModel = "spring")
@Component
public interface IClienteMapper {
	
	ClientiDTO clienteToClienteDTO(Cliente cliente);
	
	Cliente clienteDTOToCliente(ClientiDTO clienteDTO);
}
