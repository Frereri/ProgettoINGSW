package com.example.demo3.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.demo3.DTO.UtenteLoginDTO;
import com.example.demo3.DTO.UtenteRegistrazioneDTO;
import com.example.demo3.models.Cliente;
import com.example.demo3.models.Utente;

@Mapper(componentModel="spring")
public interface IUtenteMapper {
	
	UtenteLoginDTO utenteToUtenteLoginDTO(Utente utente);
	
	UtenteRegistrazioneDTO utenteToUtenteRegistrazioneDTO (Utente utente);
	
	
	@Mapping(target = "idCliente", ignore = true)
	Cliente utenteRegistrazioneDTOtoCliente (UtenteRegistrazioneDTO cliente);
	
}
