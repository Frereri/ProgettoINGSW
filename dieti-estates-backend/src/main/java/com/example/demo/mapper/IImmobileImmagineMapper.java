package com.example.demo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.demo.DTO.ImmobileImmagineDTO;
import com.example.demo.models.ImmobileImmagine;

@Mapper(componentModel = "spring")
public interface IImmobileImmagineMapper {
    @Mapping(source = "immobile.idImmobile", target = "idImmobile")
    ImmobileImmagineDTO toDTO(ImmobileImmagine entity);
    
//    @Mapping(target = "immobile", ignore = true)
//    ImmobileImmagine toEntity(ImmobileImmagineDTO dto);
}
