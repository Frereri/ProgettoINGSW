package com.example.demo.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.models.Agenzia;

@Repository
public interface AgenziaRepo extends JpaRepository<Agenzia, Integer>{
	
	Optional<Agenzia> findByNomeAgenziaIgnoreCase(String nomeAgenzia);
    
    boolean existsByPartitaIva(String partitaIva);
}
