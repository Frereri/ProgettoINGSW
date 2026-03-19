package com.example.demo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.demo.dto.AgenteDTO;
import com.example.demo.dto.AmministratoreDTO;
import com.example.demo.dto.ClienteDTO;
import com.example.demo.dto.CreazioneStaffDTO;
import com.example.demo.dto.GestoreDTO;
import com.example.demo.dto.RegistrazioneClienteDTO;
import com.example.demo.dto.SupportoAmministratoreDTO;
import com.example.demo.dto.UtenteDTO;
import com.example.demo.models.Agente;
import com.example.demo.models.Amministratore;
import com.example.demo.models.Cliente;
import com.example.demo.models.Gestore;
import com.example.demo.models.SupportoAmministratore;
import com.example.demo.models.Utente;

@Mapper(componentModel = "spring")
public interface IUtenteMapper {

	default UtenteDTO toDTO(Utente utente) {
		if (utente instanceof Agente agente) {
			return toAgenteDTO(agente);
		}
	    if (utente instanceof Gestore gestore) {
	    	return toGestoreDTO(gestore);
	    }
	    if (utente instanceof Cliente cliente) {
	    	return toClienteDTO(cliente);
	    }
	    if (utente instanceof Amministratore amm) {
	    	return toAmministratoreDTO(amm);
	    }
	    if (utente instanceof SupportoAmministratore supp) {
	    	return toSupportoAmministratoreDTO(supp);
	    }
        return null;
    }
	
	default Utente toEntity(UtenteDTO dto) {
	    if (dto instanceof AgenteDTO agentedto) {return toAgenteEntity(agentedto);}
	    if (dto instanceof ClienteDTO gestoredto) {return toClienteEntity(gestoredto);}
	    if (dto instanceof GestoreDTO clientedto) {return toGestoreEntity(clientedto);}
        if (dto instanceof AmministratoreDTO ammdto) {return toAmministratoreEntity(ammdto);}
        if (dto instanceof SupportoAmministratoreDTO suppdto) {return toSupportoAmministratoreEntity(suppdto);}
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
