package com.example.demo.repositories;


import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.models.Immobile;

public interface ImmobileRepo extends JpaRepository<Immobile, Integer>{


    @Query("SELECT i FROM Immobile i WHERE i.latitudine BETWEEN :minLat AND :maxLat " +
           "AND i.longitudine BETWEEN :minLon AND :maxLon")
    List<Immobile> findByLocationRange(@Param("minLat") Double minLat, @Param("maxLat") Double maxLat, 
                                       @Param("minLon") Double minLon, @Param("maxLon") Double maxLon);
	
    
    @Query("SELECT i FROM Immobile i WHERE " +
            "(:citta IS NULL OR i.citta = :citta) AND " +
            "(i.prezzo >= :min AND i.prezzo <= :max) AND " +
            "(:contratto IS NULL OR i.tipoContratto = :contratto)")
     List<Immobile> searchImmobiliAvanzata(
         @Param("citta") String citta, 
         @Param("min") double min, 
         @Param("max") double max, 
         @Param("contratto") String contratto);
    
    List<Immobile> findByAgenziaAgentiIdUtente(UUID idUtente);
    
    List<Immobile> findByAgenzia_IdAgenzia(Integer idAgenzia);
}
