package com.example.demo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.demo.DTO.AgenteDTO;
import com.example.demo.DTO.ClienteDTO;
import com.example.demo.DTO.CreazioneStaffDTO;
import com.example.demo.DTO.GestoreDTO;
import com.example.demo.DTO.RegistrazioneClienteDTO;
import com.example.demo.DTO.UtenteDTO;
import com.example.demo.DTO.AmministratoreDTO;
import com.example.demo.DTO.SupportoAmministratoreDTO;

import com.example.demo.models.Agente;
import com.example.demo.models.Amministratore;
import com.example.demo.models.Cliente;
import com.example.demo.models.Gestore;
import com.example.demo.models.SupportoAmministratore;
import com.example.demo.models.Utente;

@Mapper(componentModel = "spring")
public interface IUtenteMapper {

	default UtenteDTO toDTO(Utente utente) {
        if (utente instanceof Agente) return toAgenteDTO((Agente) utente);
        if (utente instanceof Gestore) return toGestoreDTO((Gestore) utente);
        if (utente instanceof Cliente) return toClienteDTO((Cliente) utente);
        if (utente instanceof Amministratore) return toAmministratoreDTO((Amministratore) utente);
        if (utente instanceof SupportoAmministratore) return toSupportoAmministratoreDTO((SupportoAmministratore) utente);
        return null;
    }
	
	default Utente toEntity(UtenteDTO dto) {
	    if (dto instanceof AgenteDTO) return toAgenteEntity((AgenteDTO) dto);
	    if (dto instanceof ClienteDTO) return toClienteEntity((ClienteDTO) dto);
	    if (dto instanceof GestoreDTO) return toGestoreEntity((GestoreDTO) dto);
        if (dto instanceof AmministratoreDTO) return toAmministratoreEntity((AmministratoreDTO) dto);
        if (dto instanceof SupportoAmministratoreDTO) return toSupportoAmministratoreEntity((SupportoAmministratoreDTO) dto);
	    return null;
	}

    @Mapping(source = "agenzia.idAgenzia", target = "idAgenzia")
    @Mapping(source = "agenzia.nomeAgenzia", target = "nomeAgenzia")
    AgenteDTO toAgenteDTO(Agente agente);

    @Mapping(source = "agenzia.idAgenzia", target = "idAgenzia")
    @Mapping(source = "agenzia.nomeAgenzia", target = "nomeAgenzia")
    GestoreDTO toGestoreDTO(Gestore gestore);

    ClienteDTO toClienteDTO(Cliente cliente);   
    AmministratoreDTO toAmministratoreDTO(Amministratore amministratore);   
    SupportoAmministratoreDTO toSupportoAmministratoreDTO(SupportoAmministratore supportoAmministratore);
    
    
    
    @Mapping(target = "agenzia", ignore = true)
    @Mapping(target = "immobili", ignore = true)
    Agente toAgenteEntity(AgenteDTO dto);
    
    @Mapping(target = "offerte", ignore = true)
    Cliente toClienteEntity(ClienteDTO dto);
    
    @Mapping(target = "agenzia", ignore = true)
    Gestore toGestoreEntity(GestoreDTO dto);
    
    Amministratore toAmministratoreEntity(AmministratoreDTO dto);
    SupportoAmministratore toSupportoAmministratoreEntity(SupportoAmministratoreDTO dto);
    
    
    @Mapping(source = "datiProfilo", target = ".") 
    @Mapping(target = "offerte", ignore = true)
    Cliente toEntityFromRegister(RegistrazioneClienteDTO dto);

    @Mapping(source = "datiProfilo", target = ".")
    @Mapping(target = "agenzia", ignore = true)
    @Mapping(target = "immobili", ignore = true)
    Agente toEntityFromStaff(CreazioneStaffDTO dto);
}
