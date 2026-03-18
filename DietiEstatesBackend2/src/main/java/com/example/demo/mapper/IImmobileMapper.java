package com.example.demo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import com.example.demo.DTO.ImmobileDTO;
import com.example.demo.models.Appartamento;
import com.example.demo.models.Immobile;
import com.example.demo.models.Villa;

@Mapper(componentModel = "spring", 
	uses = { IImmobileImmagineMapper.class },
	unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface IImmobileMapper {

	default ImmobileDTO immobileToDTO(Immobile immobile) {
        if (immobile == null) return null;
        if (immobile instanceof Appartamento appartamento) return appartamentoToDTO(appartamento);
        if (immobile instanceof Villa villa) return villaToDTO(villa);
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
    Appartamento immobileDTOtoAppartamento(ImmobileDTO immobileDTO);

    @Mapping(target = "agenzia", ignore = true) 
    @Mapping(target = "agente", ignore = true)
    @Mapping(source = "giardino", target = "giardino")
    @Mapping(source = "piscina", target = "piscina")
    @Mapping(source = "superficieGiardino", target = "superficieGiardino")
    Villa immobileDTOtoVilla(ImmobileDTO immobileDTO);

    @Mapping(target = "idImmobile", ignore = true)
    @Mapping(target = "agenzia", ignore = true)
    @Mapping(target = "agente", ignore = true)
    @Mapping(source = "giardino", target = "giardino")
    @Mapping(source = "piscina", target = "piscina")
    @Mapping(source = "superficieGiardino", target = "superficieGiardino")
    void updateVillaFromDTO(ImmobileDTO dto, @MappingTarget Villa villa);
    
    @Mapping(target = "idImmobile", ignore = true)
    @Mapping(target = "agenzia", ignore = true)
    @Mapping(target = "agente", ignore = true)
    void updateAppartamentoFromDTO(ImmobileDTO dto, @MappingTarget Appartamento appartamento);

}