package com.example.demo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.demo.DTO.AgenziaDTO;
import com.example.demo.models.Agenzia;

@Mapper(componentModel = "spring")
public interface IAgenziaMapper {

    @Mapping(target = "numeroAgenti", expression = "java(agenzia.getAgenti() != null ? agenzia.getAgenti().size() : 0)")
    @Mapping(target = "numeroImmobili", expression = "java(agenzia.getImmobili() != null ? agenzia.getImmobili().size() : 0)")
    AgenziaDTO agenziaToDTO(Agenzia agenzia);

    @Mapping(target = "agenti", ignore = true)
    @Mapping(target = "immobili", ignore = true)
    Agenzia dtoToAgenzia(AgenziaDTO dto);
}
