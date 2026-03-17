package com.example.demo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.example.demo.dto.OffertaDTO;
import com.example.demo.models.Offerta;

@Mapper(componentModel = "Spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface IOffertaMapper {

	@Mapping(source = "immobile.idImmobile", target = "idImmobile")
    @Mapping(source = "immobile.titolo", target = "titoloImmobile")
    @Mapping(source = "cliente.idUtente", target = "idCliente")
    @Mapping(target = "nomeCognomeCliente", expression = "java(mapNomeCliente(offerta))")
    OffertaDTO offertaToDTO(Offerta offerta);

    default String mapNomeCliente(Offerta offerta) {
        if (offerta.getCliente() != null) {
            return offerta.getCliente().getNome() + " " + offerta.getCliente().getCognome();
        } else if (offerta.getNomeClienteEsterno() != null) {
            return offerta.getNomeClienteEsterno();
        }
        return "Cliente Anonimo";
    }

    
    @Mapping(target = "cliente", ignore = true)
    @Mapping(target = "immobile", ignore = true)
    @Mapping(target = "idOfferta", ignore = true)
    @Mapping(target = "stato", constant = "IN_ATTESA")
    @Mapping(target = "offertaEsterna", constant = "false")
    @Mapping(source = "prezzoOriginale", target = "prezzoOriginale") 
    Offerta dtoToOfferta(OffertaDTO dto);
}
