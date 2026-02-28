package com.example.demo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.example.demo.DTO.StoricoOffertaDTO;
import com.example.demo.models.StoricoOfferta;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface IStoricoOffertaMapper {
    @Mapping(source = "offerta.idOfferta", target = "idOfferta")
    StoricoOffertaDTO toDTO(StoricoOfferta entity);
}
