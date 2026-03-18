package com.example.demo.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.models.Agente;

@Repository
public interface AgenteRepo extends JpaRepository<Agente, UUID>{
	
	Optional<Agente> findByEmail(String email);
    
    List<Agente> findByAgenzia_IdAgenzia(Integer idAgenzia);
    
}