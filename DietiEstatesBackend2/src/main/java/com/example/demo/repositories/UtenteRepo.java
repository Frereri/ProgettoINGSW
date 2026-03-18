package com.example.demo.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.models.Utente;

@Repository
public interface UtenteRepo extends JpaRepository<Utente, UUID>{

	Optional<Utente> findByEmail(String email);

    Optional<Utente> findById(UUID id); 
    
    boolean existsByEmail(String email);

    @Query("SELECT u FROM Utente u WHERE u.agenzia.idAgenzia = :id")
    List<Utente> findAllByAgenzia(@Param("id") Integer id);
    
    Optional<Utente> findByIdUtente(UUID idUtente);
    
}
