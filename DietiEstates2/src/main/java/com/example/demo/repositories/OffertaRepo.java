package com.example.demo.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Offerta;

public interface OffertaRepo extends JpaRepository<Offerta, Integer>{

	List<Offerta> findByCliente_IdUtente(UUID idCliente);

    // Trova offerte per un immobile
    List<Offerta> findByImmobile_IdImmobile(Integer idImmobile);

    // Trova tutte le offerte ricevute da un Agente specifico sui suoi immobili
    List<Offerta> findByImmobile_Agente_IdUtente(UUID idAgente);
    
}
