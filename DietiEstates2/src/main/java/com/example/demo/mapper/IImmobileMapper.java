package com.example.demo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.example.demo.DTO.ImmobileDTO;
import com.example.demo.models.Appartamento;
import com.example.demo.models.Immobile;
import com.example.demo.models.Villa;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface IImmobileMapper {

	default ImmobileDTO immobileToDTO(Immobile immobile) {
        if (immobile == null) return null;
        if (immobile instanceof Appartamento) return appartamentoToDTO((Appartamento) immobile);
        if (immobile instanceof Villa) return villaToDTO((Villa) immobile);
        return baseImmobileToDTO(immobile);
    }

    @Mapping(source = "agenzia.idAgenzia", target = "idAgenzia")
    @Mapping(source = "agenzia.nomeAgenzia", target = "nomeAgenzia") 
    @Mapping(source = "agente.idUtente", target = "idAgente")
    @Mapping(source = "agente.nome", target = "nomeAgente")
    @Mapping(target = "tipoImmobile", constant = "APPARTAMENTO")
    ImmobileDTO appartamentoToDTO(Appartamento appartamento);

    @Mapping(source = "agenzia.idAgenzia", target = "idAgenzia")
    @Mapping(source = "agenzia.nomeAgenzia", target = "nomeAgenzia")
    @Mapping(source = "agente.idUtente", target = "idAgente")
    @Mapping(source = "agente.nome", target = "nomeAgente")
    @Mapping(target = "tipoImmobile", constant = "VILLA")
    ImmobileDTO villaToDTO(Villa villa);

    @Mapping(source = "agenzia.idAgenzia", target = "idAgenzia")
    @Mapping(source = "agente.idUtente", target = "idAgente")
    ImmobileDTO baseImmobileToDTO(Immobile immobile);

    @Mapping(target = "agenzia", ignore = true) 
    @Mapping(target = "agente", ignore = true)
    //@Mapping(target = "offerte", ignore = true)
    Appartamento immobileDTOtoAppartamento(ImmobileDTO immobileDTO);

    @Mapping(target = "agenzia", ignore = true) 
    @Mapping(target = "agente", ignore = true)
    //@Mapping(target = "offerte", ignore = true)
    Villa immobileDTOtoVilla(ImmobileDTO immobileDTO);
}