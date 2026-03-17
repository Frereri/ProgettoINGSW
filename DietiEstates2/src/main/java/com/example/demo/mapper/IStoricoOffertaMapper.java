package com.example.demo.mapper;

import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.example.demo.dto.StoricoOffertaDTO;
import com.example.demo.models.Offerta;
import com.example.demo.models.StoricoOfferta;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface IStoricoOffertaMapper {
    @Mapping(source = "offerta.idOfferta", target = "idOfferta")
    StoricoOffertaDTO toDTO(StoricoOfferta entity);

    @Mapping(target = "idLog", ignore = true)
    @Mapping(target = "dataAzione", ignore = true)
    @Mapping(source = "offerta", target = "offerta")
    @Mapping(source = "offerta.stato", target = "nuovoStato")
    @Mapping(source = "offerta.prezzoOfferto", target = "prezzoScambiato")
    @Mapping(source = "autore", target = "autoreAzione")
    @Mapping(source = "nota", target = "nota")
    StoricoOfferta createLog(Offerta offerta, UUID autore, String nota);

}
